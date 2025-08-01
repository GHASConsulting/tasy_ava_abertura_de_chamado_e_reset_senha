# API AVA - Sistema de Abertura de Chamados

## 📋 Descrição

API REST desenvolvida em Node.js para integração com o sistema TASY (Sistema de Gestão Hospitalar) para abertura de chamados de manutenção. O sistema permite autenticação de usuários e criação de chamados técnicos através de procedures Oracle.

## 🚀 Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Oracle Database** - Banco de dados principal
- **SQLite** - Banco de dados local para usuários
- **Knex.js** - Query builder
- **JWT** - Autenticação
- **bcryptjs** - Criptografia de senhas
- **PM2** - Gerenciador de processos
- **Docker** - Containerização

## 📁 Estrutura do Projeto

```
ava_abertura_de_chamado/
├── src/
│   ├── config/
│   │   └── auth.js                 # Configurações de autenticação JWT
│   ├── connection/
│   │   └── index.js                # Conexão com Oracle Database
│   ├── controller/
│   │   ├── ChamadoController.js    # Controlador de chamados
│   │   ├── SessionController.js    # Controlador de sessões
│   │   └── UserController.js       # Controlador de usuários
│   ├── database/
│   │   ├── knex/
│   │   │   └── migrations/         # Migrações do banco SQLite
│   │   └── sqlite/
│   ├── middlewares/
│   │   └── ensureAuthenticated.js  # Middleware de autenticação
│   ├── repositories/
│   │   └── UserCreateService.js    # Serviço de criação de usuários
│   ├── routes/
│   │   ├── createChamado.routes.js # Rotas de chamados
│   │   ├── createUser.routes.js    # Rotas de usuários
│   │   ├── sessions.routes.js      # Rotas de autenticação
│   │   └── index.js                # Arquivo principal de rotas
│   ├── utils/
│   │   └── AppError.js             # Classe de tratamento de erros
│   └── server.js                   # Arquivo principal do servidor
├── docker-compose.yml              # Configuração Docker Compose
├── dockerfile.txt                  # Dockerfile da aplicação
├── ecosystem.config.js             # Configuração PM2
├── knexfile.js                     # Configuração Knex
└── package.json                    # Dependências do projeto
```

## 🔧 Funcionalidades

### 🔐 Autenticação

- Criação de usuários com senha criptografada
- Login com JWT (JSON Web Token)
- Middleware de autenticação para rotas protegidas

### 📝 Chamados

- Criação de chamados técnicos
- Integração com procedure Oracle `ghas_os_ava_p`
- Validação e limpeza de dados JSON
- Logs detalhados de processamento

### 🗄️ Banco de Dados

- **Oracle Database**: Banco principal para procedures e dados do TASY
- **SQLite**: Banco local para gerenciamento de usuários
- Migrações automáticas com Knex.js

## 🛠️ Instalação e Configuração

### Pré-requisitos

- Node.js 18+
- Oracle Database
- Oracle Instant Client
- Docker (opcional)

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd ava_abertura_de_chamado
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Configurações do Oracle Database
BASE_USER=seu_usuario_oracle
BASE_PASSWORD=sua_senha_oracle
DATABASE_URL=sua_url_conexao_oracle
LIBARY_ORACLE=caminho_para_oracle_client

# Configurações JWT
JWT_SECRET=sua_chave_secreta_jwt

# Configurações do usuário padrão
USER_SERVICE=usuario_padrao
PASSORWD=senha_padrao
```

### 4. Execute as migrações

```bash
npm run migrate
```

### 5. Inicie o servidor

**Desenvolvimento:**

```bash
npm run dev
```

**Produção:**

```bash
npm start
```

## 🐳 Execução com Docker

### Usando Docker Compose

```bash
docker-compose up -d
```

### Usando Docker diretamente

```bash
# Construir a imagem
docker build -f dockerfile.txt -t api-ava .

# Executar o container
docker run -p 5000:5000 --env-file .env api-ava
```

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
"jwt_token"
```

#### POST `/users`

Cria um novo usuário (protegido por autenticação).

**Body:**

```json
{
  "name": "novo_usuario",
  "password": "nova_senha"
}
```

### Chamados

#### POST `/chamado`

Cria um novo chamado técnico (protegido por autenticação).

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

- Todas as rotas principais são protegidas por autenticação JWT
- Senhas são criptografadas usando bcryptjs
- Validação e limpeza de dados JSON para prevenir injeção
- Variáveis de ambiente para configurações sensíveis

## 📊 Monitoramento

O projeto utiliza PM2 para gerenciamento de processos em produção:

- **Instâncias**: Máximo de instâncias disponíveis
- **Modo**: Cluster para melhor performance
- **Logs**: Automáticos
- **Restart**: Automático em caso de falha

## 🐛 Troubleshooting

### Problemas com Oracle Client

1. Verifique se o Oracle Instant Client está instalado
2. Configure a variável `LIBARY_ORACLE` no `.env`
3. Para Docker, o Oracle Client é instalado automaticamente

### Problemas de Conexão

1. Verifique as credenciais do Oracle Database
2. Confirme se a URL de conexão está correta
3. Teste a conectividade com o banco

### Problemas de Autenticação

1. Verifique se o usuário existe no banco SQLite
2. Confirme se o JWT_SECRET está configurado
3. Verifique se o token está sendo enviado corretamente

## 📝 Logs

O sistema gera logs detalhados para:

- Conexão com banco de dados
- Criação de chamados
- Autenticação de usuários
- Erros de processamento

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC. Veja o arquivo `LICENSE` para mais detalhes.

## 👥 Autores

- Desenvolvido para integração com sistema TASY
- API para abertura de chamados técnicos

## 📞 Suporte

Para suporte técnico ou dúvidas sobre a implementação, entre em contato com a equipe de desenvolvimento.
