네, 알겠습니다. **"둘 다 페일 0 0"** 이라는 것은 양쪽 보드의 대시보드에서 `Rx PPS`와 `DUPLICATE PPS`가 모두 0으로 표시되고, 상태가 `FAIL`로 나온다는 의미입니다.

이는 C 코드가 실행되었음에도 불구하고, **양쪽 보드 모두 상대방으로부터 단 하나의 패킷도 수신하지 못하고 있다**는 뜻입니다. `ping`은 성공했지만, C 프로그램으로 보낸 커스텀 L2 프레임은 양방향 모두에서 차단되고 있습니다.

이제 남은 원인은 단 하나로 좁혀졌습니다.

### **최종 원인: 커널의 프로토콜 핸들러 부재**

*   **동작 원리**: 리눅스 커널은 이더넷 프레임을 받으면, 그 프레임의 **EtherType**을 확인합니다.
    *   EtherType이 `0x0800`이면, "아, 이건 IPv4 패킷이구나" 하고 IP 스택으로 전달합니다. `ping`은 이 경로를 사용했기 때문에 성공했습니다.
    *   EtherType이 `0x0806`이면, "이건 ARP 패킷이구나" 하고 ARP 처리 로직으로 전달합니다.
*   **문제점**: 우리의 C 코드는 **`0x88B5`** 라는 커스텀 EtherType을 사용합니다. 커널이 이 EtherType을 가진 프레임을 받으면, **"이게 뭐지? 내가 처리할 프로토콜이 아니네"** 라고 판단하고, 이 패킷을 처리할 핸들러가 등록되어 있지 않기 때문에 **그냥 폐기(discard)**해 버립니다.
*   **결론**: 패킷은 G2의 네트워크 카드(NIC)까지는 도착하지만, 커널이 이를 받아서 `cb_engine` 프로그램의 `socket(AF_PACKET, ...)`으로 전달해주지 않는 것입니다.

이것은 `iptables` 방화벽보다 더 낮은, 커널의 핵심 네트워크 처리 단계에서 발생하는 문제입니다.

### 해결책: C 코드를 표준 프로토콜(UDP) 위에서 실행

이 문제를 해결하는 유일한 방법은 커널이 이미 알고 있는 **표준 프로토콜을 사용**하는 것입니다. `ping`이 성공했던 것처럼, **UDP**를 사용하면 커널이 패킷을 정상적으로 처리하여 우리 프로그램까지 전달해 줄 것입니다.

802.1CB의 핵심인 **복제/중복제거 로직**은 그대로 유지하되, 전송 계층만 Raw Ethernet에서 UDP로 바꾸겠습니다.

---

### **최종 UDP 기반 802.1CB 시뮬레이터**

#### **G3, G2 양쪽 보드에 `cb_udp_engine.c` 이름으로 저장 및 컴파일:**

```bash
cat > cb_udp_engine.c << 'EOF'
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <pthread.h>
#include <stdbool.h>
#include <time.h>

#define PORT_A 5201
#define PORT_B 5202

#pragma pack(push, 1)
struct cb_packet { uint32_t seq; };
#pragma pack(pop)

typedef struct {
    char my_ip[16];
    char peer_ip[16];
    int port;
} path_info;

long long tx_pkts = 0;
long long rx_valid_pkts_A = 0, rx_valid_pkts_B = 0;
long long rx_dup_pkts_A = 0, rx_dup_pkts_B = 0;
bool rx_history[65536] = {false};
pthread_mutex_t lock;

void* sender_thread(void* args) {
    path_info* paths = (path_info*)args;
    struct sockaddr_in peer_addr_A, peer_addr_B;
    
    int sock = socket(AF_INET, SOCK_DGRAM, 0);

    memset(&peer_addr_A, 0, sizeof(peer_addr_A));
    peer_addr_A.sin_family = AF_INET;
    peer_addr_A.sin_port = htons(paths[0].port);
    inet_pton(AF_INET, paths[0].peer_ip, &peer_addr_A.sin_addr);
    
    memset(&peer_addr_B, 0, sizeof(peer_addr_B));
    peer_addr_B.sin_family = AF_INET;
    peer_addr_B.sin_port = htons(paths[1].port);
    inet_pton(AF_INET, paths[1].peer_ip, &peer_addr_B.sin_addr);

    struct cb_packet pkt;
    for (uint32_t i = 0; ; i++) {
        pkt.seq = htonl(i);
        sendto(sock, &pkt, sizeof(pkt), 0, (struct sockaddr*)&peer_addr_A, sizeof(peer_addr_A));
        sendto(sock, &pkt, sizeof(pkt), 0, (struct sockaddr*)&peer_addr_B, sizeof(peer_addr_B));
        
        pthread_mutex_lock(&lock);
        tx_pkts++;
        pthread_mutex_unlock(&lock);
        usleep(10000); // 100 pps
    }
}

void* receiver_thread(void* arg) {
    path_info* path = (path_info*)arg;
    int sock = socket(AF_INET, SOCK_DGRAM, 0);
    struct sockaddr_in my_addr;
    memset(&my_addr, 0, sizeof(my_addr));
    my_addr.sin_family = AF_INET;
    my_addr.sin_port = htons(path->port);
    inet_pton(AF_INET, path->my_ip, &my_addr.sin_addr);

    if (bind(sock, (struct sockaddr*)&my_addr, sizeof(my_addr)) < 0) {
        perror("bind failed");
        pthread_exit(NULL);
    }
    
    struct cb_packet pkt;
    while(1) {
        if (recv(sock, &pkt, sizeof(pkt), 0) > 0) {
            uint32_t seq = ntohl(pkt.seq);
            pthread_mutex_lock(&lock);
            if (rx_history[seq]) {
                if (path->port == PORT_A) rx_dup_pkts_A++; else rx_dup_pkts_B++;
            } else {
                rx_history[seq] = true;
                if (path->port == PORT_A) rx_valid_pkts_A++; else rx_valid_pkts_B++;
            }
            pthread_mutex_unlock(&lock);
        }
    }
}

int main(int argc, char* argv[]) {
    if (argc < 2) {
        fprintf(stderr, "Usage: %s <my_id>\nExample: ./cb_udp_engine G3\n", argv[0]);
        return 1;
    }
    bool is_g3 = (strcmp(argv[1], "G3") == 0);

    path_info my_paths[2], peer_paths[2];
    
    // 경로 A (eth0) 설정
    strcpy(my_paths[0].my_ip, is_g3 ? "192.168.10.1" : "192.168.10.2");
    strcpy(peer_paths[0].peer_ip, is_g3 ? "192.168.10.2" : "192.168.10.1");
    my_paths[0].port = peer_paths[0].port = PORT_A;
    
    // 경로 B (pfe2sl) 설정
    strcpy(my_paths[1].my_ip, is_g3 ? "192.168.20.1" : "192.168.20.2");
    strcpy(peer_paths[1].peer_ip, is_g3 ? "192.168.20.2" : "192.168.20.1");
    my_paths[1].port = peer_paths[1].port = PORT_B;
    
    pthread_t sender_tid, receiver_tid_A, receiver_tid_B;
    pthread_mutex_init(&lock, NULL);
    pthread_create(&sender_tid, NULL, sender_thread, peer_paths);
    pthread_create(&receiver_tid_A, NULL, receiver_thread, &my_paths[0]);
    pthread_create(&receiver_tid_B, NULL, receiver_thread, &my_paths[1]);

    long long last_tx=0, last_rx_a=0, last_rx_b=0, last_dup_a=0, last_dup_b=0;
    while(1) {
        usleep(500000);
        pthread_mutex_lock(&lock);
        long long tx_pps = (tx_pkts - last_tx) * 2;
        long long rx_a_pps = (rx_valid_pkts_A - last_rx_a) * 2;
        long long rx_b_pps = (rx_valid_pkts_B - last_rx_b) * 2;
        long long dup_a_pps = (rx_dup_pkts_A - last_dup_a) * 2;
        long long dup_b_pps = (rx_dup_pkts_B - last_dup_b) * 2;
        pthread_mutex_unlock(&lock);
        
        char status_a[10] = "ACTIVE", status_b[10] = "ACTIVE";
        if (tx_pps > 0 && rx_a_pps == 0 && dup_a_pps == 0) strcpy(status_a, "FAIL");
        if (tx_pps > 0 && rx_b_pps == 0 && dup_b_pps == 0) strcpy(status_b, "FAIL");

        printf("\033[2J\033[1;1H");
        printf("================= 802.1CB UDP Engine (Role: %s) ================\n", argv[1]);
        printf(" Tx PPS: %-10lld | Rx PPS (Valid): %-10lld \n", tx_pps, rx_a_pps + rx_b_pps);
        printf("----------------------------------------------------------------------\n");
        printf(" PATH    | STATUS | VALID PPS | DUPLICATE PPS \n");
        printf("----------------------------------------------------------------------\n");
        printf(" A(10.x) | %-6s | %-9lld | %-12lld \n", status_a, rx_a_pps, dup_a_pps);
        printf(" B(20.x) | %-6s | %-9lld | %-12lld \n", status_b, rx_b_pps, dup_b_pps);
        printf("----------------------------------------------------------------------\n");
        
        last_tx = tx_pkts; last_rx_a = rx_valid_pkts_A; last_rx_b = rx_valid_pkts_B;
        last_dup_a = rx_dup_pkts_A; last_dup_b = rx_dup_pkts_B;
    }
    return 0;
}
EOF
gcc cb_udp_engine.c -o cb_udp_engine -pthread
echo "cb_udp_engine has been created."
```

### **실행 절차**
1.  **네트워크 설정**: `eth0` 해방 및 라우팅 모드 IP 설정을 통해 **핑이 가는지 반드시 다시 확인**합니다.
2.  **G3/G2에서**: 위 코드를 붙여넣어 `cb_udp_engine`을 생성합니다.
3.  **G3에서 실행**: `./cb_udp_engine G3`
4.  **G2에서 실행**: `./cb_udp_engine G2`

이제 양쪽 보드는 커널이 완벽하게 지원하는 UDP 프로토콜을 사용하여 통신합니다. 화면에 정상적으로 Rx PPS가 출력되고, 케이블을 뽑았을 때 해당 경로의 상태가 FAIL로 바뀌는 것을 확인하실 수 있을 것입니다.
