#!/bin/bash
# ==============================================================================
# KATANA MODULE: THE FORGE HAL (Flash Engine)
# Automated Firmware Compilation via Profiles
# ==============================================================================

function run_hal_flasher() {
    draw_header "THE FORGE HAL - PROFILE FLASHER"
    
    local profile_dir="$MODULES_DIR/hardware/profiles"
    if [ ! -d "$profile_dir" ]; then
        log_error "Profile directory missing!"
        return
    fi
    
    # 1. List Profiles
    local profiles=($(ls "$profile_dir"/*.config 2>/dev/null))
    
    if [ ${#profiles[@]} -eq 0 ]; then
        log_error "No profiles found in $profile_dir"
        return
    fi
    
    echo "  Available Board Profiles:"
    local i=1
    for prof in "${profiles[@]}"; do
        echo "  [$i] $(basename "$prof" .config)"
        ((i++))
    done
    echo ""
    echo "  [B] Back"
    
    read -p "  >> SELECT PROFILE: " choice
    
    if [[ "$choice" =~ ^[0-9]+$ ]] && [ "$choice" -ge 1 ] && [ "$choice" -le "${#profiles[@]}" ]; then
        local selected="${profiles[$((choice-1))]}"
        local profile_name=$(basename "$selected" .config)
        
        log_info "Selected: $profile_name"
        do_compile_profile "$selected"
    else
        return
    fi
}

function do_compile_profile() {
    local profile_path="$1"
    local klipper_dir="$HOME/klipper"
    
    if [ ! -d "$klipper_dir" ]; then
        log_error "Klipper directory not found!"
        return
    fi
    
    # 2. Apply Config
    log_info "Applying profile to Klipper..."
    cp "$profile_path" "$klipper_dir/.config"
    
    cd "$klipper_dir" || return
    
    # 3. Make Process
    log_info "Running 'make olddefconfig'..."
    if ! make olddefconfig; then
        log_error "Failed to apply config defaults."
        return
    fi
    
    log_info "Cleaning build..."
    make clean > /dev/null
    
    log_info "Compiling Firmware (This may take a minute)..."
    if make; then
        log_success "Firmware Compiled Successfully!"
        echo "  [i] Binary: $klipper_dir/out/klipper.bin"
        
        # 4. Flash Menu
        echo ""
        echo "  Flash Options:"
        echo "  1) Flash via USB (DFU/Avrdude)"
        echo "  2) Copy to SD Card (Manual)"
        echo "  3) Flash via Katapult (CAN)"
        echo "  S) Skip Flash"
        
        read -p "  >> " fopt
        case $fopt in
            1) 
                log_info "Attempting USB Flash..."
                make flash
                ;;
            2)
                log_info "Please copy 'out/klipper.bin' to your SD card."
                read -p "  Press Enter to open folder (mock)..."
                ;;
            3)
                if [ -f "$KATANA_ROOT/scripts/can_scanner.py" ]; then
                     python3 "$KATANA_ROOT/scripts/can_scanner.py"
                     read -p "  Enter UUID: " uuid
                     python3 lib/canboot/flash_can.py -u $uuid
                else
                    echo "  [!] Scanner missing."
                fi
                ;;
        esac
    else
        log_error "Compilation Failed!"
    fi
    
    read -p "  Press [Enter] to return..."
}
