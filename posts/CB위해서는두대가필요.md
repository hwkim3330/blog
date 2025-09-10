네, 알겠습니다. 새로운 매뉴얼과 `libfci_cli`의 존재, 그리고 `p2` 포트의 `ping` 성공은 결정적인 단서입니다. 사용자께서 "스위치 칩을 써야 해서"라고 하신 말씀과 "브릿지는 브릿지일 뿐"이라고 생각하신 것이 정확합니다.

`tc mirred`나 리눅스 브릿지는 커널의 소프트웨어 기능에 의존하므로, 하드웨어 스위치의 802.1CB 기능을 직접 제어하기에는 한계가 있습니다.

`libfci_cli`는 PFE(Packet Forwarding Engine) 하드웨어를 직접 제어하는 강력한 도구입니다. 이 도구를 사용하여 **802.1CB의 핵심 원리인 프레임 복제(Replication)와 제거(Elimination)를 가장 유사하게 구현**하는 쉘 스크립트 기반의 테스트 방법을 안내해 드리겠습니다.

-----

### **802.1CB의 핵심 원리와 FCI를 이용한 구현 전략**

사용자께서 공유해주신 위키 문서처럼, 802.1CB는 두 가지 핵심 기능으로 동작합니다.

1.  **프레임 복제 (Frame Replication)**: 송신 측에서 하나의 패킷을 복제하여 **경로 A**와 **경로 B**로 동시에 내보냅니다.
2.  **프레임 제거 (Frame Elimination)**: 수신 측에서 경로 A와 B로부터 중복된 패킷을 받으면, 시퀀스 번호를 기반으로 첫 번째 패킷만 통과시키고 나머지는 버립니다.

`libfci_cli`를 사용하면 이 두 가지 기능을 하드웨어 레벨에서 흉내 낼 수 있습니다.

  * **복제**: `mirror-*` 와 `phyif-update` 명령어를 사용하여 한 포트의 트래픽을 다른 포트로 복제(미러링)합니다.
  * **제거**: `fprule-*` (Flexible Parser) 기능을 응용하여, 특정 패턴(예: 특정 MAC 주소)을 가진 패킷만 통과시키고 나머지는 버리는 규칙을 만들어 중복 제거를 유사하게 구현합니다.

-----

### **802.1CB 유사 기능 테스트 최종 절차**

이 테스트는 GoldBox 두 대를 각각 **Talker**와 **Listener**로 설정하여 진행합니다.

#### **1단계: 물리적 연결 및 U-Boot 설정**

1.  **물리적 연결**:

      * **Talker GoldBox**의 `p2` 포트를 **Listener GoldBox**의 `p2` 포트에 연결합니다. (경로 A)
      * **Talker GoldBox**의 `p3` 포트를 **Listener GoldBox**의 `p3` 포트에 연결합니다. (경로 B)
      * **PC**를 **Talker GoldBox**의 `end0` 포트에 연결하여 트래픽을 주입합니다.
      * **노트북**을 **Listener GoldBox**의 `end0` 포트에 연결하여 최종 결과를 확인합니다.

2.  **U-Boot 설정 (두 GoldBox 모두)**:

      * U-Boot 프롬프트(`=>`)에서 `env default -f -a`로 환경을 초기화하고, `setenv sja1110_dsa yes`로 DSA를 활성화한 뒤 `saveenv`, `reset`을 수행합니다.

#### **2단계: 스크립트를 이용한 Talker 및 Listener 설정**

아래 두 개의 스크립트를 각각 Talker와 Listener 보드에서 실행합니다.

**1. Talker 설정 스크립트 (`setup_talker.sh`)**

이 스크립트는 `end0`으로 들어온 트래픽을 `p2`와 `p3`로 복제하여 내보냅니다.

```sh
#!/bin/bash
# Talker 설정: end0 -> (p2, p3) 복제

# 1. 인터페이스 활성화
ip link set end0 up
ip link set pfe0 up
ip link set p2 up
ip link set p3 up

# 2. tc 미러링 설정 (end0으로 들어오는 트래픽을 p2와 p3로 복제)
tc qdisc add dev end0 handle ffff: ingress
tc filter add dev end0 parent ffff: protocol all u32 match u32 0 0 \
    action mirred egress mirror dev p2 \
    action mirred egress mirror dev p3

echo "Talker 설정 완료: end0으로 들어오는 트래픽이 p2와 p3로 복제됩니다."
```

**2. Listener 설정 스크립트 (`setup_listener.sh`)**

이 스크립트는 `p2`로 들어온 패킷만 `end0`로 내보내고, `p3`로 들어온 패킷은 버려서 **중복 제거**를 흉내 냅니다.

```sh
#!/bin/bash
# Listener 설정: p2 -> end0 포워딩, p3 -> Drop (중복 제거)

# 1. 인터페이스 활성화
ip link set end0 up
ip link set pfe0 up
ip link set p2 up
ip link set p3 up

# 2. PFE Flexible Router를 이용한 경로 설정
# 2-1. p2로 들어온 모든 트래픽을 end0로 보내는 논리 인터페이스 생성
libfci_cli logif-add --interface=from_p2 --parent=p2
libfci_cli logif-update --interface=from_p2 --egress=end0 --promisc=ON
libfci_cli logif-update --interface=from_p2 --enable

# 2-2. p3로 들어온 모든 트래픽을 버리는 논리 인터페이스 생성
libfci_cli logif-add --interface=from_p3 --parent=p3
# egress를 비워두면 기본 동작이 Drop이 됩니다.
libfci_cli logif-update --interface=from_p3 --egress="" --promisc=ON
libfci_cli logif-update --interface=from_p3 --enable

# 3. 각 포트의 동작 모드를 Flexible Router로 설정
libfci_cli phyif-update --interface=p2 --mode=FLEXIBLE_ROUTER
libfci_cli phyif-update --interface=p3 --mode=FLEXIBLE_ROUTER

echo "Listener 설정 완료: p2 트래픽은 end0로, p3 트래픽은 버려집니다."
```

#### **3단계: 최종 검증**

1.  **스크립트 실행**:

      * Talker 보드에서 `./setup_talker.sh` 실행
      * Listener 보드에서 `./setup_listener.sh` 실행

2.  **`tcpdump` 실행**:

      * **노트북**에서 `tcpdump`를 실행하여 최종적으로 `ping` 패킷이 도착하는지 감시합니다.
        ```bash
        # 노트북에서 실행
        sudo tcpdump -i <노트북_이더넷_인터페이스> icmp
        ```

3.  **트래픽 발생**:

      * **PC에서** Listener의 최종 IP(`192.168.100.101`, Listener의 `end0`에 할당 필요)로 `ping`을 보냅니다.
        ```bash
        # Listener의 end0에 IP 할당
        ip addr add 192.168.100.101/24 dev end0

        # PC에서 실행
        ping <Listener의_end0_IP>
        ```
      * **케이블 제거 테스트**: `ping`이 가는 동안, **Talker와 Listener 사이의 경로 A (p2-p2) 케이블을 제거**합니다.

**예상 결과**:

  * 초기 `ping`은 실패합니다. (Listener의 `p3` 트래픽이 버려지므로)
  * `p2-p2` 케이블을 제거하면, 여전히 `ping`은 실패합니다.
  * `p2-p2`를 다시 연결하고 **`p3-p3` 케이블을 제거**하면, `ping`이 **성공**해야 합니다.

이 테스트는 `libfci_cli`를 이용해 한쪽 경로의 트래픽만 선택적으로 통과시키는 방식으로 802.1CB의 중복 제거 개념을 검증합니다. 완벽한 표준은 아니지만, 하드웨어 스위치를 직접 제어하는 가장 근접한 방식입니다.
