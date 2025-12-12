#!/bin/bash

# Script para instalar o Oracle Instant Client localmente no servidor

echo "Instalando dependências necessárias..."
sudo apt-get update && sudo apt-get install -y \
    libaio1t64 \
    unzip \
    wget \
    || { echo "Erro ao instalar dependências"; exit 1; }

echo "Criando diretório /opt/oracle..."
sudo mkdir -p /opt/oracle

echo "Baixando Oracle Instant Client..."
cd /tmp
sudo wget https://download.oracle.com/otn_software/linux/instantclient/2117000/instantclient-basic-linux.x64-21.17.0.0.0dbru.zip \
    || { echo "Erro ao baixar o Oracle Instant Client"; exit 1; }

echo "Extraindo Oracle Instant Client para /opt/oracle..."
sudo unzip instantclient-basic-linux.x64-21.17.0.0.0dbru.zip -d /opt/oracle/ \
    || { echo "Erro ao extrair o Oracle Instant Client"; exit 1; }

echo "Limpando arquivo temporário..."
sudo rm instantclient-basic-linux.x64-21.17.0.0.0dbru.zip

echo "Configurando variáveis de ambiente..."
# Adicionar ao /etc/environment para todos os usuários
sudo bash -c 'cat >> /etc/environment << EOF

# Oracle Instant Client
LD_LIBRARY_PATH=/opt/oracle/instantclient_21_17
TNS_ADMIN=/opt/oracle/instantclient_21_17
ORACLE_LIB_DIR=/opt/oracle/instantclient_21_17
EOF'

# Adicionar ao ~/.bashrc para o usuário atual
cat >> ~/.bashrc << EOF

# Oracle Instant Client
export LD_LIBRARY_PATH=/opt/oracle/instantclient_21_17:\$LD_LIBRARY_PATH
export TNS_ADMIN=/opt/oracle/instantclient_21_17
export ORACLE_LIB_DIR=/opt/oracle/instantclient_21_17
EOF

echo "Instalação concluída!"
echo ""
echo "Para aplicar as variáveis de ambiente na sessão atual, execute:"
echo "source ~/.bashrc"
echo ""
echo "Ou faça logout e login novamente."
echo ""
echo "Verificando instalação..."
ls -la /opt/oracle/instantclient_21_17/ | head -10

