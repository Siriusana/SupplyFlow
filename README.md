# SupplyFlow - Sistema de Gestão de Compras

Sistema completo de gestão de compras com backend Node.js, frontend web React e aplicativo mobile React Native.

## Estrutura do Projeto

```
SupplyFlow/
├── backend/              # Backend Node.js/TypeScript com Express
├── web/                  # Frontend React/Vite
├── mobile/               # Aplicativo Mobile React Native/Expo
├── EXECUTAR_BACKEND.sh   # Script para executar o backend
└── EXECUTAR_WEB.sh       # Script para executar o frontend web
```

## Tecnologias

**Backend:**
- Node.js + TypeScript
- Express.js
- TypeORM
- SQLite (better-sqlite3)
- JWT Authentication

**Frontend Web:**
- React + TypeScript
- Vite
- Tailwind CSS
- Recharts
- xlsx (Excel export)
- jspdf (PDF export)

**Aplicativo Mobile:**
- React Native + TypeScript
- Expo SDK 51+
- Expo Router
- React Native Chart Kit
- AsyncStorage

## Pré-requisitos

- Node.js (v18 ou superior)
- npm ou yarn

## Instalação e Execução

### 1. Backend

```bash
# Opção 1: Usar o script (recomendado)
./EXECUTAR_BACKEND.sh

# Opção 2: Manual
cd backend
npm install
npm run dev
```

O backend estará rodando em: **http://localhost:8080**

### 2. Frontend Web

```bash
# Opção 1: Usar o script
./EXECUTAR_WEB.sh

# Opção 2: Manual
cd web
npm install
npm run dev
```

O frontend estará disponível em: **http://localhost:5173**

### 3. Aplicativo Mobile

```bash
cd mobile
npm install
npm start
```

Depois, escaneie o QR Code com o Expo GO no seu dispositivo móvel.

> **Nota:** Para testar em dispositivo físico, edite `mobile/src/services/api.ts` e use o IP da sua máquina ao invés de `localhost`.

## Executar Tudo

Abra **2 terminais**:

**Terminal 1 - Backend:**
```bash
./EXECUTAR_BACKEND.sh
```

**Terminal 2 - Web:**
```bash
./EXECUTAR_WEB.sh
```

> **Nota:** Execute o backend primeiro, pois o web depende dele.

## Credenciais de Login

- **Admin**: `admin` / `admin123`
- **User**: `user` / `user123`

## URLs e Portas

- **Backend API**: http://localhost:8080/api
- **Backend Health Check**: http://localhost:8080/health
- **Frontend Web**: http://localhost:5173

## Funcionalidades

- ✅ Gerenciamento de Fornecedores
- ✅ Requisições de Compra
- ✅ Negociações
- ✅ Orçamentos e Cotações
- ✅ Pedidos com Rastreamento
- ✅ Dashboard com Indicadores
- ✅ Relatórios e Exportação (Excel/PDF)
- ✅ Autenticação JWT
- ✅ Controle de Acesso por Roles

## Documentação

- [Backend README](backend/README.md)
- [Web README](web/README.md)
- [Mobile README](mobile/README.md)

## Scripts de Execução

Todos os scripts estão na raiz do projeto e podem ser executados diretamente:

- `./EXECUTAR_BACKEND.sh` - Inicia o servidor backend (porta 8080)
- `./EXECUTAR_WEB.sh` - Inicia o frontend web (porta 5173)

## Notas Importantes

- ⚠️ **Sempre execute o backend primeiro** - O web e mobile dependem dele
- O backend cria o banco SQLite (`supplyflow.db`) automaticamente na primeira execução
- O banco é populado com dados mockados automaticamente pelo DataLoader
- Os scripts verificam e instalam dependências automaticamente se necessário
- Para testar o app mobile em dispositivo físico, use o IP da máquina na configuração da API
- O aplicativo mobile utiliza os mesmos endpoints da API do frontend web
