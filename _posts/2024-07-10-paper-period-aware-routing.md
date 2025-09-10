---
layout: post
title: "논문 리뷰: Period-Aware Routing for TSN"
date: 2024-07-10
categories: [Research, Paper]
tags: [Paper, Routing, TSN, 802.1Qbv]
excerpt: "IEEE 802.1Qbv TSN 네트워크를 위한 주기 인식 라우팅 방법 논문 분석"
---

# A Period-Aware Routing Method for IEEE 802.1Qbv TSN Networks

## 논문 정보
- **제목**: A Period-Aware Routing Method for IEEE 802.1Qbv TSN Networks
- **저자**: [저자 정보]
- **출처**: IEEE Conference/Journal
- **연도**: 2023

## 핵심 내용 요약

이 논문은 IEEE 802.1Qbv Time-Aware Shaper (TAS)를 사용하는 TSN 네트워크에서 주기적인 트래픽의 특성을 고려한 라우팅 방법을 제안합니다.

### 주요 문제점
1. 기존 라우팅 알고리즘은 TSN 트래픽의 주기성을 충분히 고려하지 못함
2. 단순한 최단 경로 라우팅은 특정 링크에 트래픽이 집중되는 문제 발생
3. 주기가 다른 트래픽 간의 간섭으로 인한 스케줄링 어려움

### 제안하는 해결책

#### 1. Period-Aware Cost Function
```
Cost = α × Hop_count + β × Period_conflict + γ × Link_utilization
```

- **Hop_count**: 경로의 홉 수
- **Period_conflict**: 주기가 다른 플로우 간의 충돌 정도
- **Link_utilization**: 링크 사용률

#### 2. 알고리즘 흐름
1. 모든 가능한 경로 탐색
2. 각 경로에 대해 period-aware cost 계산
3. 최소 비용 경로 선택
4. GCL(Gate Control List) 스케줄링

### 실험 결과

- **네트워크 지연 감소**: 평균 15-20% 감소
- **스케줄링 성공률**: 기존 대비 25% 향상
- **링크 사용률**: 더 균등한 분포 달성

## 구현 시 고려사항

### 1. 주기 분류
```python
def classify_periods(flows):
    harmonic_groups = []
    for flow in flows:
        period = flow.period
        # Harmonic period detection
        if is_harmonic(period, harmonic_groups):
            add_to_group(flow, harmonic_groups)
        else:
            create_new_group(flow)
    return harmonic_groups
```

### 2. 충돌 회피 전략
- Harmonic periods (1ms, 2ms, 4ms): 같은 경로 공유 가능
- Non-harmonic periods: 가능한 다른 경로 할당

## 실제 적용 예시

### Automotive TSN Network
- Control traffic: 1ms period
- Sensor data: 10ms period
- Infotainment: 100ms period

각 트래픽 타입별로 최적화된 경로 할당으로 전체 네트워크 성능 향상

## 한계점 및 향후 연구

1. **확장성**: 대규모 네트워크에서의 계산 복잡도
2. **동적 환경**: 실시간 경로 재구성 지원 필요
3. **다중 QoS**: 지연시간 외 다른 QoS 파라미터 고려

## 결론

Period-aware routing은 TSN 네트워크에서 주기적 트래픽의 특성을 활용하여 네트워크 성능을 크게 향상시킬 수 있는 효과적인 방법입니다. 특히 산업 자동화나 차량 네트워크와 같이 주기적 트래픽이 지배적인 환경에서 매우 유용합니다.