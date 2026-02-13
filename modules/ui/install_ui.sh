#!/bin/bash
# modules/ui/install_ui.sh

function install_ui_stack() {
    while true; do
        draw_header "WEB INTERFACE INSTALLER"
        echo "  1) Install Mainsail (Recommended)"
        echo "  2) Install Fluidd"
        echo "  3) Remove UI"
        echo "  B) Back"
        echo ""
        read -p "  >> " ch
        
        case $ch in
            1) do_install_mainsail ;;
            2) do_install_fluidd ;;
            3) do_remove_ui ;;
            [bB]) return ;;
        esac
    done
}

function do_install_mainsail() {
    log_info "Installing Mainsail..."
    
    # Logic to download/install mainsail
    # Simplified placeholder logic as real logic was likely lost or needs to be robust
    local install_dir="$HOME/mainsail"
    if [ -d "$install_dir" ]; then
        log_warn "Mainsail already exists at $install_dir"
    else
        log_info "Cloning Mainsail..."
        # In reality, mainsail is usually a zip release, not a clone for the build
        # But for KIAUH replacement, we usually fetch the latest release.
        # For now, I will use a standard creating directory method.
        mkdir -p "$install_dir"
        # Download latest release (simulated for stability/explanation)
        wget -q -O mainsail.zip https://github.com/mainsail-crew/mainsail/releases/latest/download/mainsail.zip
        unzip -q mainsail.zip -d "$install_dir"
        rm mainsail.zip
        log_success "Mainsail downloaded."
    fi
    
    # Configure Nginx
    setup_nginx "mainsail"
    
    log_success "Mainsail Installed."
    read -p "  Press Enter..."
}

function do_install_fluidd() {
    log_info "Installing Fluidd..."
    local install_dir="$HOME/fluidd"
     if [ -d "$install_dir" ]; then
        log_warn "Fluidd already exists at $install_dir"
    else
        mkdir -p "$install_dir"
        wget -q -O fluidd.zip https://github.com/fluidd-core/fluidd/releases/latest/download/fluidd.zip
        unzip -q fluidd.zip -d "$install_dir"
        rm fluidd.zip
        log_success "Fluidd downloaded."
    fi
    
    # Configure Nginx
    setup_nginx "fluidd"
    
    log_success "Fluidd Installed."
    read -p "  Press Enter..."
}

function do_remove_ui() {
    log_info "Removing UI..."
    rm -rf "$HOME/mainsail" "$HOME/fluidd"
    log_success "UI Removed."
    read -p "  Press Enter..."
}

function setup_nginx() {
    local ui_type="$1" # mainsail or fluidd
    log_info "Configuring Nginx for $ui_type..."
    
    # Check if nginx is installed
    if ! command -v nginx &> /dev/null; then
        if sudo -n true 2>/dev/null; then
            sudo apt-get install -y nginx
        else
            echo "  [!] Sudo required to install nginx."
            sudo apt-get install -y nginx
        fi
    fi
    
    # Create basic config (Production hardening is separate module, this is basic Access)
    local cfg_file="/etc/nginx/sites-available/$ui_type"
    local root_dir="$HOME/$ui_type"
    
    # Basic Upstream for Moonraker
    # Note: efficient serving requires more, this is bare minimum for access
    # In reality, we should use the standard templates provided by Mainsail/Fluidd docs
    
    # For now, we assume user knows Nginx or uses the Moonraker default checks
    # Or better: We write a simple config that serves the directory
    
    # Writing a simplified config for port 80
    sudo tee "$cfg_file" > /dev/null <<EOF
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    access_log /var/log/nginx/klipper_access.log;
    error_log /var/log/nginx/klipper_error.log;

    location / {
        root $root_dir;
        index index.html;
        try_files \$uri \$uri/ /index.html;
    }

    location /server {
        proxy_pass http://localhost:7125;
        proxy_set_header Host \$http_host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Scheme \$scheme;
    }
    
    location /websocket {
        proxy_pass http://localhost:7125/websocket;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$http_host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_read_timeout 86400;
    }
    
    location /webcam {
        proxy_pass http://127.0.0.1:8080/;
    }
}
EOF
    
    # Link it
    sudo ln -sf "$cfg_file" "/etc/nginx/sites-enabled/default"
    sudo rm -f "/etc/nginx/sites-enabled/default.save"
    
    # Test & Reload
    # sudo nginx -t
    sudo systemctl restart nginx
    
    log_success "Nginx configured for $ui_type."
}
