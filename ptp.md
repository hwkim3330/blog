아래 순서대로 **보드 재부팅 직후** 그대로 복사‑붙여 넣으면 됩니다.
(포트 1 = Master, 포트 2 = Slave, 1 PPS‑OUT = SMA J14 / pin 4)

***

## ① PTP 인스턴스 + 포트 역할 설정 (마스터/슬레이브)

```
cat <<EOF > ipatch-set-ptp-instance.yaml
- ? "/ieee1588-ptp:ptp/instances/instance"
  : instance-index: 0
    default-ds:
      external-port-config-enable: true
    mchp-velocitysp-ptp:automotive:
      profile: bridge
    ports:
      port:
      - port-index: 1       # Master
        external-port-config-port-ds:
          desired-state: master
      - port-index: 2       # Slave
        external-port-config-port-ds:
          desired-state: slave
EOF

sudo dr mup1cc -d /dev/ttyACM0 -m ipatch -i ipatch-set-ptp-instance.yaml
```

***

## ② LTC 0 생성 + 1 PPS OUT(pin 4) 매핑

```
cat <<EOF > ipatch-set-ltc0-1pps-out.yaml
- ? "/ieee1588-ptp:ptp/mchp-velocitysp-ptp:ltcs/ltc"
  : ltc-index: 0
    ptp-pins:
      ptp-pin:
      - index: 4
        function: 1pps-out
EOF

sudo dr mup1cc -d /dev/ttyACM0 -m ipatch -i ipatch-set-ltc0-1pps-out.yaml
```

***

## ③ Servo 0 → LTC 0 바인딩 (Slave 오차 추종)

```
cat <<EOF > ipatch-set-servo0.yaml
- ? "/ieee1588-ptp:ptp/instances/instance[instance-index='0']/mchp-velocitysp-ptp:servos/servo"
  : servo-index: 0
    servo-type: pi
    ltc-index: 0
EOF

sudo dr mup1cc -d /dev/ttyACM0 -m ipatch -i ipatch-set-servo0.yaml
```

***

## ④ 설정 확인용 fetch (선택)

```
# LTC 확인
cat <<EOF > fetch-ltc.yaml
- "/ieee1588-ptp:ptp/mchp-velocitysp-ptp:ltcs"
EOF
sudo dr mup1cc -d /dev/ttyACM0 -m fetch -i fetch-ltc.yaml

# 인스턴스 전체 확인
cat <<EOF > fetch-ptp-instance.yaml
- "/ieee1588-ptp:ptp/instances/instance[instance-index='0']"
EOF
sudo dr mup1cc -d /dev/ttyACM0 -m fetch -i fetch-ptp-instance.yaml
```

***

### 📌 연결 요약

* **1 PPS OUT** : 보드 SMA J14 (cent = signal, 실드 = GND)
* 오실로스코프 → CH1 Probe 팁 = 중심, GND 클립 = 실드
* 설정 완료 후 1 Hz 펄스가 보이면 성공입니다.
