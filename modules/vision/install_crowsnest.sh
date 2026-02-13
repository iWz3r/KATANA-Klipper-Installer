#!/bin/bash
# modules/vision/install_crowsnest.sh

function install_vision_stack() {
    draw_header "HMI & VISION (CROWSNEST)"
    echo "  1) Install Crowsnest (Webcam Streamer)"
    echo "  2) Remove Crowsnest"
    echo "  B) Back"
    read -p "  >> " ch
    
    case $ch in
        1) do_install_crowsnest ;;
        2) do_remove_crowsnest ;;
        [bB]) return ;;
    esac
}

function do_install_crowsnest() {
    log_info "Installing Crowsnest..."
    
    # 1. Clone
    local repo_dir="$HOME/crowsnest"
    if [ -d "$repo_dir" ]; then
        log_info "Crowsnest repo exists. Pulling..."
        cd "$repo_dir" && git pull
    else
        exec_silent "Cloning Crowsnest" "git clone https://github.com/mainsail-crew/crowsnest.git $repo_dir"
    fi
    
    # 2. Installer
    # Crowsnest has its own make install script, but usually we run the installer.
    cd "$repo_dir"
    log_info "Running Crowsnest Installer (Makefile)..."
    
    # Check dependencies
    if sudo -n true 2>/dev/null; then
         # We can try running their make install
         # But often it asks for input. Let's try silent assume-yes if possible or just run it.
         make install
    else
         echo "  [!] Sudo required for Crowsnest."
         make install
    fi
    
    log_success "Crowsnest Installed."
    read -p "  Press Enter..."
}

function do_remove_crowsnest() {
    log_info "Removing Crowsnest..."
    cd "$HOME/crowsnest" && make uninstall
    rm -rf "$HOME/crowsnest"
    log_success "Crowsnest Removed."
    read -p "  Press Enter..."
}
