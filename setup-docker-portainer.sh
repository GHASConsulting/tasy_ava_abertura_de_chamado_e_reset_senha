#!/bin/bash

# Atualizar o sistema
sudo apt update && sudo apt upgrade -y

# Instalar dependências do Docker
sudo apt install -y ca-certificates curl gnupg lsb-release

# Adicionar chave GPG oficial do Docker
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Adicionar repositório do Docker
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Instalar Docker e Docker Compose plugin
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Habilitar e iniciar o Docker
sudo systemctl enable docker
sudo systemctl start docker

# Criar diretório do Portainer
mkdir -p ~/portainer
cd ~/portainer

# Criar arquivo docker-compose.yml
cat <<EOF > docker-compose.yml
version: '3.8'
services:
  portainer:
    image: portainer/portainer-ce:latest
    container_name: portainer
    restart: always
    security_opt:
      - no-new-privileges:true
    ports:
      - "8000:8000"
      - "9443:9443"
      - "9000:9000"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - portainer_data:/data
    environment:
      - PORTAINER_ADMIN_USERNAME=admin
      - PORTAINER_ADMIN_PASSWORD=admin123
volumes:
  portainer_data:
EOF

# Subir o container com Docker Compose
docker compose up -d

echo "✅ Docker, Docker Compose e Portainer foram instalados e iniciados!"
echo "🌐 Acesse o Portainer em: https://localhost:9443 ou http://localhost:9000"
echo "👤 Credenciais do Portainer:"
echo "   Usuário: admin"
echo "   Senha: admin123"

# Configurar e subir a API-AVA
echo "🚀 Configurando e iniciando a API-AVA..."

# Navegar para o diretório da API-AVA
cd ~/API_RESET_TASY

# Criar arquivo docker-compose.yml para a API-AVA
cat <<EOF > docker-compose.yml
version: "3.8"

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: AVA-integration
    restart: unless-stopped
    ports:
      - "5000:5000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=production
      - PORT=5000
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
EOF

# Construir e iniciar a API-AVA
docker compose up -d --build

echo "✅ API-AVA foi construída e iniciada com sucesso!"
echo "🌐 A API-AVA está disponível em: http://localhost:5000"