# SupplyFlow Mobile - Aplicativo React Native com Expo

Aplicativo mobile do SupplyFlow desenvolvido com React Native, Expo e TypeScript.

## Tecnologias

- **Expo SDK 54**
- **React Native**
- **TypeScript**
- **Expo Router** - Navegação baseada em arquivos
- **React Native Chart Kit** - Gráficos
- **Axios** - Requisições HTTP
- **AsyncStorage** - Armazenamento local
- **Expo Linear Gradient** - Gradientes

## Pré-requisitos

- Node.js (v18 ou superior)
- npm ou yarn
- Expo GO instalado no dispositivo móvel (iOS ou Android)
- Backend rodando em `http://localhost:8080`

## Instalação

```bash
# Instalar dependências
cd mobile
npm install
```

## Executar

### Desenvolvimento

```bash
# Iniciar o servidor Expo
npm start
```

Isso abrirá o Expo DevTools. Você pode:

1. **Escanear o QR Code** com o Expo GO no seu dispositivo móvel
2. **Pressionar `a`** para abrir no Android Emulator
3. **Pressionar `i`** para abrir no iOS Simulator

### Para Dispositivo Físico

Se estiver testando em um dispositivo físico na mesma rede:

1. Descubra o IP da sua máquina:
   - **Linux/Mac**: `ifconfig` ou `ip addr`
   - **Windows**: `ipconfig`

2. Edite `mobile/src/services/api.ts` e altere:
   ```typescript
   const API_BASE_URL = 'http://SEU_IP:8080/api';
   // Exemplo: const API_BASE_URL = 'http://192.168.1.100:8080/api';
   ```

3. Certifique-se de que o backend está acessível na rede local

## Estrutura do Projeto

```
mobile/
├── app/                    # Expo Router (navegação)
│   ├── (auth)/
│   │   └── login.tsx      # Tela de login
│   ├── (tabs)/
│   │   ├── _layout.tsx    # Layout das tabs
│   │   ├── index.tsx      # Dashboard
│   │   ├── fornecedores.tsx
│   │   ├── requisicoes.tsx
│   │   ├── negociacoes.tsx
│   │   ├── orcamentos.tsx
│   │   ├── pedidos.tsx
│   │   └── relatorios.tsx
│   └── _layout.tsx        # Layout raiz
├── src/
│   ├── components/        # Componentes React Native
│   ├── context/          # Context API (AuthContext)
│   ├── services/         # Serviços de API
│   ├── styles/           # Tema e estilos
│   └── utils/            # Utilitários
├── app.json
├── package.json
└── tsconfig.json
```

## Funcionalidades

- ✅ Autenticação JWT
- ✅ Dashboard com gráficos e estatísticas
- ✅ Gerenciamento de Fornecedores (CRUD)
- ✅ Requisições de Compra
- ✅ Negociações
- ✅ Orçamentos e Cotações
- ✅ Pedidos com Rastreamento
- ✅ Relatórios e Indicadores
- ✅ Pull-to-refresh em todas as telas
- ✅ Design idêntico ao frontend web

## Credenciais de Login

- **Admin**: `admin` / `admin123`
- **User**: `user` / `user123`

## Configuração da API

A URL da API está configurada em `src/services/api.ts`:

```typescript
const API_BASE_URL = 'http://localhost:8080/api';
```

Para dispositivo físico, use o IP da máquina ao invés de `localhost`.

## Navegação

O app utiliza navegação por tabs na parte inferior com 7 seções:

1. **Dashboard** - Visão geral e gráficos
2. **Fornecedores** - Gestão de fornecedores
3. **Requisições** - Requisições de compra
4. **Negociações** - Histórico de negociações
5. **Orçamentos** - Orçamentos e cotações
6. **Pedidos** - Acompanhamento de pedidos
7. **Relatórios** - Relatórios e indicadores

## Notas Importantes

- ⚠️ **Sempre execute o backend primeiro** - O app mobile depende dele
- Para testar em dispositivo físico, certifique-se de que o backend está acessível na rede local
- O app utiliza os mesmos endpoints da API do frontend web
- AsyncStorage é usado para armazenar o token JWT e dados do usuário

## Troubleshooting

### Erro de conexão com a API

- Verifique se o backend está rodando
- Para dispositivo físico, use o IP da máquina ao invés de localhost
- Verifique se o dispositivo está na mesma rede

### Erro ao instalar dependências

- Limpe o cache: `npm cache clean --force`
- Delete `node_modules` e `package-lock.json` e reinstale

### App não atualiza

- Feche e reabra o Expo GO
- Limpe o cache do Expo: `expo start -c`

