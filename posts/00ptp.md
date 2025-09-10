ptp4l[15065.776]: master offset -32361317042983 s2 freq -62499999 path delay -17293731
ptp4l[15066.887]: master offset -32361252236385 s2 freq -62499999 path delay -12650148
ptp4l[15067.998]: master offset -32361182785724 s2 freq -62499999 path delay -12650148
ptp4l[15069.109]: master offset -32361106195489 s2 freq -62499999 path delay -19790224
ptp4l[15070.221]: master offset -32361036113373 s2 freq -62499999 path delay -20421901
ptp4l[15071.332]: master offset -32360966662964 s2 freq -62499999 path delay -20421901
ptp4l[15072.443]: master offset -32360897203468 s2 freq -62499999 path delay -20421901
ptp4l[15073.554]: master offset -32360826965134 s2 freq -62499999 path delay -21213653
ptp4l[15074.665]: master offset -32360754749674 s2 freq -62499999 path delay -23978828
^C(base) kim@kim-System-Product-Name:~$ sudo ptp4l -i enp5s0  -m -H -2
ptp4l[15075.793]: selected /dev/ptp1 as PTP clock
ptp4l[15075.818]: port 1 (enp5s0): INITIALIZING to LISTENING on INIT_COMPLETE
ptp4l[15075.818]: port 0 (/var/run/ptp4l): INITIALIZING to LISTENING on INIT_COMPLETE
ptp4l[15075.818]: port 0 (/var/run/ptp4lro): INITIALIZING to LISTENING on INIT_COMPLETE
ptp4l[15077.995]: port 1 (enp5s0): new foreign master 00049f.fffe.beef00-1
ptp4l[15082.440]: selected best master clock 00049f.fffe.beef00
ptp4l[15082.440]: port 1 (enp5s0): LISTENING to UNCALIBRATED on RS_SLAVE
ptp4l[15084.666]: master offset -32360145543123 s0 freq -62499999 path delay  -8130665
ptp4l[15085.778]: master offset -32360078562698 s1 freq -2222489 path delay  -5660801
ptp4l[15086.889]: master offset    2472260 s2 freq +249771 path delay  -5660801
ptp4l[15086.889]: port 1 (enp5s0): UNCALIBRATED to SLAVE on MASTER_CLOCK_SELECTED
ptp4l[15088.000]: master offset    2195069 s2 freq +714258 path delay  -5660801
ptp4l[15089.111]: master offset   -2704377 s2 freq -3526667 path delay  -1554727
ptp4l[15090.222]: master offset    1213232 s2 freq -420371 path delay  -1554727
ptp4l[15091.334]: master offset     154387 s2 freq -1115247 path delay    -28324
ptp4l[15092.445]: master offset    1462279 s2 freq +238962 path delay    -96752
ptp4l[15093.556]: master offset    1128647 s2 freq +344013 path delay    -28324
ptp4l[15094.667]: master offset     691720 s2 freq +245680 path delay     26579
ptp4l[15095.778]: master offset     404474 s2 freq +165950 path delay     41044
ptp4l[15096.890]: master offset     191017 s2 freq  +73836 path delay     70336
ptp4l[15098.001]: master offset     129194 s2 freq  +69318 path delay     50290
ptp4l[15099.112]: master offset      64272 s2 freq  +43154 path delay     38450
ptp4l[15100.223]: master offset      16489 s2 freq  +14652 path delay     38450
ptp4l[15101.335]: master offset        486 s2 freq   +3596 path delay     38450
ptp4l[15102.446]: master offset      10839 s2 freq  +14095 path delay     24292
ptp4l[15103.557]: master offset      -4533 s2 freq   +1975 path delay     24292
ptp4l[15104.668]: master offset       9416 s2 freq  +14564 path delay      8364
ptp4l[15105.780]: master offset      -4121 s2 freq   +3852 path delay      5904
ptp4l[15106.891]: master offset      -8157 s2 freq   -1421 path delay      5904
ptp4l[15108.002]: master offset      -2837 s2 freq   +1452 path delay      2378
ptp4l[15109.113]: master offset      -3878 s2 freq    -440 path delay      2037
ptp4l[15110.224]: master offset      -2957 s2 freq    -682 path delay      1837
ptp4l[15111.335]: master offset      -1974 s2 freq    -586 path delay      1837
ptp4l[15112.447]: master offset       -895 s2 freq    -100 path delay      1697
ptp4l[15113.558]: master offset       -389 s2 freq    +138 path delay      1500
ptp4l[15114.669]: master offset       -131 s2 freq    +279 path delay      1342
ptp4l[15115.780]: master offset       -196 s2 freq    +175 path delay      1342
ptp4l[15116.892]: master offset       -154 s2 freq    +158 path delay      1350
ptp4l[15118.003]: master offset       -115 s2 freq    +151 path delay      1357
ptp4l[15119.114]: master offset       -108 s2 freq    +123 path delay      1357
ptp4l[15120.225]: master offset         53 s2 freq    +252 path delay      1357
ptp4l[15121.337]: master offset          5 s2 freq    +220 path delay      1363
ptp4l[15122.448]: master offset        -78 s2 freq    +138 path delay      1369
ptp4l[15123.559]: master offset         53 s2 freq    +246 path delay      1369
ptp4l[15124.670]: master offset        -27 s2 freq    +182 path delay      1380
ptp4l[15125.781]: master offset         39 s2 freq    +240 path delay      1380
ptp4l[15126.893]: master offset        -25 s2 freq    +187 path delay      1378
ptp4l[15128.004]: master offset         27 s2 freq    +232 path delay      1378
ptp4l[15129.115]: master offset         23 s2 freq    +236 path delay      1378
ptp4l[15130.226]: master offset         11 s2 freq    +231 path delay      1378
ptp4l[15131.337]: master offset        -17 s2 freq    +206 path delay      1378
ptp4l[15132.449]: master offset          8 s2 freq    +226 path delay      1378
ptp4l[15133.560]: master offset         11 s2 freq    +232 path delay      1378
ptp4l[15134.671]: master offset        -42 s2 freq    +182 path delay      1378
ptp4l[15135.782]: master offset         23 s2 freq    +234 path delay      1375

레이어4는 안되고 2만됨
