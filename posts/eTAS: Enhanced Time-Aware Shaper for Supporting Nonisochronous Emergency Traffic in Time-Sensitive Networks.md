## **[논문 리뷰] eTAS: 시간 민감형 네트워크(TSN)에서 비주기적 긴급 트래픽을 위한 향상된 시간 인식 셰이퍼**

> Kim, M., Hyeon, D., & Paek, J. (2022). eTAS: Enhanced Time-Aware Shaper for Supporting Nonisochronous Emergency Traffic in Time-Sensitive Networks. *IEEE Internet of Things Journal, 9*(13), 10480-10491.

---

### **1. 서론 (Introduction): 문제 제기**

**1.1. 배경: TSN과 TAS의 약속과 한계**
시간 민감형 네트워킹(Time-Sensitive Networking, TSN)은 자동차, 스마트 공장, 항공 등 현대 산업 시스템에서 요구하는 엄격한 실시간 통신을 표준 이더넷 기반으로 구현하기 위한 기술 집합입니다. TSN의 핵심 기술 중 하나인 **IEEE 802.1Qbv의 시간 인식 셰이퍼(Time-Aware Shaper, TAS)**는, 사전에 정의된 스케줄(Gate Control List, GCL)에 따라 네트워크 스위치의 큐 게이트를 정밀하게 제어합니다. 이를 통해 다음과 같은 트래픽을 분리하여 전송합니다.

*   **ST (Scheduled Traffic)**: 제어 신호와 같이 지연과 지터에 극도로 민감한 주기적 트래픽. 정해진 시간 창(Time Window)에만 전송되어 성능을 보장받습니다.
*   **NST (Non-Scheduled Traffic)**: 오디오/비디오(AVB)나 일반 데이터(Best-Effort)처럼 상대적으로 덜 민감한 트래픽. ST 시간 외의 남는 시간에 전송됩니다.

이러한 TAS의 엄격한 시간 분할 방식은 예약된 ST 트래픽의 실시간성을 보장하는 데 매우 효과적입니다. 하지만 이 모델은 **모든 트래픽의 특성이 사전에 알려져 있고, 예측 가능하다는 이상적인 가정**에 기반합니다.

**1.2. 핵심 문제: 예측 불가능한 긴급 트래픽(ET)의 딜레마**
실제 산업 현장에서는 화재 경보, 시스템 고장 알람, 충돌 감지 센서 등 **예측은 불가능하지만(Nonisochronous) 가장 빠르게 전달되어야 하는 긴급 트래픽(Emergency Traffic, ET)**이 발생할 수 있습니다. 기존 TAS 체계에서 이러한 ET는 심각한 딜레마에 빠집니다.

*   **문제 시나리오 1: ET를 NST로 취급할 경우**
    ET는 자신의 전송 차례인 NST 시간 창이 올 때까지 무기한 대기해야 합니다. 운이 나쁘면 Guard Band와 ST 시간 창 때문에 수백 마이크로초(μs) 이상의 치명적인 지연이 발생할 수 있습니다 (Fig. 2 참조).

*   **문제 시나리오 2: ET를 ST로 취급할 경우**
    ET가 ST 시간 창에 끼어들어 먼저 전송되면, 원래 그 시간에 전송됐어야 할 ST 프레임의 기회를 빼앗습니다. 이로 인해 해당 ST 프레임은 다음 주기로 밀려나고, 이는 후속 ST 프레임들의 스케줄까지 연쇄적으로 무너뜨리는 **연쇄 지연(Cascading Delays)**을 유발하여 TAS의 근본 목적인 ST의 실시간성 보장을 훼손합니다 (Fig. 3 참조).

이 논문은 기존 TAS가 이러한 **비주기적 긴급 트래픽(ET)을 효과적으로 처리하지 못하며, 오히려 ET와 기존 ST 모두의 성능을 저하시키는 문제점**을 명확히 지적하고, 이를 해결하기 위한 새로운 메커니즘인 **eTAS**를 제안합니다.

---

### **2. 제안 방법: eTAS (Enhanced TAS)**

eTAS는 ET의 즉각적인 전송을 보장하면서도 ST의 실시간성을 보호하기 위해, 기존 TAS 규칙에 두 가지 핵심적인 개선 사항을 도입합니다.

**2.1. ET를 위한 새로운 큐잉 및 게이팅 규칙**

1.  **최고 우선순위 및 독립 큐 할당**: ET는 다른 어떤 트래픽과도 구분되는 **독립된 큐**와 네트워크 내 **가장 높은 우선순위**를 부여받습니다. 이는 전송 기회가 왔을 때 항상 ET가 가장 먼저 선택되도록 보장합니다. (Table I 참조)
2.  **항상 열려있는 게이트 (Always Open Gate)**: ET 큐에 할당된 게이트는 ST, NST, Guard Band 등 시간 창에 관계없이 **항상 `Open` 상태를 유지**합니다. 이를 통해 ET는 큐에 도착하는 즉시 (현재 진행 중인 프레임 전송만 끝나면) 다른 스케줄에 구애받지 않고 전송될 수 있습니다. 이 규칙만으로도 ET의 대기 시간을 극적으로 줄일 수 있습니다. (Fig. 5 참조)

**2.2. 동적 스케줄링 시간 창 확장 (Dynamic Scheduled Time Window Extension, TWE)**

이것이 eTAS의 가장 혁신적인 메커니즘입니다. ET가 ST 시간 창의 시간을 '빼앗아' 사용했을 때, ST를 보호하기 위해 다음과 같이 동작합니다. (Fig. 6, Algorithm 1 참조)

1.  **침범 시간(τ_ext) 계산**: ET가 ST 시간 창 내에서 전송되면, 스위치는 ET가 사용한 전송 시간(`τ_ext`)을 계산하고 기록합니다.
2.  **ST 시간 창의 동적 확장**: GCL은 원래 ST 시간 창이 끝나야 할 시점에 게이트 상태를 바꾸지 않고, 계산된 `τ_ext` 만큼 **ST 시간 창을 동적으로 연장**합니다.
3.  **NST 시간의 희생**: 연장된 ST 시간 덕분에, ET 때문에 밀려났던 ST 프레임은 확장된 시간 내에 무사히 전송됩니다. 그 대가로, 뒤따르는 **NST 시간 창의 시작 시점이 `τ_ext` 만큼 뒤로 밀리게 되고, 결과적으로 NST가 사용할 수 있는 전체 시간은 줄어듭니다.**

이러한 **"NST의 희생을 통한 ST의 보호"** 전략을 통해 eTAS는 ET의 즉각적인 전송과 ST의 엄격한 실시간성 보장이라는 두 마리 토끼를 모두 잡습니다.

---

### **3. 평가 (Evaluation)**

연구진은 OMNeT++ 시뮬레이터를 사용하여 자율주행차의 ADAS(첨단 운전자 보조 시스템) 시나리오를 구성하고, 약 80%의 높은 네트워크 부하 환경에서 eTAS의 성능을 검증했습니다.

*   **ET 성능 비교**: 기존 TAS 방식(ET-in-ST, ET-in-NST)과 비교했을 때, eTAS는 ET의 **최대 종단 간 지연(End-to-End Latency)을 약 11~34% 감소**시켰고, 지터(Jitter) 또한 **13~63% 감소**시켜 월등히 안정적이고 빠른 전송을 보장했습니다 (Fig. 9 참조).

*   **ST 성능 보호**: 가장 극적인 결과로, ET-in-ST 방식에서는 ST의 최대 지연이 15,000μs 이상으로 치솟았지만, **eTAS 환경에서는 ST의 최대 지연이 약 403μs로, ET가 없었을 때(w/o-ET)와 거의 비슷한 수준으로 안정적으로 유지**되었습니다. 이는 TWE 메커니즘이 ST를 매우 효과적으로 보호했음을 증명합니다.

*   **버스트 트래픽(Bursty Traffic) 강건성**: 초당 최대 2000개의 ET 프레임이 집중적으로 발생하는 극한의 시나리오에서도 eTAS는 ET의 지연을 낮게 유지하면서 ST의 성능을 안정적으로 보호했습니다. 예상대로, 이 부하는 대부분 NST 트래픽의 성능 저하로 흡수되었습니다 (Fig. 10, 11, 12 참조).

---

### **4. 결론 및 기여**

이 논문은 다음과 같은 중요한 기여를 합니다.

1.  **문제 정의 및 분석**: 기존 TAS가 비주기적 긴급 트래픽(ET)에 대해 갖는 명확한 한계와 그로 인한 연쇄적 문제점을 최초로 심도 있게 분석했습니다.
2.  **혁신적 해결책 제시**: ET의 즉각성과 ST의 실시간성을 동시에 보장하는 **eTAS와 핵심 메커니즘 TWE를 제안**했습니다. 이는 정적 스케줄링의 한계를 동적 적응으로 해결한 실용적인 접근법입니다.
3.  **TSN의 신뢰성 및 견고성 향상**: eTAS는 예측 불가능한 이벤트가 발생하는 실제 산업 환경에서 TSN 네트워크의 신뢰성과 견고성을 한 단계 끌어올릴 수 있는 잠재력을 보여주었으며, 향후 **IEEE 802.1Qbv 표준을 개선하는 데 중요한 이론적 기반**을 제공합니다.

결론적으로, eTAS는 엄격한 실시간성이 요구되는 TSN 환경을 현실 세계의 돌발 변수에 더 잘 대응할 수 있도록 만드는 중요한 진전이라고 평가할 수 있습니다.
