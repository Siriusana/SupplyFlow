# SupplyFlow Web - Frontend React

Frontend web do SupplyFlow desenvolvido com React, TypeScript e Vite.

## Tecnologias

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Recharts (gráficos)
- xlsx (exportação Excel)
- jspdf (exportação PDF)
- Axios (requisições HTTP)

## Instalação

```bash
npm install
```

## Executar

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build
```

## Estrutura

```
web/
├── src/
│   ├── components/     # Componentes React
│   ├── context/        # Context API (AuthContext)
│   ├── services/       # Serviços de API
│   ├── utils/          # Utilitários
│   └── styles/         # Estilos globais
├── package.json
└── vite.config.ts
```

## Configuração da API

A URL da API está configurada em `src/services/api.ts`:

```typescript
const API_BASE_URL = 'http://localhost:8080/api';
```

Certifique-se de que o backend está rodando antes de iniciar o frontend.

## Funcionalidades

- Dashboard com gráficos e estatísticas
- Gerenciamento de Fornecedores (CRUD)
- Requisições de Compra
- Negociações
- Orçamentos e Cotações
- Pedidos com Rastreamento
- Relatórios e Exportação (Excel/PDF)
- Autenticação JWT


