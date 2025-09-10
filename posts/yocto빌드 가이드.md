 
이 가이드는 **NXP GoldBox (S32G-VNP-RDB2)** 보드를 대상으로, Yocto 소스 코드를 빌드하여 **TSN 테스트에 필요한 모든 도구가 포함된 SD 카드 이미지**를 만드는 전 과정을 다룹니다.

-----

### S32G GoldBox용 Yocto 빌드 최종 가이드

#### 0단계: 사전 준비물 다운로드

빌드를 시작하기 전, NXP 공식 홈페이지에서 아래 두 가지 파일을 미리 다운로드하여 PC의 '다운로드' 폴더 등에 압축을 풀어둡니다.

1.  **S32G2 Linux BSP Pre-built Binaries**: `S32G2_LinuxBSP_44.0_binaries_updated_D250603.zip` 또는 유사한 이름의 파일. 이 파일에서 **DDR, SJA1110 펌웨어**를 얻습니다.
2.  **PFE Firmware**: `PFE-FW_S32G_1.11.0.zip` 또는 유사한 이름의 파일. 이 파일에서 **PFE 펌웨어와 라이선스 파일**을 얻습니다.

#### 1단계: WSL 및 호스트 개발 환경 설정

1.  **WSL 및 Ubuntu 20.04 설치**:

      * Windows PowerShell을 **관리자 권한**으로 실행하고 아래 명령어로 설치합니다.
        ```powershell
        wsl --install -d Ubuntu-20.04
        ```
      * 설치 후 PC를 재부팅하고, 실행된 Ubuntu 터미널에서 사용자 이름과 비밀번호를 설정합니다.

2.  **필수 패키지 전체 설치**:

      * Ubuntu 터미널에서 아래 명령어를 실행하여 Yocto 빌드에 필요한 모든 호스트 도구를 **한 번에** 설치합니다. (`host-prepare.sh` 스크립트를 사용하는 대신, 오류를 피하기 위해 직접 설치합니다.)
        ```bash
        sudo apt-get update
        sudo apt-get install -y gawk wget git diffstat unzip texinfo gcc-multilib build-essential chrpath socat cpio python3 python3-pip python3-pexpect xz-utils debianutils iputils-ping python3-git python3-jinja2 libegl1-mesa libsdl1.2-dev pylint xterm python3-subunit zstd libzstd-dev liblz4-tool libc-dev-bin
        ```

3.  **Repo 유틸리티 설치**:

    ```bash
    mkdir -p ~/bin
    curl https://storage.googleapis.com/git-repo-downloads/repo > ~/bin/repo
    chmod a+x ~/bin/repo
    export PATH=${PATH}:~/bin
    git config --global user.email "you@example.com"
    git config --global user.name "Your Name"
    ```

#### 2단계: Yocto 소스 코드 다운로드

1.  **작업 디렉터리 생성 및 이동**:

    ```bash
    mkdir ~/fsl-auto-yocto-bsp
    cd ~/fsl-auto-yocto-bsp
    ```

2.  **Yocto 프로젝트 초기화 및 동기화**:

    ```bash
    repo init -u https://github.com/nxp-auto-linux/auto_yocto_bsp -b release/bsp44.0 -m default.xml
    repo sync
    ```

#### 3단계: 펌웨어 파일 준비 및 레시피 자동 수정 (가장 중요)

빌드 오류를 원천적으로 방지하기 위해, 모든 펌웨어 파일을 올바른 위치에 배치하고 레시피 파일의 체크섬을 명령어로 자동 수정합니다.

1.  **펌웨어 폴더 구조 생성**:

    ```bash
    # 대표 폴더와 보드별 하위 폴더를 한 번에 생성
    mkdir -p ~/s32g_firmware/s32g274ardb2
    ```

2.  **펌웨어 파일 복사**:

      * **DDR, SJA1110 펌웨어** -\> `.../s32g274ardb2` **하위 폴더**로 복사
      * **PFE 펌웨어** -\> `.../s32g_firmware` **상위 폴더**로 복사
      * 아래 명령어에서 `~/Downloads/` 부분은 실제 파일이 있는 경로로 맞춰 수정해야 합니다.
        ```bash
        # DDR, SJA1110 펌웨어 복사
        cp ~/Downloads/s32g2_linuxbsp_44.0_binaries/s32g274ardb2/*.bin ~/s32g_firmware/s32g274ardb2/

        # PFE 펌웨어 복사
        cp ~/Downloads/PFE-FW_S32G_1.11.0/s32g_pfe_*.fw ~/s32g_firmware/

        # PFE 라이선스 파일을 두 가지 이름으로 준비
        cp ~/Downloads/PFE-FW_S32G_1.11.0/license.rtf ~/s32g_firmware/license.rtf
        cp ~/s32g_firmware/license.rtf ~/s32g_firmware/s32g274ardb2/NXP-EULA
        ```

3.  **레시피 체크섬 자동 수정**:
    `sed` 명령어를 사용하여 두 펌웨어 레시피의 라이선스 체크섬을 올바른 값으로 미리 변경합니다.

    ```bash
    # ddr-firmware 레시피 수정
    sed -i 's/a3cc8e4c7b0cbd2f26d689a255d1a98d/bafc2fc12f6ba76334b95f6ea4844b01/g' ~/fsl-auto-yocto-bsp/sources/meta-alb/meta-alb-bsp/recipes-bsp/ddr-firmware/ddr-firmware.bb

    # pfe-firmware 레시피 수정
    sed -i 's/LIC_FILES_CHKSUM = "file:\/\/license.rtf;md5=.*"/LIC_FILES_CHKSUM = "file:\/\/license.rtf;md5=bafc2fc12f6ba76334b95f6ea4844b01"/' ~/fsl-auto-yocto-bsp/sources/meta-alb/meta-alb-bsp/recipes-kernel/pfe/pfe-firmware_1.0.0.bb
    ```

#### 4단계: 최종 빌드 설정 및 실행

1.  **빌드 디렉터리 생성**:

    ```bash
    cd ~/fsl-auto-yocto-bsp
    source nxp-setup-alb.sh -m s32g274ardb2
    ```

2.  **`local.conf` 파일 최종 설정**:
    `nano conf/local.conf` 명령어로 파일을 열고, **파일 맨 아래에 아래 내용 전체를 복사하여 붙여넣습니다.**

    ```conf
    # --- S32G GoldBox Final Configuration ---

    # 1. 펌웨어 대표 폴더 경로 설정
    NXP_FIRMWARE_LOCAL_DIR = "/home/hwkims/s32g_firmware"

    # 2. PFE 기능 활성화
    DISTRO_FEATURES:append = " pfe"

    # 3. SJA1110 스위치 펌웨어 전체 경로 지정
    SJA1110_SWITCH_FW = "${NXP_FIRMWARE_LOCAL_DIR}/s32g274ardb2/sja1110_switch.bin"
    SJA1110_UC_FW = "${NXP_FIRMWARE_LOCAL_DIR}/s32g274ardb2/sja1110_uc.bin"

    # 4. 이미지에 네트워킹/디버깅/개발 도구 추가
    IMAGE_INSTALL:append = " iproute2 iperf3 ethtool tcpdump bridge-utils"
    EXTRA_IMAGE_FEATURES += "tools-sdk"
    ```

    *수정 후 저장(`Ctrl+X` -\> `Y` -\> `Enter`)합니다.*

3.  **빌드 실행**:
    이제 모든 준비가 끝났습니다. 빌드를 시작합니다.

    ```bash
    bitbake fsl-image-auto
    ```

#### 5단계: 빌드 완료 후 작업 및 테스트

1.  **SD 카드 제작**:

      * 빌드 완료 후 `~/fsl-auto-yocto-bsp/build_s32g274ardb2/tmp/deploy/images/s32g274ardb2/` 경로에 생성된 `fsl-image-auto-s32g274ardb2.sdcard` 파일을 `dd` 명령어로 SD 카드에 기록합니다.

2.  **보드 부팅 및 802.1Qav 테스트**:

      * GoldBox 보드의 DIP 스위치를 SD 부팅 모드로 설정하고 부팅합니다.
      * 부팅 후 `root`로 로그인하여 `tc` 명령어를 사용해 802.1Qav 테스트를 진행합니다.
        ```bash
        # 예시: end0 인터페이스에 MQPRIO 및 CBS 설정
        tc qdisc add dev end0 root handle 1: mqprio ...
        tc qdisc replace dev end0 parent 1:2 cbs ...
        ```

이 가이드를 따르면 다른 컴퓨터에서도 오류 없이 한 번에 빌드 및 테스트 환경을 구축하실 수 있을 것입니다.
