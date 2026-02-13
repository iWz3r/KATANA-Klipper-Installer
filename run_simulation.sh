#!/bin/bash
export KATANA_ROOT=$(pwd)
export CORE_DIR="$KATANA_ROOT/core"
export MODULES_DIR="$KATANA_ROOT/modules"
export CONFIGS_DIR="$KATANA_ROOT/configs"
export LOG_FILE="$KATANA_ROOT/katana_test.log"

# Mocks
function sudo() { echo "[SUDO] $@" ; }
function make() { echo "[MAKE] $@" ; return 0; }
function python3() { echo "[PYTHON] $@" ; }
function zip() { echo "[ZIP] $@" ; return 0; }
function systemctl() { echo "klipper.service loaded active running"; }
function df() { echo "Filesystem Size Used Avail Use% Mounted on"; echo "/dev/root 29G 1.5G 27G 5% /"; }
function vcgencmd() { echo "throttled=0x0"; }
export -f sudo make python3 zip systemctl df vcgencmd

# Create dummy input
cat <<EOF > inputs.txt
7
4

b
X
EOF

# Run
./katanaos.sh < inputs.txt
