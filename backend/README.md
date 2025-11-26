# SupplyFlow Backend - Node.js/TypeScript

Backend do SupplyFlow desenvolvido em Node.js com TypeScript, Express e TypeORM.

## Tecnologias

- **Node.js** + **TypeScript**
- **Express.js** - Framework web
- **TypeORM** - ORM para TypeScript
- **better-sqlite3** - Driver SQLite com suporte multithread
- **JWT** - Autenticação
- **bcryptjs** - Hash de senhas

## Instalação

```bash
# Instalar dependências
npm install

# Criar arquivo .env (copiar de .env.example)
cp .env.example .env
```

## Configuração

Edite o arquivo `.env`:

```env
PORT=8080
JWT_SECRET=5367566B59703373367639792F423F4528482B4D6251655468576D5A71347437
JWT_EXPIRATION=86400000
DB_PATH=./supplyflow.db
CORS_ORIGINS=http://localhost:5173,http://localhost:3000,http://localhost:8081
```

## Executar

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm run build
npm start
```

## Endpoints

### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro

### Dashboard
- `GET /api/dashboard/all` - Todos os dados do dashboard
- `GET /api/dashboard/stats` - Estatísticas
- `GET /api/dashboard/monthly-expenses` - Despesas mensais
- `GET /api/dashboard/category-expenses` - Despesas por categoria
- `GET /api/dashboard/requisition-status` - Status de requisições
- `GET /api/dashboard/recent-activities` - Atividades recentes

### Fornecedores
- `GET /api/fornecedores` - Listar todos
- `GET /api/fornecedores/:id` - Buscar por ID
- `GET /api/fornecedores/status/:status` - Buscar por status
- `GET /api/fornecedores/categoria/:categoria` - Buscar por categoria
- `GET /api/fornecedores/search?nome=...` - Buscar por nome
- `POST /api/fornecedores` - Criar (requer autenticação)
- `PUT /api/fornecedores/:id` - Atualizar (requer autenticação)
- `DELETE /api/fornecedores/:id` - Excluir (requer autenticação + admin)

### Requisições
- `GET /api/requisicoes` - Listar todas
- `GET /api/requisicoes/:id` - Buscar por ID
- `GET /api/requisicoes/codigo/:codigo` - Buscar por código
- `GET /api/requisicoes/status/:status` - Buscar por status
- `POST /api/requisicoes` - Criar (requer autenticação + admin)
- `PUT /api/requisicoes/:id` - Atualizar (requer autenticação)
- `PUT /api/requisicoes/:id/aprovar` - Aprovar (requer autenticação + admin)
- `PUT /api/requisicoes/:id/rejeitar` - Rejeitar (requer autenticação + admin)
- `DELETE /api/requisicoes/:id` - Excluir (requer autenticação + admin)

### Negociações, Orçamentos, Pedidos, Relatórios
Ver código fonte para endpoints completos.

## Usuários Padrão

- **Admin**: `admin` / `admin123`
- **User**: `user` / `user123`

## Banco de Dados

O banco SQLite é criado automaticamente na primeira execução. O arquivo será criado no caminho especificado em `DB_PATH` (padrão: `./supplyflow.db`).

O banco é populado automaticamente com dados mockados na primeira execução.

## Estrutura

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts      # Configuração do TypeORM
│   │   └── DataLoader.ts    # Carregamento de dados iniciais
│   ├── controllers/         # Controllers das rotas
│   ├── entities/            # Entidades TypeORM
│   ├── middleware/          # Middlewares (auth, etc)
│   ├── routes/              # Definição de rotas
│   └── index.ts             # Arquivo principal
├── package.json
├── tsconfig.json
└── README.md
```

