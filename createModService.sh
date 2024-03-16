#!/bin/bash

# Determine the absolute path of startMod.sh
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
START_MOD_SCRIPT="$SCRIPT_DIR/startMod.sh"
chmod +x "$SCRIPT_DIR/startMod.sh"

# Get the home directory of the user running this script
HOME_DIR=$(eval echo ~$USER)

# Create the systemd service file
SERVICE_FILE=/etc/systemd/system/scraxserviceMod.service
echo "[Unit]
Description=scraxserviceMod Service

[Service]
# Set the working directory to the user's home directory
WorkingDirectory=$HOME_DIR
ExecStart=$START_MOD_SCRIPT
Restart=always
# Restart service after 30 seconds if the node service crashes:
RestartSec=35

[Install]
WantedBy=multi-user.target" | sudo tee $SERVICE_FILE

# Reload systemd to apply new changes and enable the service
sudo systemctl daemon-reload
sudo systemctl enable scraxserviceMod.service

echo "Service created and enabled successfully."
echo "Run 'systemctl start scraxserviceMod' to start the service."