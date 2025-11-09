#!/bin/bash

echo "=========================================="
echo "SupplyFlow Backend - Node.js/TypeScript"
echo "=========================================="

cd "$(dirname "$0")/backend"

echo "1. Verificando dependências..."
if [ ! -d "node_modules" ]; then
    echo "   Instalando dependências..."
    npm install
    if [ $? -ne 0 ]; then
        echo "   ❌ Erro ao instalar dependências"
        exit 1
    fi
    echo "   ✅ Dependências instaladas"
else
    echo "   ✅ Dependências já instaladas"
fi

echo ""
echo "2. Verificando se o banco de dados existe..."
if [ ! -f "supplyflow.db" ]; then
    echo "   ⚠️  Banco de dados não encontrado"
    echo "   Será criado automaticamente na primeira execução"
else
    echo "   ✅ Banco de dados encontrado"
fi

echo ""
echo "3. Iniciando servidor backend..."
echo "   Backend estará disponível em: http://localhost:8080"
echo "   API estará disponível em: http://localhost:8080/api"
echo "   (Pressione Ctrl+C para parar)"
echo ""

npm run dev

