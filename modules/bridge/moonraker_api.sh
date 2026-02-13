#!/bin/bash
# modules/bridge/moonraker_api.sh
# KATANA API Bridge
# Connects Shell Scripts to Moonraker API for UI execution

function register_katana_extensions() {
    local moonraker_conf="$HOME/printer_data/config/moonraker.conf"
    
    # Check if section exists
    if grep -q "update_manager katana" "$moonraker_conf"; then
        log_info "KATANA API extension already registered."
        return 0
    fi
    
    log_info "Registering KATANA API Bridge..."
    
    cat <<EOF >> "$moonraker_conf"

# KATANA API Bridge
[update_manager katana]
type: git_repo
path: /opt/katana
primary_branch: main
is_system_service: False

[machine]
provider: systemd_cli

# KATANA System Health Commands
[gcode_shell_command heal_system]
command: bash /opt/katana/modules/diagnostics/healer.sh --auto
timeout: 60.0
verbose: True

[gcode_macro HEAL_SYSTEM]
gcode:
    RUN_SHELL_COMMAND CMD=heal_system
EOF

    log_success "KATANA API Bridge registered."
    # Restart Moonraker to apply
    sudo systemctl restart moonraker
}
