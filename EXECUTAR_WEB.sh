#!/bin/bash

echo "=========================================="
echo "SupplyFlow Web - React/Vite"
echo "=========================================="

cd "$(dirname "$0")/web"

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
echo "2. IMPORTANTE: Certifique-se de que o backend está rodando!"
echo "   Backend deve estar em: http://localhost:8080"
echo ""

read -p "Pressione Enter para continuar..."

echo ""
echo "3. Iniciando servidor de desenvolvimento..."
echo "   Frontend estará disponível em: http://localhost:5173"
echo "   (Pressione Ctrl+C para parar)"
echo ""
npm run dev


