10BASE-T1S 커넥터 및 부품 생태계 심층 분석: 차량 및 산업용 네트워크의 차세대 엣지 통신 기술
Executive Summary
본 보고서는 IEEE 802.3cg 표준에 명시된 10BASE-T1S 이더넷 기술과 관련 커넥터 및 부품 생태계에 대한 포괄적이고 심층적인 기술 분석을 제공한다. 10BASE-T1S는 단순히 기존 이더넷의 속도를 조정한 파생 기술이 아니라, 차량 및 산업 자동화 분야의 엣지(edge) 네트워크 통신 패러다임을 근본적으로 바꾸는 핵심 기술이다. 이 기술은 전통적인 지점 간(point-to-point) 백본(backbone) 기술이었던 이더넷을 다중 드롭(multi-drop) 버스 토폴로지로 확장하여, CAN(Controller Area Network)과 같은 레거시 필드버스 기술과 직접 경쟁 구도를 형성한다.

본 분석의 핵심은 10BASE-T1S 기술이 어떻게 차세대 차량의 존 아키텍처(zonal architecture)와 산업용 사물 인터넷(IIoT)의 핵심 구현 기술로 부상했는지를 규명하는 데 있다. 물리 계층 충돌 회피(PLCA) 메커니즘을 통해 다중 드롭 버스에서 결정론적(deterministic) 통신을 보장하며, 이는 기존 이더넷의 CSMA/CD 방식으로는 불가능했던 영역이다. 이러한 기술적 혁신은 배선 하네스의 무게와 비용을 획기적으로 절감하고, 게이트웨이를 제거하여 시스템 아키텍처를 단순화하는 등 막대한 경제적, 기술적 이점을 제공한다.

커넥터 표준화는 10BASE-T1S 생태계의 성공에 있어 가장 중요한 요소 중 하나이다. 본 보고서는 다양한 IEC 63171 표준군 중에서 사실상의 산업 표준으로 자리 잡은 IEC 63171-6 (T1 Industrial)에 대해 집중적으로 분석한다. 이 표준은 견고하고 상호 운용 가능한 다중 공급업체 생태계를 구축하는 기반이 되며, 이는 기술의 광범위한 채택을 위한 필수 전제 조건이다. HARTING, TE Connectivity, Molex, Phoenix Contact 등 주요 제조업체들은 이 표준을 중심으로 다양한 IP20 및 IP67 등급의 커넥터 솔루션을 출시하며 시장 성숙을 견인하고 있다.

결론적으로, 시스템 설계자는 10BASE-T1S와 CAN XL과 같은 경쟁 기술 사이에서 전략적 선택에 직면하게 된다. 10BASE-T1S는 완전한 IP 기반의 동종(homogeneous) 네트워크 아키텍처를 지향하는 혁신적인 경로를 제공하는 반면, CAN XL은 기존 CAN 생태계와의 호환성을 바탕으로 점진적인 발전 경로를 제시한다. 본 보고서는 PoDL(Power over Data Lines)을 통한 전력 공급, EMC/EMI(전자기 호환성/간섭) 문제, 그리고 MACsec을 통한 사이버 보안 등 시스템 구현 시 반드시 고려해야 할 핵심 사안들을 심도 있게 다루며, 기술 도입을 고려하는 엔지니어 및 전략가에게 실행 가능한 통찰력을 제공하고자 한다.

1. 10BASE-T1S 물리 계층 표준 해부
이 섹션에서는 10BASE-T1S의 근간을 이루는 기술적 원리를 분석하여, 해당 표준의 설계 철학과 그 배경을 심도 있게 설명한다.

1.1. IEEE 802.3cg의 임무: 엣지 네트워크의 정의
10BASE-T1S는 IEEE 802.3cg 표준의 일부로 정의된 10 Mb/s 단일 페어 이더넷(Single Pair Ethernet, SPE) 기술이다. 이 표준은 이더넷의 적용 범위를 전통적인 IT 및 백본 네트워크에서 차량 및 산업 현장의 가장자리, 즉 '엣지'까지 확장하려는 명확한 목표를 가지고 있다. IEEE 802.3cg는 서로 다른 시장 요구를 충족시키기 위해 두 가지 주요 물리 계층(PHY)을 동시에 정의했다.   

10BASE-T1S (Short Reach): 최대 25m의 다중 드롭 또는 15m의 지점 간 연결을 위해 설계되었다. 주요 목표 시장은 차량 내 네트워크(In-Vehicle Network, IVN)와 산업용 제어 캐비닛 내의 고밀도 센서 및 액추에이터 클러스터이다.   

10BASE-T1L (Long Reach): 최대 1,000m의 장거리 지점 간 링크를 지원하도록 설계되었다. 이는 긴 케이블 배선이 필수적인 공정 자동화 및 빌딩 자동화 분야를 겨냥한 기술이다.   

이처럼 하나의 표준 내에서 두 가지 PHY를 정의한 것은 매우 전략적인 결정이었다. 이는 제한된 물리적 공간 내에서 레거시 버스를 대체하려는 요구(10BASE-T1S)와 원격 필드 장치까지 이더넷 연결을 확장하려는 요구(10BASE-T1L)라는, 서로 다르지만 상호 보완적인 두 가지 시장의 문제를 동시에 해결하기 위함이었다.

1.2. 신호 인코딩 및 전송: 저비용 다중 드롭의 기반
10BASE-T1S의 핵심적인 기술 특징은 저비용과 다중 드롭 구현을 가능하게 하는 신호 처리 방식에 있다.

차동 맨체스터 인코딩 (Differential Manchester Encoding, DME): 10BASE-T1S는 라인 코드로 DME를 채택했다. DME는 각 비트 구간의 중간에서 발생하는 신호 천이(transition)의 유무로 논리값을 표현하는 바이페이즈(bi-phase) 인코딩 방식이다. 이 방식은 신호에 DC 성분이 없어 간단한 갈바닉 절연(galvanic isolation)을 가능하게 하고, 클럭 정보를 신호 자체에 내장하여 수신 측에서의 클럭 복구를 용이하게 한다. DME의 채택은 기술적 트레이드오프의 결과이다. 100/1000BASE-T1과 같은 고속 이더넷 표준에서 사용되는 PAM(Pulse Amplitude Modulation) 방식에 비해 스펙트럼 효율은 낮지만, 구현이 훨씬 간단하고 저렴하다. 이는 CAN과 같은 저비용 레거시 기술과 경쟁하기 위한 필수적인 선택이었다.   

4B/5B 인코딩: 4비트 데이터 니블(nibble)을 5비트 심볼로 매핑하는 4B/5B 인코딩이 적용되었다. 이는 충분한 신호 천이를 보장하여 EMC(전자기 호환성) 성능을 개선하고,    

SILENCE나 BEACON과 같은 제어 기능을 위한 대역 외(out-of-band) 특수 심볼을 생성하기 위함이다.   

전송 속도: 10 Mb/s의 데이터 전송률을 달성하기 위해 심볼 속도는 12.5 MBd로 설정되었다 (10 Mb/s×5/4=12.5 MBd).   

이러한 기술적 선택들은 10BASE-T1S의 근본적인 설계 철학을 보여준다. 이는 최고 성능이 아닌 '충분히 좋은(good enough)' 성능을 목표로 한 공학적 결정이다. 차량 및 산업용 노드의 80% 이상이 10 Mb/s 미만의 대역폭을 요구하는 상황에서 , 복잡하고 비싼 PAM 대신 간단하고 견고한 DME를 채택함으로써 PHY의 비용과 전력 소비를 극적으로 낮출 수 있었다. 이는 이더넷 생태계를 고비용의 백본에서 저비용의 엣지 영역으로 확장하려는 전략적 목표를 달성하기 위한 필연적인 선택이었다.   

1.3. 토폴로지 및 운영 모드: 설계 유연성
10BASE-T1S는 두 가지 주요 아키텍처를 지원하여 설계 유연성을 극대화한다.

반이중 다중 드롭 믹싱 세그먼트 (Half-Duplex Multi-Drop Mixing Segment): 10BASE-T1S의 가장 핵심적인 특징으로, 최대 25m의 단일 연선(twisted pair) 케이블을 통해 최소 8개 이상의 노드를 버스 형태로 연결할 수 있다. 이는 CAN이나 LIN과 같은 레거시 버스의 물리적 구조를 그대로 모방하여 자연스러운 대체 기술로 자리매김할 수 있게 한다. 물리적 구현 시에는 버스의 양 끝단에 100Ω의 종단 저항이 필요하며, 전송 모드의 드롭 노드는 50Ω의 임피던스를 갖도록 규정된다.   

지점 간 링크 세그먼트 (Point-to-Point Link Segment): 최대 15m 거리에서 두 개의 노드를 직접 연결하는 단순한 구조이다. 이 모드는 필수적인 반이중 통신과 선택적인 전이중 통신을 모두 지원한다. 지점 간 모드는 상호 운용성 테스트의 기준점을 제공하고, 다중 드롭이 필요 없는 간단한 연결에 유연성을 부여한다.   

중요한 기술적 제약 사항으로, 링크 속도 및 모드를 협상하는 자동 협상(Auto-Negotiation) 기능은 지점 간 링크에서만 정의되며, 다중 드롭 버스에서는 적용되지 않는다.   

이러한 이중 토폴로지 지원은 10BASE-T1S의 가치를 극대화한다. 지점 간 모드는 기술적 유연성을 제공하지만, 10BASE-T1S의 핵심 가치 제안과 시장의 모든 관심은 다중 드롭 기능에 집중되어 있다. 이는 레거시 버스가 가진 가장 큰 아키텍처 및 비용 우위, 즉 '공유 매체(shared medium)'를 직접적으로 겨냥하기 때문이다. 모든 저속 센서와 액추에이터에 대해 전용 스위치 포트와 개별 케이블 배선을 제거하는 것이야말로 비용과 무게 절감의 가장 큰 동인이다. 따라서 지점 간 모드는 보조적인 기능이며, 10BASE-T1S의 전략적 추진력은 레거시 경쟁자들의 비용 효율적인 버스 토폴로지를 IP 기반 프로토콜로 복제하는 능력에서 비롯된다.

2. 물리 계층 충돌 회피 (PLCA): 결정론적 다중 드롭 네트워킹의 핵심
이 섹션에서는 다중 드롭 이더넷을 안정적으로 구현 가능하게 만드는 핵심 메커니즘인 PLCA에 대해 상세히 설명한다.

2.1. PLCA 프로토콜 메커니즘 (Clause 148)
PLCA(Physical Layer Collision Avoidance)는 MAC(Media Access Control) 계층과 PCS(Physical Coding Sublayer) 계층 사이에 위치하는 선택적 조정 부계층(Reconciliation Sublayer, RS)이다. 이 메커니즘은 공유된 다중 드롭 버스에서 충돌 없이 효율적인 통신을 보장하는 데 필수적이다. PLCA의 동작 과정은 다음과 같다.   

노드 ID 및 코디네이터: 버스에 연결된 각 PHY에는 0부터 n-1까지의 고유한 ID가 할당된다. 이 중 ID 0을 가진 PHY가 코디네이터(마스터) 역할을 수행한다.   

BEACON 신호: 코디네이터는 특수한 BEACON 신호를 전송하여 전송 사이클의 시작을 알린다. 이 신호는 버스상의 모든 노드를 동기화하는 기준점이 된다.   

전송 기회 (Transmit Opportunity, TO): BEACON 신호 이후, 각 노드는 ID 순서(1, 2,... n-1, 그리고 다시 0)에 따라 순차적으로 전송 기회(TO)를 부여받는다. 이는 라운드 로빈(round-robin) 방식으로 공평한 접근을 보장한다.   

전송 또는 양보: 전송할 데이터가 있는 노드는 자신의 TO 시간 창 내에서 즉시 전송을 시작한다. 반면, 데이터가 없는 노드는 침묵을 유지하여 TO를 다음 노드에게 양보한다. 이때 TO_TIMER(기본값 32 비트-시간)가 각 TO의 최대 지속 시간을 제한하여, 데이터가 없는 노드가 버스를 불필요하게 점유하는 것을 막고 대역폭 낭비를 최소화한다.   

이러한 체계적인 접근 방식은 이더넷 PHY가 마치 토큰 패싱(token-passing) 방식처럼 동작하게 만든다. 이는 전통적인 이더넷의 CSMA/CD가 가진 비결정론적 특성 문제를 해결하고, 차량 및 산업 제어 엔지니어들이 레거시 버스에서 기대했던 예측 가능한 타이밍을 유지하면서 IP 기반 네트워크의 이점(표준화된 소프트웨어 스택, 게이트웨이 단순화 등)을 누릴 수 있게 하는 핵심 기술이다.

2.2. 지연 시간 및 대역폭 최적화
PLCA는 각 노드에 결정론적인 네트워크 접근을 제공함으로써, 어떤 노드든 데이터를 전송하기까지 걸리는 최대 지연 시간(latency)을 보장한다. 이는 실시간 제어 애플리케이션에서 매우 중요한 요구사항이며, CSMA/CD의 확률적 특성과 비교했을 때 큰 장점이다.   

버스트 모드 (Burst Mode): PLCA는 선택적으로 '버스트 모드'를 지원한다. 이 모드는 특정 노드가 자신의 TO 동안 여러 개의 프레임을 연속으로 전송할 수 있게 허용한다. 이는 일부 노드(예: 센서)는 데이터를 주로 생성하고 다른 노드는 주로 소비하는 비대칭적인 트래픽 환경에 매우 효과적이다. 이 기능은 PHY 레지스터를 통해 설정할 수 있다.   

대역폭 활용: PLCA는 충돌 자체를 방지하므로, 충돌 감지 및 임의의 백오프(backoff) 시간으로 인해 대역폭이 낭비되지 않는다. 결과적으로, 이론적인 10 Mb/s 대역폭을 거의 손실 없이 온전히 활용할 수 있다.   

2.3. CSMA/CD 및 CSMA/CR과의 비교
PLCA의 매체 접근 방식은 다른 프로토콜과 뚜렷한 차이를 보인다.

CSMA/CD (Collision Detection): 전통적인 이더넷에서 사용하는 방식으로, 충돌이 발생한 후 이를 감지하고 해결하는 '충돌 해결' 방식이다. 반면, PLCA는 정해진 순서에 따라 전송 기회를 부여함으로써 충돌 자체를 원천적으로 막는 '충돌 회피' 방식이다.   

CSMA/CR (Collision Resolution): CAN 버스에서 사용하는 방식으로, 메시지 ID의 우선순위에 따라 중재(arbitration)가 이루어지는 '우선순위 기반 충돌 해결' 방식이다. PLCA는 기본적으로 모든 노드에게 공평한 기회를 주는 라운드 로빈 방식이므로, 우선순위 기반이 아니다. 이는 실시간 시스템 설계에 다른 접근 방식을 요구한다. 다만, 일부 PHY 제조업체는 하나의 노드에 여러 개의 ID를 할당하여 전송 빈도를 높이는 기능을 제공함으로써, 간접적으로 우선순위를 부여하는 효과를 낼 수 있도록 지원한다.   

이러한 차이는 중요한 아키텍처적 변화를 의미한다. CAN에서는 메시지 ID를 통해 하드웨어 수준에서 우선순위가 결정되지만, 10BASE-T1S에서는 PHY의 소프트웨어 설정을 통해 우선순위와 유사한 동작을 구현해야 한다. 이는 네트워크 성능과 실시간 동작이 메시지 설계뿐만 아니라 시스템 구성의 함수가 됨을 의미하며, 시스템 설계자에게 더 많은 유연성과 함께 더 큰 책임도 부여한다.

3. 단일 페어 이더넷(SPE) 커넥터 환경: 표준 및 사양
이 섹션에서는 사용자의 핵심 질문인 커넥터에 대해, SPE 표준화라는 더 넓은 맥락 안에서 심층적으로 다룬다.

3.1. IEC 63171 표준군: 보편적 인터페이스 구축
IEC 63171 표준군은 SPE를 위한 물리적 인터페이스를 정의하는 국제 표준이다. SPE 기술 초기에는 여러 경쟁적인 커넥터 디자인이 제안되었으나, 시장의 파편화를 막고 상호 운용성을 보장하기 위해 몇 가지 핵심 표준으로 통합될 필요성이 대두되었다. 주요 표준과 그 용도는 다음과 같다.   

IEC 63171-1: LC 광섬유 커넥터 스타일을 기반으로 하며, 주로 빌딩 자동화(IP20) 환경을 대상으로 한다.   

IEC 63171-2: Phoenix Contact가 제안한 IP20 등급 커넥터 디자인이다.   

IEC 63171-5: Phoenix Contact의 IP67 등급 M8/M12 원형 커넥터 디자인이다.   

IEC 63171-6 (T1 Industrial): HARTING이 주도하여 제안한 표준으로, 산업 및 차량용 애플리케이션을 위해 설계되었으며 가장 폭넓은 업계의 지지를 받고 있다.   

IEC 63171-7: 데이터와 전력을 함께 전송하는 M12 하이브리드 커넥터 표준이다.   

3.2. IEC 63171-6 (T1 Industrial) 심층 분석: 사실상의 표준
IEC 63171-6은 산업 및 차량용 SPE의 주요 인터페이스로 자리매김했으며, 본 보고서의 핵심 분석 대상이다.   

기계적 설계:

이 표준은 다양한 하우징에 통합될 수 있는 표준화된 결합면(mating face)을 정의한다. 대표적으로 사무실 환경용 IP20 직사각형 커넥터와 열악한 환경용 IP65/67 등급의 M8 및 M12 원형 커넥터가 있다. 이러한 '컨테이너 원칙'은 전기적 상호 운용성을 유지하면서도 기계적 견고성을 확보할 수 있게 한다.   

RJ45 커넥터의 플라스틱 클립과 달리, 스테인리스 스틸로 제작된 견고한 금속 잠금 메커니즘을 특징으로 하여 높은 수준의 충격 및 진동 저항성을 제공한다.   

RJ45 대비 소형화된 폼팩터는 장비의 소형화와 높은 포트 밀도를 가능하게 한다.   

전기적 특성:

10BASE-T1S의 요구 사양(약 12.5 MHz 대역폭)을 훨씬 뛰어넘어, 미래의 고속 SPE 표준(예: 100/1000BASE-T1)까지 지원하도록 설계되었다. 데이터시트에서는 1 Gb/s, 심지어 10 Gb/s까지의 데이터 전송률과 600 MHz 이상의 대역폭을 지원한다고 명시하고 있다. 이는 현재의 투자가 미래에도 유효함을 보장하는 중요한 설계 결정이다.   

완벽하게 대칭적인 접점 배열과 360도 차폐 구조를 통해 우수한 신호 무결성(Signal Integrity)과 EMC 성능을 보장한다.   

일반적인 전기 정격은 60V DC, 최대 4A 전류로, PoDL 기능을 완벽하게 지원한다.   

환경적 견고성:

제어 캐비닛과 같은 보호된 환경을 위한 IP20 버전과, 열악한 필드 레벨 환경을 위한 IP65/67 버전으로 제공된다.   

표준 작동 온도 범위는 일반적으로 -40°C에서 +85°C로, 광범위한 산업 및 차량 환경에 적합하다.   

3.3. 상호 운용성과 산업 연합
IEC 63171-6과 같은 단일화되고 널리 채택된 표준의 존재는 생태계에 매우 중요하다. 이는 사용자에게 투자 안정성을 제공하고, 서로 다른 제조업체의 부품(예: HARTING 케이블과 Molex PCB 소켓)이 완벽하게 호환될 것을 보장한다.   

SPE Industrial Partner Network (HARTING, TE Connectivity 등이 창립)와 OPEN Alliance와 같은 산업 그룹들은 IEC 63171-6 인터페이스를 포함한 SPE 기술의 표준화와 보급을 촉진하는 데 핵심적인 역할을 수행하고 있다. 이러한 연합 활동은 초기 시장의 파편화를 막고 기술 채택을 가속화하는 데 결정적인 기여를 했다. 결과적으로, 산업 및 차량용 시장에서 '커넥터 전쟁'은 사실상 IEC 63171-6의 승리로 귀결되었다. 시스템 설계자 입장에서 IEC 63171-6을 채택하는 것은 가장 넓은 공급업체 선택권과 가장 낮은 기술적 위험을 보장받는 길이다.   

4. 시장 조사: 주요 부품 제조업체 및 제품
이 섹션에서는 이론적 분석을 넘어, 실제 시스템 설계 및 부품 소싱에 필요한 실용적인 시장 정보를 제공한다.

4.1. 커넥터 솔루션: 물리적 인터페이스
주요 커넥터 제조업체들은 IEC 63171-6 표준을 중심으로 강력한 제품 포트폴리오를 구축했다.

HARTING: IEC 63171-6 표준을 주도한 선구자로서 'T1 Industrial' 시리즈를 제공한다. IP20, M8, M12 및 PushPull 버전을 포함한 포괄적인 라인업을 갖추고 있다.   

TE Connectivity: IP20 커넥터와 IP67 등급의 M8 하이브리드 코드셋을 포함한 SPE 제품군을 제공하며, IEC 63171-6과의 호환성을 강조한다.   

Molex: 'T1 Industrial SPE IP20 Connector System'과 케이블 어셈블리를 통해 소형화 및 열악한 환경에 최적화된 솔루션을 제공한다.   

Phoenix Contact: 'ONEPAIR' 시리즈를 통해 시장에 참여하고 있다. 이 시리즈는 자체 표준인 IEC 63171-2 (IP20) 및 IEC 63171-5 (IP67 M8/M12)를 따르지만, 산업 시장에서 T1 Industrial과 호환 가능한 솔루션으로 포지셔닝하고 있다.   

기타 공급업체: Amphenol과 같은 다른 주요 커넥터 제조업체들도 시장의 요구에 부응하여 SPE 솔루션을 제공하고 있다.   

아래 표는 주요 제조업체의 상용 10BASE-T1S 커넥터 솔루션을 비교 분석한 것이다. 이 표는 엔지니어들이 각 공급업체의 주요 사양을 한눈에 비교하여 신속하게 부품을 선정할 수 있도록 돕는다.

표 1: 상용 10BASE-T1S 커넥터 비교 분석 (IEC 63171-6 및 호환 제품)

제조업체	제품 시리즈	지원 표준	사용 가능 폼팩터	IP 등급	작동 온도 범위 (°C)	최대 정격 전류 (A)	주요 특징
HARTING	T1 Industrial	IEC 63171-6	IP20, M8, M12, Mini PushPull	IP20, IP65/67	-40 ~ +85	4	표준 선도, 포괄적 라인업, 견고한 금속 잠금
TE Connectivity	SPE Connectors	IEC 63171-6, -7	IP20, M8 Hybrid	IP20, IP67	-40 ~ +85	4	하이브리드(데이터+전력) 솔루션에 강점
Molex	T1 Industrial SPE	IEC 63171-6	IP20, M12	IP20, IP65/67	-40 ~ +85	4	소형화 및 열악한 환경용 설계, 완전 차폐
Phoenix Contact	ONEPAIR	IEC 63171-2, -5	IP20, M8, M12	IP20, IP67	-40 ~ +85	4	자체 표준 기반, PCB 단자대 등 다양한 솔루션
Belden	SPE T1 Industrial	IEC 63171-6	Angled Receptacle	IP20	-40 ~ +85	4	산업용 케이블링 전문성, 고주파수 특성

Export to Sheets
4.2. PHY 및 MAC-PHY 트랜시버: 실리콘의 심장
10BASE-T1S 물리 계층을 구현하는 반도체 장치는 시스템의 핵심이다.

onsemi: NCN26000과 같은 산업용 다중 드롭 이더넷 PHY를 제공하며, 강화된 노이즈 내성 및 8개 이상의 노드 지원과 같은 특징을 가지고 있다.   

Microchip: LAN8670/1/2 (MII/RMII 인터페이스 PHY) 및 LAN8650/1 (SPI 인터페이스 MAC-PHY)을 포함한 포괄적인 포트폴리오를 자랑한다. 특히 MAC-PHY 제품은 이더넷 MAC이 내장되지 않은 저가형 마이크로컨트롤러(MCU)에서도 10BASE-T1S를 사용할 수 있게 하는 핵심적인 역할을 한다.   

Analog Devices: AD330x 시리즈와 같은 10BASE-T1S 트랜시버를 제공한다. 특히 'E2B(Ethernet to Edge Bus)' 기술은 엣지 노드에서 MCU를 완전히 제거하는 것을 목표로 하는 혁신적인 접근 방식이다.   

이러한 반도체 솔루션 중에서 특히 MAC-PHY의 등장은 CAN 대체를 위한 전략적 전환점이다. 기존의 CAN 트랜시버는 거의 모든 저가형 MCU에 탑재된 간단한 SPI/UART 인터페이스와 연결된다. 반면, 표준 이더넷 PHY는 복잡한 MII/RMII 인터페이스와 이더넷 MAC을 필요로 하는데, 이는 저가형 MCU에는 없는 경우가 많다. MAC-PHY는 MAC을 통합하고 간단한 SPI 인터페이스를 제공함으로써, 엔지니어들이 고가의 호스트 프로세서로 업그레이드하지 않고도 기존 CAN 기반 설계를 10BASE-T1S로 마이그레이션할 수 있는 길을 열어주었다. 이는 단순한 부품이 아니라, 레거시 CAN 생태계와 새로운 SPE 생태계 사이의 하드웨어 격차를 해소하여 저비용 엣지 노드의 대량 시장을 공략하기 위해 설계된 전략적 제품이다.

4.3. 케이블링 및 채널 부품: 물리적 매체
단일 연선 케이블 자체는 일반적으로 AWG 22-26 게이지를 사용하며, EMC 환경에 따라 비차폐(UTP) 또는 차폐(STP) 케이블을 선택할 수 있다.   

**OPEN Alliance 기술 위원회 9 (TC9)**는 이 분야에서 중요한 역할을 한다. TC9는 차량용 이더넷 링크 세그먼트의 채널 및 부품 요구사항을 정의하며, 케이블, 커넥터, 전체 케이블 어셈블리가 IEEE 표준의 성능 요구사항을 충족하는지 검증하기 위한 표준화된 테스트 프레임워크를 제공한다. 이는 전체 시스템의 신뢰성과 상호 운용성을 보장하는 데 필수적이다.   

5. 애플리케이션 심층 분석: 차량 및 산업의 혁신
이 섹션에서는 10BASE-T1S 기술과 제품이 해결하고자 하는 핵심적인 문제들을 구체적인 적용 사례를 통해 분석한다.

5.1. 차량 존 아키텍처: 핵심 동인
차량 E/E(전기/전자) 아키텍처는 기능별로 ECU를 배치하는 전통적인 도메인 기반 모델에서, 물리적 위치를 기준으로 구역을 나누고 존 컨트롤러가 해당 구역의 모든 장치를 관리하는 존 아키텍처로 전환되고 있다.   

10BASE-T1S는 이러한 전환을 가능하게 하는 '잃어버린 고리(missing link)'로 평가받는다. 이 기술은 조명, 잠금장치, 소형 모터와 같은 엣지 센서 및 액추에이터를 존 컨트롤러에 연결하는 비용 효율적이고 가벼운 IP 기반 네트워크를 제공한다. 이를 통해 복잡한 지점 간 배선과 레거시 게이트웨이(CAN-to-Ethernet)가 대거 제거되어, 배선 하네스의 무게, 비용, 제조 복잡성이 크게 감소한다.   

궁극적으로 이는 고성능 중앙 컴퓨터부터 가장 단순한 센서에 이르기까지 공통된 소프트웨어 스택을 사용하는 완전한 동종 이더넷 차량 네트워크라는 비전을 실현하게 한다. 이는 소프트웨어 개발을 단순화하고, 차량 전체에 대한 무선 업데이트(Over-the-Air, OTA)를 가능하게 하는 핵심 기반이다. 10BASE-T1S의 성공은 존 아키텍처와 소프트웨어 정의 차량(Software-Defined Vehicle, SDV)이라는 거대한 산업 트렌드의 성공과 본질적으로 연결되어 있다.   

5.2. 산업용 사물 인터넷 (IIoT): 공장 엣지까지의 이더넷
10BASE-T1S는 산업, 공정 및 빌딩 자동화 분야에서도 중요한 역할을 한다. 이 기술은 4-20mA 전류 루프나 Profibus와 같은 레거시 필드버스를 표준화된 IP 기반 프로토콜로 대체하여, 별도의 프로토콜 게이트웨이 없이 '센서에서 클라우드까지' 원활한 통신을 가능하게 한다.   

이를 통해 스마트 센서가 예지보전(predictive maintenance)과 같은 더 많은 데이터를 전송할 수 있게 되고, 네트워크 관리가 단순화되며, 케이블링 비용이 절감되는 등 다양한 이점을 얻을 수 있다. 단거리 센서 클러스터에는 10BASE-T1S를, 장거리 필드 장치에는 10BASE-T1L을 조합하여 공장 전체를 포괄하는 포괄적인 SPE 솔루션을 구축할 수 있다.   

5.3. 상위 수준 아키텍처와의 통합: AUTOSAR 사례
10BASE-T1S는 차량용 소프트웨어 표준 플랫폼인 **AUTOSAR(Automotive Open System Architecture)**에 적극적으로 통합되고 있다. AUTOSAR는 10BASE-T1S의 고유한 특징인 다중 드롭 토폴로지와 PLCA 구성 파라미터(nodeID, nodeCount 등)를 지원하기 위해 통신 스택 내의 이더넷 드라이버와 같은 필수 소프트웨어 모듈을 정의하고 있다. 이러한 표준화된 통합은 AUTOSAR의 핵심 목표인 여러 공급업체의 소프트웨어 모듈 재사용 및 교환을 10BASE-T1S 네트워크 환경에서도 가능하게 하므로, 기술의 실질적인 확산에 매우 중요하다.   

결론적으로, 10BASE-T1S는 단순히 새로운 배선 기술이 아니라, 시스템 아키텍처를 근본적으로 바꿀 수 있는 잠재력을 가진 기술이다. 차량에서는 존 아키텍처의 잠재력을 최대한 발휘하게 하고, 공장에서는 전통적인 자동화 피라미드를 평탄화한다. 이 모든 변화의 공통된 핵심은 게이트웨이를 제거하고 통합된 종단 간 IP 네트워크를 구축하는 것이다. 이는 데이터 흐름을 단순화하고 지연 시간을 줄이며 소프트웨어 복잡성을 극적으로 낮추는, 단순한 구리선 절감 이상의 장기적인 가치를 제공한다.

6. 핵심 설계 및 구현 고려사항
이 섹션에서는 엔지니어들이 10BASE-T1S 시스템을 실제로 구현할 때 직면하게 될 실용적인 과제와 해결책을 다룬다.

6.1. PoDL (Power over Data Lines): 단일 케이블로 전력과 데이터 동시 전송
PoDL은 IEEE 802.3cg 표준에 정의된 단일 페어 버전의 PoE(Power over Ethernet) 기술이다. PoDL 시스템은 전력 공급 장치(PSE), 링크 세그먼트(케이블), 전력 수신 장치(PD)로 구성된다.   

표준은 최대 52W를 공급할 수 있는 클래스 15까지 다양한 전력 등급을 정의하지만, 10BASE-T1S 엣지 장치에는 일반적으로 더 낮은 전력 등급이 사용된다. PoDL을 올바르게 구현하기 위해서는 몇 가지 핵심적인 설계 요소가 필요하다.   

커플링/디커플링 네트워크: PHY에서 DC 전력과 고주파 데이터 신호를 분리하고 결합하는 아날로그 회로가 필수적이다.   

핸드셰이킹 프로토콜: PSE가 PoDL을 지원하는 PD에만 전력을 공급하도록 보장하는 협상 과정이다. PD가 원하는 전력 등급을 동적으로 요청할 수 있는 SCCP(Serial Communication Classification Protocol)가 포함된다.   

PoDL 구현은 단순히 PoDL 지원 PHY를 선택하는 것 이상의 복잡한 시스템 설계 과제이다. 커플링 네트워크의 아날로그 설계, DC/DC 컨버터와 같은 전력 전자 회로, SCCP 프로토콜 처리 등이 정밀하게 통합되어야 한다. Texas Instruments와 같은 반도체 회사가 제공하는 레퍼런스 디자인은 이러한 복잡성을 해결하는 데 중요한 자원이 된다. 잘못 설계된 PoDL 시스템은 신호 무결성을 저하시키거나 전력 협상에 실패할 수 있으므로 세심한 주의가 필요하다.   

6.2. EMC 및 신호 무결성: 견고성 확보
차량 및 산업 환경은 전기적 노이즈가 매우 심한 환경이므로, EMC 및 EMI에 대한 대책이 필수적이다. **OPEN Alliance (예: TC14)**와 같은 산업 그룹은 EMC, 송신기 왜곡, 신호 무결성에 대한 포괄적인 적합성 테스트 스위트를 정의하여 상호 운용성을 보장한다.   

실제 설계에서는 공통 모드 초크(CMC), ESD(정전기 방전) 보호 다이오드, 적절한 PCB 레이아웃과 같은 실용적인 기법을 통해 노이즈를 완화하고 안정적인 통신을 보장해야 한다.   

6.3. MACsec을 이용한 사이버 보안: 엣지 보안
**MACsec (IEEE 802.1AE)**은 이더넷 프레임에 대한 인증, 무결성, 기밀성을 제공하는 표준화된 계층 2 보안 프로토콜이다. 차량 및 산업 네트워크가 외부 세계와 연결되면서 도청, 스푸핑, 중간자 공격과 같은 사이버 위협에 대한 방어가 중요해지고 있다.   

그러나 MACsec을 10BASE-T1S와 같은 공유 다중 드롭 버스에 적용하는 것은 아직 해결되지 않은 과제이다. 표준 MACsec 키 교환 프로토콜(MKA)은 지점 간 링크를 위해 설계되었다. 이를 모든 노드가 모든 트래픽을 들을 수 있는 버스 환경으로 확장하는 것은 키 관리 및 인증에 있어 복잡한 문제를 야기한다. OPEN Alliance TC17에서 개발 중인 'Automotive MACsec' 프로파일의 초기 버전은 스위치 기반 이더넷에 초점을 맞추고 있으며, 공유 매체 모드는 향후 과제로 명시하고 있다. 이는 10BASE-T1S의 핵심 사용 사례인 다중 드롭 버스에 대한 표준화된 계층 2 보안 솔루션에 현재 공백이 있음을 시사한다. 따라서 초기 다중 드롭 시스템은 AUTOSAR의 SecOC와 같은 상위 계층 보안에 의존하거나, 물리적으로 안전한 도메인 내에서 운영될 가능성이 높다.   

7. 전략적 분석 및 미래 전망
이 마지막 섹션에서는 기술 채택에 대한 정보에 입각한 결정을 내리는 데 도움이 되는 상위 수준의 전략적 관점을 제공한다.

7.1. 경쟁 기술 분석: 10BASE-T1S 대 CAN XL
10 Mb/s급 차량 내 네트워크 영역에서는 10BASE-T1S와 CAN XL이 직접적인 경쟁 관계에 있다.

대역폭 및 페이로드: CAN XL은 최대 10-20 Mbit/s의 유연한 데이터 전송률과 2048바이트의 큰 페이로드를 제공한다. 10BASE-T1S는 10 Mb/s의 고정된 속도와 표준 이더넷 페이로드인 1500바이트를 지원한다.   

버스 접근 및 토폴로지: 10BASE-T1S는 결정론적인 라운드 로빈 방식의 PLCA를 사용하는 반면, CAN XL은 우선순위 기반의 CSMA/CR을 사용한다. 또한 CAN XL은 더 긴 스터브(stub)를 허용하는 등 토폴로지 유연성이 더 높다.   

생태계 및 비용: 10BASE-T1S는 방대한 이더넷 소프트웨어 및 도구 생태계를 활용하여 게이트웨이 없이 완전한 이더넷 아키텍처로의 통합을 용이하게 한다. 반면, CAN XL은 매우 저렴하고 깊이 뿌리내린 CAN 생태계를 기반으로 하여 기존 설계에 대한 점진적인 업그레이드 경로를 제공한다.   

아래 표는 두 기술의 기술적, 전략적 측면을 비교한 것이다. 이 표는 단순한 사양 비교를 넘어, 기술 채택을 결정하는 핵심 요소인 비용, 생태계, 아키텍처 영향, 미래 경로 등을 종합적으로 평가한다.

표 2: 기술 및 전략 비교: 10BASE-T1S 대 CAN XL

매개변수	10BASE-T1S	CAN XL
데이터 전송률	10 Mb/s (고정)	최대 10-20 Mb/s (가변)
페이로드 크기	최대 1500 바이트 (이더넷 표준)	최대 2048 바이트
버스 접근 방식	PLCA (라운드 로빈, 결정론적)	CSMA/CR (우선순위 기반)
네트워크 토폴로지	다중 드롭 (스터브 길이 제한적)	다중 드롭 (더 유연한 스터브 허용)
아키텍처 영향	동종 이더넷 (게이트웨이 불필요)	이종 네트워크 (게이트웨이 필요)
소프트웨어 스택	표준 TCP/IP 스택 재사용	기존 CAN 스택 확장
보안	MACsec (다중 드롭 표준화 진행 중)	CANsec (표준화 진행 중)
생태계 성숙도	신흥 (빠르게 성장 중)	성숙 (매우 광범위)
비용 프로파일	PHY, IP 비용은 감소 추세	매우 저렴, 기존 생태계 활용

Export to Sheets
7.2. 시장 동향 및 예측
단일 페어 이더넷 시장은 강력한 성장세를 보일 것으로 예상된다. 시장 조사 보고서에 따르면, 연평균 성장률(CAGR)은 11%를 상회하며, 전 세계 시장 규모는 2030년까지 약 56억~62억 달러에 이를 것으로 전망된다. 이러한 성장의 주요 동인은 인더스트리 4.0 및 IIoT로의 전환, 차량의 존 아키텍처 채택, 그리고 엣지에서의 IP 기반 연결에 대한 전반적인 수요 증가이다. 특히 차량 및 산업 자동화 부문이 SPE 채택의 핵심 집중 분야가 될 것이다.   

7.3. 나아갈 길: 결론적 통찰
10BASE-T1S와 CAN XL 사이의 선택은 단순한 기술적 결정이 아니라, 아키텍처에 대한 철학적 선택에 가깝다. 즉, 혁신적인 완전 IP 기반 아키텍처를 선택할 것인가, 아니면 하위 호환성을 갖춘 점진적 아키텍처를 선택할 것인가의 문제이다.

미래에는 더 긴 거리와 더 많은 노드를 지원하기 위한 IEEE 802.3da 태스크포스의 10BASE-T1S 향상 작업과 , 공유 매체용 MACsec의 최종 표준화와 같은 기술 발전이 예상된다.   

최종적으로, 진정한 소프트웨어 정의 차량(SDV)이나 인더스트리 4.0 아키텍처를 목표로 하는 '그린필드(greenfield)' 설계의 경우, 10BASE-T1S는 보안과 같은 일부 영역에서 생태계가 아직 성숙하는 과정에 있음에도 불구하고, 전략적으로 더 건전하고 미래 지향적인 경로를 제공한다. 반면, 기존 플랫폼에 대한 점진적인 업그레이드를 고려하는 경우에는 CAN XL이 마찰과 위험이 더 적은 선택이 될 수 있다.


Sources used in the report

m.youtube.com
10BASE-T1S or 10SPE Explained in 5 Minutes - Multi-Drop Ethernet for In-Vehicle Networking - YouTube
Opens in a new window

en.wikipedia.org
Ethernet over twisted pair - Wikipedia
Opens in a new window

single-pair-ethernet.com
T1 INDUSTRIAL CONNECTIVITY - SINGLE PAIR ETHERNET
Opens in a new window

mouser.com
INTRODUCTION SPE T1 INDUSTRIAL CONNECTORS IP20
Opens in a new window

rdm.com
Single Pair Ethernet - IEC 63171-1 System - R&M
Opens in a new window

intrepidcs.com
10BASE-T1S Physical Layer Architecture | Intrepid Control Systems, Inc.
Opens in a new window

ieee802.org
147. Physical Coding Sublayer (PCS), Physical Medium Attachment (PMA) sublayer and baseband medium, type 10BASE-T1S - IEEE 802
Opens in a new window

weidmuller.com
Single Pair Ethernet (SPE) - Weidmuller
Opens in a new window

onsemi.com
NCN26000 - 10Mb/s Industrial Ethernet 10BASE-T1S Transceiver (802.3cg Compliant) - onsemi
Opens in a new window

spirent.com
Five Reasons 10BASE-T1S Is Boosting Software-Defined Vehicles - Spirent
Opens in a new window

belden.com
Single Pair Ethernet (SPE) Connectors - T1INDS-LL-WS/5,1 S - Belden
Opens in a new window

ieee802.org
IEEE P802.3cg 10Mb/s Single Pair Ethernet: A guide
Opens in a new window

cdn.teledynelecroy.com
What Is 10Base-T1S Automotive Ethernet? - Teledyne LeCroy
Opens in a new window

canovatech.com
CT25205: IEEE 802.3cg 10BASE-T1S Digital Controller - Canova Tech Srl
Opens in a new window

te.com
Application Specification NOTE All numerical values are in metric units [with U.S. customary units in brackets]. Dimensions are - TE Connectivity
Opens in a new window

mouser.com
T1 INDUSTRIAL SINGLE-PAIR ETHERNET CONNECTORS AND CABLE ASSEMBLIES
Opens in a new window

avnet.com
Will Ethernet cancel CAN? - Avnet
Opens in a new window

opensig.org
10BASE-T1S Half- Duplex Interoperability Test Suite | Open Alliance
Opens in a new window

amphenolltw.com
Introduction to Single Pair Ethernet Connectors [Guide] - Amphenol LTW
Opens in a new window

te.com
single pair ethernet (spe) m8 hybrid board receptacle ip67 and single pair ethernet - TE Connectivity
Opens in a new window

mouser.com
LAN8670/1/2 10BASE-T1S Ethernet PHY Transceivers - Microchip Technology | Mouser
Opens in a new window

content.molex.com
T1 Industrial Single-Pair Ethernet (SPE) Connectors and Cable Assemblies | Molex
Opens in a new window

phoenixcontact.com
SPE-T1-STRM-90 - SPE PCB connector - 1163797 | Phoenix Contact
Opens in a new window

futureelectronics.com
HARTING — T1 Single-Pair Ethernet Connector (SPE) | Futureelectronics NorthAmerica Site
Opens in a new window

mouser.com
Single Pair Ethernet (SPE) Connectors - Phoenix Contact - Mouser Electronics
Opens in a new window

harting.com
HARTING T1 Industrial | HARTING Technology Group
Opens in a new window

harting.com
T1 Industrial jack AH IP20 | HARTING Technology Group
Opens in a new window

harting.com
T1 Industrial plug male connector V3 | HARTING Technology Group
Opens in a new window

can-cia.org
Change in automotive communication systems - CAN/CiA
Opens in a new window

cdn.vector.com
Transformational Change in Automotive Communication Systems - CAN XL provides the basis for seamless cooperation with Ethernet - Vector
Opens in a new window

chipflow.io
Ethernet 10BASE-T1S: The Next Evolution in Automotive Networking? - ChipFlow
Opens in a new window

singlepairethernet.com
ONE-PAIR ETHERNET IN THE AUTOMOTIVE INDUSTRY
Opens in a new window

onsemi.com
Zonal Architecture 101: Reducing Vehicle System Development Complexity - Onsemi
Opens in a new window

microcontrollertips.com
10Base-T1S simplifies automotive zonal architectures - Microcontroller Tips
Opens in a new window

marketresearch.com
Single Pair Ethernet - MarketResearch.com
Opens in a new window

researchandmarkets.com
Single Pair Ethernet - Global Strategic Business Report - Research and Markets
Opens in a new window

researchandmarkets.com
Single Pair Ethernet Market Size, Share & Forecast to 2029
Opens in a new window

theinsightpartners.com
Single Pair Ethernet Market Size and CAGR by 2030 - The Insight Partners
Opens in a new window

archivemarketresearch.com
Single Pair Ethernet (SPE) Connector 2025-2033 Trends: Unveiling Growth Opportunities and Competitor Dynamics
Opens in a new window

phoenixcontact.com
Single Pair Ethernet connectors | Phoenix Contact
Opens in a new window

molex.com
Industrial SPE Connectors and Cable Assemblies | Molex
Opens in a new window

ti.com
Leveraging Single-Pair Ethernet in Building Automation - Texas Instruments
Opens in a new window

mouser.com
HARTING T1 Industrial Single-Pair Ethernet (SPE) Products - Mouser Electronics
Opens in a new window

opensig.org
TC9 – Automotive Ethernet Channel & Components - Open Alliance
Opens in a new window

opensig.org
10BASE-T1S Channel and Component Requirements for Link Segments - Open Alliance
Opens in a new window

te.com
Discover the Potential of Single Pair Ethernet - TE Connectivity
Opens in a new window

en.wikipedia.org
OPEN Alliance SIG - Wikipedia
Opens in a new window

keysight.com
Why use 10BASE-T1S instead of CAN? | Keysight Blogs
Opens in a new window

copperhilltech.com
CAN XL in the Automotive Industry: History, Technical Capabilities, and Market Outlook
Opens in a new window

blog.guardknox.com
Entering the Ethernet Era: The Difference Between CAN and Ethernet - BLOG
Opens in a new window

bosch-semiconductors.com
comparisons 1. can xl can fd can 2. can xl 10base-t1s - BOSCH Semiconductors
Opens in a new window

harting.com
Single Pair Ethernet | HARTING Technology Group
Opens in a new window

te.com
Single Pair Ethernet: The Infrastructure for IIoT | TE Connectivity
Opens in a new window

commscope.com
Single Pair Ethernet (SPE) - CommScope
Opens in a new window

tek.com
Automotive Ethernet Test Application | Tektronix
Opens in a new window

single-pair-ethernet.com
SPE Industrial Partner Network - Single Pair Ethernet
Opens in a new window

microchip.com
10BASE-T1S Ethernet - Microchip Technology
Opens in a new window

control.com
Applications for Single Pair Ethernet: Perspectives for Device Manufacturers - Control.com
Opens in a new window

picotech.com
10BASE-T1S Ethernet serial protocol decoding - Pico Technology
Opens in a new window

mouser.com
10BASE-T1S Ethernet PHY Transceiver
Opens in a new window

graniteriverlabs.com
Introduction to 10BASE-T1S Automotive Ethernet Test Standards - Granite River Labs
Opens in a new window

efficiencywins.nexperia.com
Maximizing ESD Protection For Your Automotive Ethernet Application | Efficiency Wins
Opens in a new window

tek.com
Automotive Ethernet Test Application - Tektronix
Opens in a new window

opensig.org
IEEE 10BASE-T1S EMC Test Specification for Common Mode Chokes - Open Alliance
Opens in a new window

incompliancemag.com
High Voltage ESD Protection for Automotive Ethernet Applications
Opens in a new window

comcores.com
Automotive Ethernet Security Using MACsec: A Whitepaper - Comcores
Opens in a new window

opensig.org
Automotive MACsec Specification | Open Alliance
Opens in a new window

renesas.com
The Art of Networking (Series 6): MACsec and CANsec – Layer 2 Security for High Performance Networks | Renesas
Opens in a new window

analog.com
10BASE-T1S Ethernet to Edge Bus (E2B) - Analog Devices
Opens in a new window

ti.com
10BASE-T1L SPE Sensor With Power Over Data Lines (PoDL) Reference Design - Texas Instruments
Opens in a new window

ti.com
IEEE 802.3cg 10BASE-T1L Power over Data Lines Powered Device Design (Rev. A) - Texas Instruments
Opens in a new window

electricui.com
A deep dive into Single Pair Ethernet - Electric UI
Opens in a new window

maaz.global
AUTOSAR Communication and Networking - FPT Automotive
Opens in a new window

1.ieee802.org
P802.1DG – TSN Profile for Automotive In-Vehicle Ethernet Communications | - IEEE 802.1
Opens in a new window

autosar.org
Specification of Ethernet Driver AUTOSAR CP R24-11
Opens in a new window

standards.ieee.org
10BASE-T1S in AUTOSAR 14 Sept 2020 - Stéfany Chourakorn (BMW) Ethernet & IP @ Automotive - IEEE Standards Association
Opens in a new window

Sources read but not used in the report
Opens in a new window
Opens in a new window
Opens in a new window
Opens in a new window
Opens in a new window
Opens in a new window
Opens in a new window
Opens in a new window
Opens in a new window
Opens in a new window
Opens in a new window
Opens in a new window
Opens in a new window
Opens in a new window
Opens in a new window
Opens in a new window
Opens in a new window
Opens in a new window
Opens in a new window
Opens in a new window
Opens in a new window
Opens in a new window
Opens in a new window
Opens in a new window
Opens in a new window
Opens in a new window
Opens in a new window
Opens in a new window
Opens in a new window
Opens in a new window
Opens in a new window
Opens in a new window
Opens in a new window
Opens in a new window
Opens in a new window
Opens in a new window
Opens in a new window
Opens in a new window
Opens in a new window
Opens in a new window
Opens in a new window
Opens in a new window
Opens in a new window
Opens in a new window
Opens in a new window
Opens in a new window
Opens in a new window
Opens in a new window
Opens in a new window
Opens in a new window
Opens in a new window
Opens in a new window
Opens in a new window
Opens in a new window
Opens in a new window
Opens in a new window
Opens in a new window

Thoughts
