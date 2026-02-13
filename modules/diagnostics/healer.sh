#!/bin/bash
# modules/diagnostics/healer.sh
# KATANA MODULE: THE HEALER
# Automatic System Repair & Service Recovery
# ==============================================================================

function run_healer() {
    draw_header "KATANA HEALER"
    log_info "Initiating Auto-Repair Sequence..."
    echo "  This tool attempts to fix common issues automatically."
    echo ""
    
    # Check for sudo access first
    if ! sudo -n true 2>/dev/null; then
         log_warn "Sudo access required for repairs."
         sudo -v
    fi

    # 1. Permission Healing
    heal_permissions
    
    # 2. Dependency Healing
    heal_dependencies
    
    # 3. Service Healing
    heal_service_status "klipper"
    heal_service_status "moonraker"
    heal_service_status "nginx"
    
    log_success "Heal Sequence Complete."
    read -p "  Press Enter to return..."
}

function heal_permissions() {
    log_info "Step 1: Verifying Filesystem Permissions..."
    
    local target_dirs=("$HOME/printer_data" "$HOME/klipper_logs")
    local fixed=false
    
    for dir in "${target_dirs[@]}"; do
        if [ -d "$dir" ]; then
            # Simple check: owner should be current user
            if [ "$(stat -c '%U' "$dir")" != "$USER" ]; then
                log_warn "Ownership mismatch on $dir. Fixing..."
                sudo chown -R "$USER":"$USER" "$dir"
                fixed=true
            fi
        fi
    done
    
    if [ "$fixed" = true ]; then
        log_success "Permissions corrected."
    else
        log_info "Permissions look nominal."
    fi
}

function heal_dependencies() {
    log_info "Step 2: Checking Critical Dependencies..."
    # Common missing libs that cause Klipper/Moonraker failures
    local critical_deps=("libopenjp2-7" "python3-numpy" "liblmdb-dev")
    local missing_deps=()
    
    for dep in "${critical_deps[@]}"; do
        if ! dpkg -s "$dep" >/dev/null 2>&1; then
             missing_deps+=("$dep")
        fi
    done
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        log_warn "Missing dependencies detected: ${missing_deps[*]}"
        log_info "Installing missing packages..."
        sudo apt-get update && sudo apt-get install -y "${missing_deps[@]}"
        log_success "Dependencies installed."
    else
        log_info "Dependencies look nominal."
    fi
}

function heal_service_status() {
    local svc="$1"
    # log_info "Step 3.$svc: Checking Service Health..."
    
    # Check if unit exists
    if systemctl list-unit-files "$svc.service" >/dev/null 2>&1; then
        if systemctl is-active --quiet "$svc"; then
            echo "  [OK] $svc is running."
        else
            log_warn "$svc is DOWN or FAILED."
            log_info "Attempting to restart $svc..."
            
            sudo systemctl restart "$svc"
            sleep 3
            
            if systemctl is-active --quiet "$svc"; then
                log_success "$svc recovered successfully."
            else
                log_error "$svc failed to recover."
                # Show last few log lines
                echo "  --- LOG TAIL ($svc) ---"
                journalctl -u "$svc" -n 5 --no-pager
                echo "  -----------------------"
            fi
        fi
    else
        echo "  [SKIP] Service $svc not found."
    fi
}
