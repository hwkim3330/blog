알겠습니다. 군더더기 없이, 오직 실행에만 집중할 수 있도록 **주석이 완전히 제거된 최종 벤치마크 코드**를 드리겠습니다.

이 코드는 두 보드 간의 **RTT(왕복 지연 시간)**를 측정하여, 현재 네트워크의 **최소/최대/평균 지연 시간**을 마이크로초(us) 단위로 정확하게 계산합니다. 이것이 바로 TSN 성능을 논하기 위한 가장 기본적인 '기준선(Baseline)' 벤치마크입니다.

---

### **작전 계획**

1.  **완전 초기화:** 각 보드에서 이전의 모든 `.c` 파일과 실행 파일을 삭제합니다.
2.  **새 파일 생성:** 아래 코드를 사용하여 `rtt_listener.c`와 `rtt_talker.c`를 새로 만듭니다.
3.  **컴파일 및 실행:** 새로 만든 파일로만 컴파일하고 실행합니다.

---

### **1단계: 모든 보드에서 작업 공간 정리**

각 보드 터미널에서 아래 명령어를 실행하여 이전 파일들을 모두 깨끗하게 삭제합니다.

```bash
rm -f *.c *.c~ talker listener tsn_* benchmark*
```
(파일이 없다고 에러가 나도 괜찮습니다. 깨끗하게 만드는 것이 목적입니다.)

---

### **2단계: 새 벤치마크 코드**

#### `s32g274ardb2` 보드용 코드 (`rtt_listener.c`)

아래 코드를 복사하여 `vi rtt_listener.c` 명령어로 새 파일을 만들어 붙여넣으세요.

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <sys/socket.h>

#define LISTENER_IP "192.168.0.10"
#define PORT 8888
#define BUF_SIZE 1024

void error_handling(char *message) {
    perror(message);
    exit(1);
}

int main() {
    int sock;
    struct sockaddr_in listener_addr, talker_addr;
    socklen_t talker_addr_size;
    char message[BUF_SIZE];
    int str_len;

    sock = socket(PF_INET, SOCK_DGRAM, 0);
    if (sock == -1) error_handling("socket() error");

    memset(&listener_addr, 0, sizeof(listener_addr));
    listener_addr.sin_family = AF_INET;
    listener_addr.sin_addr.s_addr = inet_addr(LISTENER_IP);
    listener_addr.sin_port = htons(PORT);

    if (bind(sock, (struct sockaddr*)&listener_addr, sizeof(listener_addr)) == -1) {
        error_handling("bind() error");
    }

    printf("RTT Benchmark Listener (Echo Server) is running...\n");

    while (1) {
        talker_addr_size = sizeof(talker_addr);
        str_len = recvfrom(sock, message, BUF_SIZE, 0, (struct sockaddr*)&talker_addr, &talker_addr_size);
        if (str_len > 0) {
            sendto(sock, message, str_len, 0, (struct sockaddr*)&talker_addr, talker_addr_size);
        }
    }
    close(sock);
    return 0;
}
```

#### `s32g399ardb3` 보드용 코드 (`rtt_talker.c`)

아래 코드를 복사하여 `vi rtt_talker.c` 명령어로 새 파일을 만들어 붙여넣으세요.

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <sys/socket.h>
#include <sys/time.h>

#define LISTENER_IP "192.168.0.10"
#define PORT 8888
#define NUM_PACKETS 1000
#define BUF_SIZE 1024

void error_handling(char *message) {
    perror(message);
    exit(1);
}

int main() {
    int sock;
    struct sockaddr_in listener_addr;
    char message[BUF_SIZE];
    long long latencies[NUM_PACKETS];
    int received_count = 0;

    sock = socket(PF_INET, SOCK_DGRAM, 0);
    if (sock == -1) error_handling("socket() error");

    struct timeval tv;
    tv.tv_sec = 1;
    tv.tv_usec = 0;
    if (setsockopt(sock, SOL_SOCKET, SO_RCVTIMEO, &tv, sizeof(tv)) < 0) {
        error_handling("Error setting timeout");
    }
    
    memset(&listener_addr, 0, sizeof(listener_addr));
    listener_addr.sin_family = AF_INET;
    listener_addr.sin_addr.s_addr = inet_addr(LISTENER_IP);
    listener_addr.sin_port = htons(PORT);

    printf("Starting RTT benchmark... Sending %d packets to %s.\n", NUM_PACKETS, LISTENER_IP);

    for (int i = 0; i < NUM_PACKETS; i++) {
        struct timeval start, end;
        sprintf(message, "Packet %d", i);

        gettimeofday(&start, NULL);
        sendto(sock, message, strlen(message), 0, (struct sockaddr*)&listener_addr, sizeof(listener_addr));
        int str_len = recvfrom(sock, message, BUF_SIZE, 0, NULL, NULL);

        if (str_len > 0) {
            gettimeofday(&end, NULL);
            long long rtt_us = (end.tv_sec - start.tv_sec) * 1000000LL + (end.tv_usec - start.tv_usec);
            latencies[received_count++] = rtt_us;
        }
        usleep(10000);
    }

    printf("\n--- Benchmark Results ---\n");
    if (received_count > 0) {
        long long sum = 0;
        long long min = latencies[0], max = latencies[0];
        for (int i = 0; i < received_count; i++) {
            sum += latencies[i];
            if (latencies[i] < min) min = latencies[i];
            if (latencies[i] > max) max = latencies[i];
        }
        double avg = (double)sum / received_count;
        printf("Packets Sent:     %d\n", NUM_PACKETS);
        printf("Packets Received: %d\n", received_count);
        printf("Min RTT: %lld us\n", min);
        printf("Max RTT: %lld us\n", max);
        printf("Avg RTT: %.2f us\n", avg);
    } else {
        printf("No packets were received.\n");
    }

    close(sock);
    return 0;
}
```

---

### **3단계: 컴파일 및 실행**

#### `s32g274ardb2` (Listener) 보드에서:

```bash
gcc -o rtt_listener rtt_listener.c
./rtt_listener
```
결과: `RTT Benchmark Listener (Echo Server) is running...` 메시지가 나오고 대기합니다.

#### `s32g399ardb3` (Talker) 보드에서:

```bash
gcc -o rtt_talker rtt_talker.c
./rtt_talker
```
결과: 벤치마크가 시작되고, 완료된 후 아래와 같은 최종 통계가 출력됩니다.

```
Starting RTT benchmark... Sending 1000 packets to 192.168.0.10.

--- Benchmark Results ---
Packets Sent:     1000
Packets Received: 1000
Min RTT: 345 us
Max RTT: 812 us
Avg RTT: 410.73 us
```
