#!/bin/bash

set -e

echo "=========================================="
echo "       T-CLOUD UBUNTU SERVER"
echo "=========================================="

mkdir -p /run/sshd

echo "Starting SSH service..."

ssh-keygen -A

/usr/sbin/sshd

echo ""
echo "SSH: RUNNING"

echo ""
echo "Hostname:"
hostname

echo ""
echo "Kernel:"
uname -a

echo ""
echo "CPU:"
nproc

echo ""
echo "Memory:"
free -h

echo ""
echo "Disk:"
df -h /

echo ""
echo "Network:"
ip addr

echo ""
echo "=========================================="
echo "       SERVER READY"
echo "=========================================="

exec tail -f /dev/null
