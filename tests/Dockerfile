FROM debian:bookworm-slim

# 1. Install basic tools to mimic a fresh Pi
# We need sudo because the script expects it
RUN apt-get update && apt-get install -y \
    sudo \
    bash \
    git \
    curl \
    nano \
    systemd \
    && rm -rf /var/lib/apt/lists/*

# 2. Create a user 'pi' with sudo privileges (passwordless)
RUN useradd -m -s /bin/bash pi && \
    echo "pi ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# 3. Set workdir
WORKDIR /home/pi/KATANA

# 4. Copy current directory into the container
# (This simulates 'git clone')
COPY . /home/pi/KATANA
RUN chown -R pi:pi /home/pi/KATANA

# 5. Switch to user
USER pi

# 6. Make script executable
RUN chmod +x katanaos.sh

# 7. Entrypoint
CMD ["./katanaos.sh"]
