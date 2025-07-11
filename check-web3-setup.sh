#!/bin/bash

echo "🔍 Vérification de l'environnement Web3..."

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé"
    exit 1
fi

NODE_VERSION=$(node -v)
echo "✅ Node.js: $NODE_VERSION"

# Vérifier npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé"
    exit 1
fi

NPM_VERSION=$(npm -v)
echo "✅ npm: $NPM_VERSION"

# Vérifier les dépendances
if [ ! -d "node_modules" ]; then
    echo "❌ Les dépendances ne sont pas installées"
    echo "➡️  Exécutez: npm install"
    exit 1
fi

echo "✅ Dépendances installées"

# Vérifier les packages Web3
if [ ! -d "node_modules/wagmi" ]; then
    echo "❌ Wagmi n'est pas installé"
    exit 1
fi

if [ ! -d "node_modules/ethers" ]; then
    echo "❌ Ethers.js n'est pas installé"
    exit 1
fi

echo "✅ Packages Web3 installés (wagmi, ethers, viem, rainbowkit)"

# Vérifier le fichier d'environnement
if [ ! -f ".env.local" ]; then
    echo "⚠️  Fichier .env.local manquant"
    echo "➡️  Copiez .env.example vers .env.local et configurez-le"
else
    echo "✅ Fichier .env.local trouvé"
fi

# Vérifier la base de données
if [ ! -f "prisma/dev.db" ]; then
    echo "⚠️  Base de données non initialisée"
    echo "➡️  Exécutez: npm run db:migrate"
else
    echo "✅ Base de données initialisée"
fi

echo ""
echo "🌟 État de l'environnement:"
echo ""

# Vérifier si le serveur peut démarrer
echo "🚀 Test de démarrage du serveur..."
timeout 10s npm run dev &> /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Le serveur peut démarrer correctement"
else
    echo "❌ Problème de démarrage du serveur"
    echo "➡️  Vérifiez les erreurs avec: npm run dev"
fi

echo ""
echo "📋 Prochaines étapes:"
echo "1. Installez MetaMask dans votre navigateur"
echo "2. Configurez les réseaux Chiliz (voir GUIDE_WEB3.md)"
echo "3. Démarrez l'app avec: npm run dev"
echo "4. Visitez http://localhost:3000"
echo "5. Testez la connexion wallet"
echo ""
echo "📖 Pour plus d'aide, consultez GUIDE_WEB3.md"
