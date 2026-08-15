#!/usr/bin/env bash
# Run this once on a fresh EC2 instance (Ubuntu 22.04/24.04) to install
# Docker + Docker Compose + Jenkins, all that's needed to build and run
# Tiranga Taar via the included Jenkinsfile.
#
# Usage:  ssh into the instance, then:
#   curl -fsSL https://raw.githubusercontent.com/Rajesh-210/tiranga-taar/main/deploy/ec2-setup.sh -o ec2-setup.sh
#   chmod +x ec2-setup.sh
#   sudo ./ec2-setup.sh

set -euo pipefail

echo "==> Updating packages"
apt-get update -y
apt-get upgrade -y

echo "==> Installing Docker"
apt-get install -y ca-certificates curl gnupg
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

echo "==> Installing Jenkins (needs Java 17)"
apt-get install -y fontconfig openjdk-17-jre
curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key -o /usr/share/keyrings/jenkins-keyring.asc
echo "deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable binary/" | tee /etc/apt/sources.list.d/jenkins.list > /dev/null
apt-get update -y
apt-get install -y jenkins

echo "==> Letting Jenkins run Docker"
usermod -aG docker jenkins
usermod -aG docker "${SUDO_USER:-ubuntu}"

systemctl enable docker jenkins
systemctl restart docker jenkins

echo ""
echo "==================================================================="
echo " Done. Next steps:"
echo " 1. Open EC2 security group inbound rules for: 22, 80, 8080"
echo " 2. Visit http://<ec2-public-ip>:8080 to finish the Jenkins setup"
echo " 3. Initial admin password:"
echo "    $(cat /var/lib/jenkins/secrets/initialAdminPassword 2>/dev/null || echo 'not ready yet, wait a few seconds and re-run this cat command')"
echo "==================================================================="
