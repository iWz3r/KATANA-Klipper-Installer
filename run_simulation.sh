#!/bin/bash
# Simulates KATANAOS in a Docker container

echo "building simulation container..."
docker build -t katanaos-sim -f tests/Dockerfile .

echo "starting simulation..."
echo "------------------------------------------------"
echo "You are now inside a clean Debian container."
echo "KATANAOS will start automatically."
echo "------------------------------------------------"

docker run -it --rm katanaos-sim
