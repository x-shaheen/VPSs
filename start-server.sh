#!/bin/bash

set -e

echo "=========================================="
echo " T-CLOUD UBUNTU SERVER"
echo "=========================================="

mkdir -p /run/sshd

echo "Starting SSH..."

/usr/sbin/sshd

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
echo " SERVER READY"
echo "=========================================="

# إبقاء الحاوية حية
exec tail -f /dev/null
