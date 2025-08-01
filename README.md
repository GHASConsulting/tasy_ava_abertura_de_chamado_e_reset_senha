# API AVA - Sistema de Abertura de Chamados TASY

## 📋 Descrição

API REST desenvolvida em Node.js para integração com o sistema TASY (Sistema de Gestão Hospitalar) para abertura de chamados de manutenção. O sistema permite autenticação de usuários e criação de chamados técnicos através de procedures Oracle, com interface web gerenciada pelo Portainer.

## 🚀 Tecnologias Utilizadas

- **Node.js 18** - Runtime JavaScript
- **Express.js** - Framework web
- **Oracle Database** - Banco de dados principal (TASY)
- **SQLite3** - Banco de dados local para usuários
- **Knex.js** - Query builder e migrações
- **JWT** - Autenticação com token sem expiração
- **bcryptjs** - Criptografia de senhas
- **PM2** - Gerenciador de processos em produção
- **Docker & Docker Compose** - Containerização
- **Portainer** - Interface web para gerenciamento de containers

## 📁 Estrutura do Projeto

```
ava_abertura_de_chamado/
├── src/
│   ├── config/
│   │   └── auth.js                    # Configurações JWT (sem expiração)
│   ├── connection/
│   │   └── index.js                   # Conexão Oracle Database
│   ├── controller/
│   │   ├── ChamadoController.js       # Controlador de chamados TASY
│   │   ├── SessionController.js       # Controlador de autenticação
│   │   ├── UserController.js          # Controlador de usuários
│   │   └── ControllerResetTasy.js     # Controlador de reset TASY
│   ├── database/
│   │   ├── database.db                # Banco SQLite local
│   │   ├── knex/
│   │   │   ├── index.js               # Configuração Knex
│   │   │   └── migrations/
│   │   │       └── 20240816145816_CreateUser.js
│   │   └── sqlite/
│   │       └── index.js               # Conexão SQLite
│   ├── middlewares/
│   │   └── ensureAuthenticated.js     # Middleware JWT
│   ├── repositories/
│   │   └── UserCreateService.js       # Serviço de usuários
│   ├── routes/
│   │   ├── createChamado.routes.js    # Rotas de chamados
│   │   ├── createUser.routes.js       # Rotas de usuários
│   │   ├── sessions.routes.js         # Rotas de autenticação
│   │   ├── valid.routes.js            # Rotas de validação
│   │   └── index.js                   # Arquivo principal de rotas
│   ├── utils/
│   │   └── AppError.js                # Classe de tratamento de erros
│   └── server.js                      # Servidor principal
├── setup-docker-portainer.sh          # Script de instalação Docker + Portainer
├── docker-compose.yml                 # Configuração Docker Compose
├── dockerfile.txt                     # Dockerfile da aplicação
├── ecosystem.config.js                # Configuração PM2
├── knexfile.js                        # Configuração Knex
└── package.json                       # Dependências do projeto
```

## 🔧 Funcionalidades

### 🔐 Autenticação

- Criação de usuários com senha criptografada (bcryptjs)
- Login com JWT sem expiração (`expiresIn: "-1"`)
- Middleware de autenticação para rotas protegidas
- Validação de token via header `Authorization: Bearer <token>`

### 📝 Chamados TASY

- Criação de chamados técnicos via procedure Oracle `ghas_os_ava_p`
- Validação e limpeza de dados JSON (remoção de caracteres de controle)
- Logs detalhados de processamento
- Integração direta com sistema TASY

### 🗄️ Banco de Dados

- **Oracle Database**: Banco principal para procedures TASY
- **SQLite3**: Banco local para gerenciamento de usuários
- Migrações automáticas com Knex.js
- Pool de conexões configurado

### 🐳 Containerização

- Docker com Oracle Instant Client integrado
- Docker Compose para orquestração
- Portainer para gerenciamento web
- Volumes persistentes para dados

## 🛠️ Instalação e Configuração

### Método 1: Instalação Automática (Recomendado)

Execute o script de instalação que configura tudo automaticamente:

```bash
# Dar permissão de execução
chmod +x setup-docker-portainer.sh

# Executar o script
./setup-docker-portainer.sh
```

O script irá:

- Instalar Docker e Docker Compose
- Configurar e iniciar Portainer
- Construir e iniciar a API AVA
- Configurar todas as dependências

### Método 2: Instalação Manual

#### Pré-requisitos

- Ubuntu/Debian (para script automático)
- Node.js 18+
- Oracle Database
- Oracle Instant Client

#### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd ava_abertura_de_chamado
```

#### 2. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Configurações do Oracle Database
BASE_USER=seu_usuario_oracle
BASE_PASSWORD=sua_senha_oracle
DATABASE_URL=sua_url_conexao_oracle
LIBARY_ORACLE=caminho_para_oracle_client

# Configurações JWT
AUTH_SECRET=sua_chave_secreta_jwt

# Configurações do usuário padrão
USER_SERVICE=usuario_padrao
PASSORWD=senha_padrao
```

#### 3. Instalação local

```bash
# Instalar dependências
npm install

# Executar migrações
npm run migrate

# Iniciar em desenvolvimento
npm run dev

# Iniciar em produção
npm start
```

#### 4. Instalação Docker

```bash
# Construir e iniciar com Docker Compose
docker-compose up -d --build

# Ou construir manualmente
docker build -f dockerfile.txt -t api-ava .
docker run -p 5000:5000 --env-file .env api-ava
```

## 🌐 Acesso aos Serviços

### Portainer (Gerenciamento Web)

- **URL**: https://localhost:9443 ou http://localhost:9000
- **Usuário**: admin
- **Senha**: admin123

### API AVA

- **URL**: http://localhost:5000
- **Status**: Disponível após instalação

## 📡 Endpoints da API

### Autenticação

#### POST `/sessions`

Cria uma nova sessão de usuário.

**Body:**

```json
{
  "name": "usuario",
  "password": "senha"
}
```

**Response:**

```json
"jwt_token_sem_expiracao"
```

#### POST `/users`

Cria um novo usuário (protegido por autenticação).

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Body:**

```json
{
  "name": "novo_usuario",
  "password": "nova_senha"
}
```

### Chamados TASY

#### POST `/chamado`

Cria um novo chamado técnico (protegido por autenticação).

**Headers:**

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Body:**

```json
{
  "dsDanoBreve": "Descrição breve do dano",
  "nmUsuario": "Nome do usuário",
  "dsDano": "Descrição detalhada do dano",
  "cdPessoaSolicitante": "Código da pessoa solicitante",
  "nrSeqLocalizacao": "Número de sequência da localização",
  "nrSeqEquipamento": "Número de sequência do equipamento",
  "status": "Status do chamado"
}
```

**Response:**

```json
{
  "message": "Chamado criado com sucesso"
}
```

## 🔒 Segurança

- **JWT sem expiração**: Tokens permanecem válidos indefinidamente
- **Criptografia**: Senhas criptografadas com bcryptjs (salt rounds: 8)
- **Autenticação obrigatória**: Todas as rotas principais protegidas
- **Validação de dados**: Limpeza de caracteres de controle em JSON
- **Variáveis de ambiente**: Configurações sensíveis externalizadas

## 📊 Monitoramento e Logs

### PM2 (Produção)

- **Instâncias**: Máximo disponível
- **Modo**: Cluster
- **Restart**: Automático em falhas
- **Logs**: Automáticos

### Logs do Sistema

- Conexão Oracle Database
- Criação de chamados TASY
- Autenticação de usuários
- Erros de processamento
- Execução de procedures

## 🐛 Troubleshooting

### Problemas com Oracle Client

```bash
# Verificar instalação Oracle Client
ls -la $LIBARY_ORACLE

# Para Docker (instalado automaticamente)
docker exec -it AVA-integration ls -la /opt/oracle/instantclient_21_17
```

### Problemas de Conexão

```bash
# Testar conectividade Oracle
sqlplus usuario/senha@database_url

# Verificar logs do container
docker logs AVA-integration
```

### Problemas de Autenticação

```bash
# Verificar usuários no SQLite
sqlite3 src/database/database.db "SELECT * FROM users;"

# Verificar JWT
echo "seu_token" | base64 -d
```

### Problemas com Portainer

```bash
# Verificar status do Portainer
docker ps | grep portainer

# Reiniciar Portainer
docker restart portainer
```

## 🔧 Comandos Úteis

### Docker

```bash
# Ver logs da API
docker logs AVA-integration

# Reiniciar API
docker restart AVA-integration

# Acessar container
docker exec -it AVA-integration bash

# Reconstruir imagem
docker-compose up -d --build
```

### Desenvolvimento

```bash
# Executar migrações
npm run migrate

# Modo desenvolvimento
npm run dev

# Modo produção
npm start
```

## 📝 Estrutura do Banco de Dados

### Tabela Users (SQLite)

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  password TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  upated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Procedure Oracle (TASY)

```sql
ghas_os_ava_p(
  ds_dano_brev_p,
  ds_dano_p,
  cd_pf_solic_p,
  nr_seq_localizacao_p,
  nr_seq_equipamento_p,
  nm_usuario_p,
  ie_status_p
);
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC.

## 👥 Autores

- Desenvolvido para integração com sistema TASY
- API para abertura de chamados técnicos hospitalares

## 📞 Suporte

Para suporte técnico ou dúvidas sobre a implementação:

- Verifique os logs do sistema
- Consulte a documentação do TASY
- Entre em contato com a equipe de desenvolvimento
