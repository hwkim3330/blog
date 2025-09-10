알겠습니다. 현재 환경의 극심한 제약(`ethtool`, `gcc`, 패키지 매니저 없음, `tc` 빌드 불가)을 충분히 인지하고 있으며, `libfci_cli`만으로 "TSN처럼 보이도록" 시각화까지 포함된 쉘 스크립트 코드를 요청하신 것으로 이해했습니다.

**매우 중요한 전제 조건 및 경고:**

1.  **"TSN처럼 보이는 것"의 의미:** 실제 TSN 표준(802.1AS, Qbv, CB 등)을 준수하는 정밀한 시간 동기화, 시간 기반 게이트 제어, 프레임 복제/제거는 **절대 불가능합니다.** 이 스크립트는 PFE 하드웨어의 특정 기능을 조작하여 TSN의 *개념적인 동작*을 시각적으로 "연출"하는 것을 목표로 합니다.
2.  **시각화의 한계:** 쉘 스크립트만으로 그래픽 UI나 정교한 차트를 그리는 것은 불가능합니다. 터미널 기반의 텍스트와 간단한 ASCII 아트를 사용하여 "상태 변화"를 표현하는 수준이 될 것입니다.
3.  **PFE 펌웨어 의존성:** 모든 것은 `libfci_cli` 명령어가 PFE 펌웨어에 의해 어떻게 해석되고 실행되는지에 전적으로 의존합니다. PFE가 예상대로 반응하지 않으면 시뮬레이션은 의미가 없습니다.
4.  **외부 트래픽 생성 필수:** 이 스크립트는 PFE를 설정할 뿐, 테스트 트래픽을 직접 생성하지 않습니다. "시각화"를 제대로 보려면 외부에서 S32G의 관련 포트로 적절한 트래픽(예: 고우선순위, 저우선순위 스트림)을 지속적으로 보내야 합니다.

**시나리오:**

*   **포트:** `emac0` (입력/고우선순위 트래픽 소스), `emac2` (출력/스케줄링 관찰 지점)
*   **개념 1: 시간 동기화 "연출" (802.1AS 흉내)**
    *   `emac0`과 `emac2`를 L2 브릿지로 연결하고 양쪽에 `--ptp-conf ON`을 설정합니다.
    *   주기적으로 "PTP SYNC 메시지 전송/수신"이라는 텍스트를 출력하여 마치 시간 동기화 이벤트가 발생하는 것처럼 보입니다. (실제 패킷 X)
*   **개념 2: 시간 기반 스케줄링 "연출" (802.1Qbv TAS 흉내)**
    *   `emac2` (출력 포트)의 QoS 큐 두 개(Q_HIGH, Q_LOW)를 사용합니다.
    *   쉘 스크립트 루프와 `sleep`을 사용하여 주기적으로 `libfci_cli qos-sch-update` (가정: DWRR 가중치 변경)를 호출하여 Q_HIGH에 높은 가중치를 주었다가, 다음 주기에는 Q_LOW에 높은 가중치를 줍니다.
    *   현재 "열린 게이트" (높은 가중치를 가진 큐)를 텍스트로 시각화합니다.
*   **시각화:**
    *   터미널에 현재 "PTP 상태" (단순 텍스트), "게이트 상태" (Q_HIGH 또는 Q_LOW), 그리고 `libfci_cli`를 통해 얻을 수 있는 PFE 인터페이스 및 QoS 큐 통계(패킷 카운터 등)를 주기적으로 업데이트하여 표시합니다.

**`pfe_tsn_visual_simulation.sh`**

```sh
#!/usr/bin/env bash
#
# !! EXTREMELY EXPERIMENTAL - TSN VISUAL SIMULATION SCRIPT using libfci_cli !!
#
# This script attempts to *visually simulate* concepts of gPTP and Time-Aware Shaping
# using only libfci_cli commands on a resource-constrained S32G board.
#
# IT DOES NOT IMPLEMENT REAL TSN AND WILL NOT ACHIEVE REAL SYNCHRONIZATION OR SCHEDULING.
#
# Assumptions:
# - emac0 (PFE_IN_PORT) and emac2 (PFE_OUT_PORT) are used.
# - libfci_cli commands work.
# - External traffic generators are needed to see effects on counters.

set -euo pipefail

# --- Configuration ---
PFE_IN_PORT="emac0"  # For "incoming" traffic, PTP master-like side
PFE_OUT_PORT="emac2" # For "outgoing" traffic, scheduling observation, PTP slave-like side

PTP_SIM_VLAN_ID=887       # VLAN ID for conceptual PTP path
DATA_SCHED_VLAN_ID=776    # VLAN ID for data path for scheduling simulation

Q_HIGH_PRIO=0             # QoS Queue ID for "high priority" traffic
Q_LOW_PRIO=1              # QoS Queue ID for "low priority" traffic

GATE_INTERVAL_SECONDS=3   # How often the "gate" state changes
PTP_SYNC_INTERVAL_SECONDS=1 # How often "PTP sync event" is displayed
SIMULATION_DURATION_SECONDS=60 # Total duration of the simulation

# ANSI Colors for better visualization (optional)
C_RESET='\033[0m'
C_RED='\033[0;31m'
C_GREEN='\033[0;32m'
C_YELLOW='\033[0;33m'
C_BLUE='\033[0;34m'
C_CYAN='\033[0;36m'

# --- Helper Functions ---
log_info() {
    echo -e "${C_CYAN}[INFO] $(date '+%Y-%m-%d %H:%M:%S') $1${C_RESET}"
}

run_libfci() {
    # echo -e "${C_BLUE}Executing: libfci_cli $*${C_RESET}" # Verbose
    if libfci_cli "$@" > /dev/null 2>&1; then # Suppress output for cleaner display
        : # echo -e "${C_GREEN}Success: libfci_cli $*${C_RESET}"
    else
        echo -e "${C_RED}WARN: Failed to execute: libfci_cli $* (continuing)${C_RESET}"
    fi
}

# Function to clear screen and print header
print_header() {
    clear
    echo -e "${C_YELLOW}===================================================================${C_RESET}"
    echo -e "${C_YELLOW}      PFE-Based TSN Visual Simulation (Extremely Experimental)     ${C_RESET}"
    echo -e "${C_YELLOW}===================================================================${C_RESET}"
    echo -e " Target Ports: IN/PTP_Master=${C_GREEN}$PFE_IN_PORT${C_RESET}, OUT/PTP_Slave/Sched=${C_GREEN}$PFE_OUT_PORT${C_RESET}"
    echo -e " Gate Interval: ${GATE_INTERVAL_SECONDS}s, PTP Sync Display: ${PTP_SYNC_INTERVAL_SECONDS}s"
    echo -e " Total Duration: ${SIMULATION_DURATION_SECONDS}s"
    echo -e "${C_YELLOW}-------------------------------------------------------------------${C_RESET}"
}

# Function to display current "PTP" status
display_ptp_status() {
    local status_text="$1"
    echo -e " PTP Status   : ${C_GREEN}${status_text}${C_RESET}"
}

# Function to display current "Gate" status for TAS simulation
display_gate_status() {
    local gate_open_for="$1"
    local high_color=$C_RED # Default to RED (closed)
    local low_color=$C_RED  # Default to RED (closed)

    if [ "$gate_open_for" = "HIGH_PRIO" ]; then
        high_color=$C_GREEN
    elif [ "$gate_open_for" = "LOW_PRIO" ]; then
        low_color=$C_GREEN
    fi
    echo -e " Gate Status  : Q_HIGH(${Q_HIGH_PRIO}) [${high_color}******${C_RESET}] Q_LOW(${Q_LOW_PRIO}) [${low_color}******${C_RESET}] (Open for: $gate_open_for)"
}

# Function to display PFE interface stats (simplified)
# Needs actual libfci_cli commands to parse stats. This is a placeholder.
display_pfe_stats() {
    local port="$1"
    # Placeholder: In a real scenario, parse `libfci_cli phyif-print --interface $port -v`
    # or specific stats commands if they exist.
    local rx_pkts=$(libfci_cli phyif-print --interface $port -v 2>/dev/null | grep "rx_total_pak" | awk '{print $NF}' || echo "N/A")
    local tx_pkts=$(libfci_cli phyif-print --interface $port -v 2>/dev/null | grep "tx_total_pak" | awk '{print $NF}' || echo "N/A")
    echo -e " Stats ($port): RX Pkts: ${C_YELLOW}${rx_pkts}${C_RESET}, TX Pkts: ${C_YELLOW}${tx_pkts}${C_RESET}"

    if [ "$port" = "$PFE_OUT_PORT" ]; then
        local q_high_pkts=$(libfci_cli qos-que-print --interface $port --que $Q_HIGH_PRIO 2>/dev/null | grep "tx_pak_cnt" | awk '{print $NF}' || echo "N/A")
        local q_low_pkts=$(libfci_cli qos-que-print --interface $port --que $Q_LOW_PRIO 2>/dev/null | grep "tx_pak_cnt" | awk '{print $NF}' || echo "N/A")
        echo -e " Stats (QoS $port): Q_HIGH(${Q_HIGH_PRIO}) Pkts: ${C_YELLOW}${q_high_pkts}${C_RESET}, Q_LOW(${Q_LOW_PRIO}) Pkts: ${C_YELLOW}${q_low_pkts}${C_RESET}"
    fi
}

# --- Setup Functions ---
initial_cleanup() {
    log_info "Performing initial cleanup..."
    run_libfci route-and-cntk-reset --all
    for v_id in $PTP_SIM_VLAN_ID $DATA_SCHED_VLAN_ID; do
      libfci_cli bd-print 2>/dev/null | grep -q "domain ${v_id}" && run_libfci bd-del --vlan "$v_id"
    done
    for p in "$PFE_IN_PORT" "$PFE_OUT_PORT"; do
        run_libfci phyif-update --interface "$p" --mode DEFAULT --disable --ptp-conf OFF
        # Attempt to reset QoS queue weights/config (highly PFE specific)
        for qid_reset in $(seq 0 7); do
            run_libfci qos-que-update --interface "$p" --que "$qid_reset" --qdisc TAIL_DROP # Example reset
            # run_libfci qos-sch-update --interface "$p" --sch 0 --sch-in "que${qid_reset}:1" # Example reset
        done
    done
    sleep 1
    log_info "Initial cleanup done."
}

setup_l2_bridge() {
    local p_a="$1"
    local p_b="$2"
    local v_id="$3"
    local purpose="$4"
    log_info "Setting up L2 Bridge ($purpose) VLAN $v_id: $p_a <-> $p_b"
    run_libfci bd-add --vlan "$v_id"
    run_libfci bd-update --vlan "$v_id" --ucast-miss FLOOD --mcast-miss FLOOD
    run_libfci bd-insif --vlan "$v_id" --interface "$p_a" --tag OFF
    run_libfci bd-insif --vlan "$v_id" --interface "$p_b" --tag OFF
    run_libfci phyif-update --interface "$p_a" --mode VLAN_BRIDGE --enable
    run_libfci phyif-update --interface "$p_b" --mode VLAN_BRIDGE --enable
}

setup_ptp_simulation_path() {
    log_info "Setting up conceptual PTP path..."
    setup_l2_bridge "$PFE_IN_PORT" "$PFE_OUT_PORT" "$PTP_SIM_VLAN_ID" "PTP_Sim"
    run_libfci phyif-update --interface "$PFE_IN_PORT" --ptp-conf ON
    run_libfci phyif-update --interface "$PFE_OUT_PORT" --ptp-conf ON
}

setup_data_scheduling_path() {
    log_info "Setting up data path for scheduling simulation..."
    setup_l2_bridge "$PFE_IN_PORT" "$PFE_OUT_PORT" "$DATA_SCHED_VLAN_ID" "DATA_Sim"

    log_info "Configuring QoS queues on egress port $PFE_OUT_PORT..."
    run_libfci qos-que-update --interface "$PFE_OUT_PORT" --que $Q_HIGH_PRIO --qdisc TAIL_DROP --thmax 255
    run_libfci qos-que-update --interface "$PFE_OUT_PORT" --que $Q_LOW_PRIO --qdisc TAIL_DROP --thmax 255
    # Initial state: Low priority for HIGH_PRIO queue to show change later
    # This assumes --sch-in can take a partial list or updates specific entries.
    # The exact syntax for `qos-sch-update --sch-in` is CRITICAL and might need adjustment.
    # Example: "que0:10,que1:1,que2:1,que3:1,que4:1,que5:1,que6:1,que7:1" if all must be listed.
    # We will try to update only relevant queues.
    log_info "Setting initial QoS weights: Q_HIGH(${Q_HIGH_PRIO}) LOW, Q_LOW(${Q_LOW_PRIO}) HIGH"
    run_libfci qos-sch-update --interface "$PFE_OUT_PORT" --sch 0 --sch-algo DWRR --sch-in "que${Q_HIGH_PRIO}:1,que${Q_LOW_PRIO}:100"
}

# --- Main Simulation ---
initial_cleanup
setup_ptp_simulation_path
setup_data_scheduling_path

# Trap SIGINT (Ctrl+C) for graceful exit
trap "echo -e '\n${C_RED}Simulation interrupted. Cleaning up...${C_RESET}'; initial_cleanup; exit 0" SIGINT

current_time=0
gate_state="LOW_PRIO" # Initial gate state, Q_LOW has higher weight
ptp_message_counter=0
ptp_status_text="Initializing..."

log_info "Starting visual simulation. Press Ctrl+C to stop."
log_info "Ensure external traffic is being sent to $PFE_IN_PORT for data scheduling path (VLAN $DATA_SCHED_VLAN_ID)."
log_info "And conceptual PTP packets (EtherType 0x88F7) for PTP path (VLAN $PTP_SIM_VLAN_ID)."
sleep 2 # Give a moment to read messages

while [ "$current_time" -lt "$SIMULATION_DURATION_SECONDS" ]; do
    print_header
    echo -e " Simulation Time: ${C_YELLOW}${current_time}s / ${SIMULATION_DURATION_SECONDS}s${C_RESET}"
    echo -e "${C_YELLOW}-------------------------------------------------------------------${C_RESET}"

    # PTP Status Update (every PTP_SYNC_INTERVAL_SECONDS)
    if [ $((current_time % PTP_SYNC_INTERVAL_SECONDS)) -eq 0 ]; then
        ptp_message_counter=$((ptp_message_counter + 1))
        if [ $((ptp_message_counter % 4)) -eq 1 ]; then
            ptp_status_text="Master Announce Sent ($PFE_IN_PORT)"
        elif [ $((ptp_message_counter % 4)) -eq 2 ]; then
            ptp_status_text="Slave Received Announce ($PFE_OUT_PORT)"
        elif [ $((ptp_message_counter % 4)) -eq 3 ]; then
            ptp_status_text="Master Sync Sent ($PFE_IN_PORT)"
        else
            ptp_status_text="Slave Synced to Master ($PFE_OUT_PORT) - Offset: $((RANDOM % 100))ns" # Fake offset
        fi
    fi
    display_ptp_status "$ptp_status_text"

    # TAS Gate Status Update (every GATE_INTERVAL_SECONDS)
    if [ $((current_time % GATE_INTERVAL_SECONDS)) -eq 0 ]; then
        if [ "$gate_state" = "LOW_PRIO" ]; then
            gate_state="HIGH_PRIO"
            log_info "Visual: Gate OPEN for Q_HIGH_PRIO"
            run_libfci qos-sch-update --interface "$PFE_OUT_PORT" --sch 0 --sch-algo DWRR --sch-in "que${Q_HIGH_PRIO}:100,que${Q_LOW_PRIO}:1"
        else
            gate_state="LOW_PRIO"
            log_info "Visual: Gate OPEN for Q_LOW_PRIO"
            run_libfci qos-sch-update --interface "$PFE_OUT_PORT" --sch 0 --sch-algo DWRR --sch-in "que${Q_HIGH_PRIO}:1,que${Q_LOW_PRIO}:100"
        fi
    fi
    display_gate_status "$gate_state"
    echo -e "${C_YELLOW}-------------------------------------------------------------------${C_RESET}"

    # Display PFE Stats
    display_pfe_stats "$PFE_IN_PORT"
    display_pfe_stats "$PFE_OUT_PORT"
    echo -e "${C_YELLOW}===================================================================${C_RESET}"
    echo -e "(Ctrl+C to exit)"

    sleep 1
    current_time=$((current_time + 1))
done

log_info "Simulation finished."
initial_cleanup # Clean up PFE config
echo -e "${C_GREEN}Done.${C_RESET}"
exit 0
```

**스크립트 설명:**

1.  **구성 변수:** 스크립트 상단에서 포트 이름, VLAN ID, QoS 큐 ID, 시뮬레이션 간격 등을 설정합니다.
2.  **색상 및 로깅:** 터미널 가독성을 위해 ANSI 색상과 간단한 로깅 함수를 사용합니다.
3.  **`print_header`, `display_ptp_status`, `display_gate_status`, `display_pfe_stats`:** 화면에 정보를 표시하는 함수들입니다. `display_pfe_stats`는 `libfci_cli`의 실제 출력에서 통계치를 파싱해야 제대로 동작합니다 (현재는 매우 기본적인 예시).
4.  **`initial_cleanup`:** 스크립트 시작 및 종료 시 이전 PFE 설정을 정리하려고 시도합니다.
5.  **`setup_l2_bridge`:** 두 PFE 포트 간에 특정 VLAN ID를 사용하여 L2 브릿지를 설정합니다.
6.  **`setup_ptp_simulation_path`:** "PTP" 트래픽이 오갈 것으로 예상되는 경로를 설정하고, 관련 포트에 `--ptp-conf ON`을 적용합니다.
7.  **`setup_data_scheduling_path`:** "데이터" 트래픽이 오갈 경로를 설정하고, 출력 포트의 QoS 큐를 초기화합니다 (Q_HIGH는 낮은 가중치, Q_LOW는 높은 가중치로 시작).
8.  **메인 시뮬레이션 루프:**
    *   지정된 `SIMULATION_DURATION_SECONDS` 동안 실행됩니다.
    *   매초 화면을 업데이트합니다.
    *   `PTP_SYNC_INTERVAL_SECONDS`마다 "PTP 상태" 텍스트를 변경하여 마치 PTP 이벤트가 발생하는 것처럼 연출합니다.
    *   `GATE_INTERVAL_SECONDS`마다 "게이트 상태"를 변경합니다. 즉, `qos-sch-update`를 호출하여 `Q_HIGH_PRIO`와 `Q_LOW_PRIO`의 스케줄링 가중치를 번갈아 높여줍니다.
    *   PFE 포트 통계(수신/송신 패킷, QoS 큐별 패킷 카운트)를 표시하려고 시도합니다. **이 부분은 `libfci_cli phyif-print -v` 및 `qos-que-print` 명령어의 실제 출력을 파싱하도록 수정해야 정확한 값을 볼 수 있습니다.**

**실행 및 관찰:**

1.  스크립트를 S32G 보드에 저장하고 (`pfe_tsn_visual_simulation.sh`), 실행 권한을 줍니다 (`chmod +x`).
2.  **가장 중요:** 외부에서 S32G의 `emac0` (`PFE_IN_PORT`)으로 두 종류의 트래픽을 지속적으로 보내야 합니다:
    *   **"PTP 유사 트래픽":** VLAN ID `887` (또는 `PTP_SIM_VLAN_ID` 값), EtherType `0x88F7`. (이 트래픽은 `--ptp-conf ON`에 의해 PFE가 인지하는지 보는 용도)
    *   **"고우선순위 데이터 트래픽":** VLAN ID `776` (또는 `DATA_SCHED_VLAN_ID` 값). 이 트래픽이 PFE 내부적으로 `Q_HIGH_PRIO` (큐 0)로 분류되도록 유도해야 합니다 (예: 해당 VLAN의 PCP 값을 높게 설정하거나, `libfci_cli fprule-add` 등으로 명시적 분류 규칙 추가).
    *   **"저우선순위 데이터 트래픽":** VLAN ID `776`. 이 트래픽이 PFE 내부적으로 `Q_LOW_PRIO` (큐 1)로 분류되도록 유도해야 합니다.
3.  스크립트를 실행합니다: `./pfe_tsn_visual_simulation.sh`
4.  터미널 화면에서 다음을 관찰합니다:
    *   "PTP Status"가 주기적으로 변경되는 모습.
    *   "Gate Status"에서 `Q_HIGH`와 `Q_LOW`의 게이트가 번갈아 열리는(`******` 녹색 표시) 모습.
    *   "Stats" 부분에서 RX/TX 패킷 카운트와 QoS 큐별 패킷 카운트가 증가하는 모습. 만약 "게이트"가 실제로 트래픽 흐름에 영향을 준다면, 게이트가 열린 큐의 패킷 카운트가 더 빠르게 증가해야 합니다.

**이 스크립트의 한계와 실제 TSN과의 차이:**

*   **시간의 정확성 부재:** 모든 "시간 간격"은 쉘의 `sleep`에 의존하므로 전혀 정밀하지 않습니다. 실제 TAS는 마이크로초 단위의 정밀한 게이트 제어를 합니다.
*   **PTP 프로토콜 부재:** 실제 PTP 메시지 교환, BMCA, 클럭 동기화는 없습니다.
*   **트래픽 분류의 중요성:** "TAS 유사" 스케줄링이 의미 있으려면, 외부에서 주입하는 트래픽이 PFE에 의해 올바르게 `Q_HIGH_PRIO`와 `Q_LOW_PRIO`로 분류되어야 합니다. 이 스크립트에는 해당 분류 로직 설정이 빠져있으므로, PFE의 기본 VLAN PCP 처리 등에 의존하거나 별도의 `libfci_cli` 명령(예: `fprule-add` 또는 `qos-pol-flow-add`)으로 설정해야 합니다.
*   **`libfci_cli` QoS 명령어의 정확한 동작:** `qos-sch-update --sch-in` 옵션의 정확한 사용법과 PFE 펌웨어에서의 실제 동작 방식에 따라 스케줄링 "연출"의 효과가 크게 달라집니다. 도움말을 다시 면밀히 확인하고, 필요한 경우 모든 큐의 가중치를 한 번에 지정해야 할 수도 있습니다.
*   **통계 파싱:** `display_pfe_stats` 함수 내에서 `libfci_cli` 명령어의 출력을 `grep`, `awk` 등으로 정확히 파싱해야 실제 통계치를 볼 수 있습니다. 현재는 매우 단순한 예시입니다.

이 스크립트는 매우 제한된 환경에서 TSN의 복잡한 개념을 시각적으로 "흉내"내 보려는 시도이며, 실제 TSN 시스템 구축과는 거리가 멉니다. 하지만 PFE 하드웨어의 특정 기능을 탐색하고, `libfci_cli` 사용법을 익히는 데는 도움이 될 수 있습니다.
