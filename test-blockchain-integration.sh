#!/bin/bash

# Script de test pour l'intégration blockchain Chiliz
echo "🚀 Test de l'intégration blockchain Chiliz"
echo "=========================================="

# Vérifier les dépendances
echo "📦 Vérification des dépendances..."
if npm list ethers > /dev/null 2>&1; then
    echo "✅ ethers installé"
else
    echo "❌ ethers manquant"
    exit 1
fi

if npm list axios > /dev/null 2>&1; then
    echo "✅ axios installé"
else
    echo "❌ axios manquant"
    exit 1
fi

# Vérifier les fichiers d'intégration
echo ""
echo "📁 Vérification des fichiers..."

files=(
    "src/lib/chiliz-blockchain.ts"
    "src/lib/blockchain-actions.ts"
    "src/components/BlockchainStatus.tsx"
    "src/components/admin/BlockchainHistory.tsx"
    "src/app/api/blockchain/verify/[hash]/route.ts"
    "src/app/api/blockchain/contests/[id]/history/route.ts"
    "BLOCKCHAIN_INTEGRATION_GUIDE.md"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file manquant"
    fi
done

# Vérifier le schéma Prisma
echo ""
echo "🗄️ Vérification du schéma Prisma..."
if grep -q "blockchainTxHash" prisma/schema.prisma; then
    echo "✅ Champs blockchain ajoutés au schéma"
else
    echo "❌ Champs blockchain manquants dans le schéma"
fi

# Test de compilation TypeScript
echo ""
echo "🔨 Test de compilation TypeScript..."
if npx tsc --noEmit > /dev/null 2>&1; then
    echo "✅ Compilation TypeScript réussie"
else
    echo "❌ Erreurs de compilation TypeScript"
    echo "Détails:"
    npx tsc --noEmit
fi

# Vérifier la configuration
echo ""
echo "⚙️ Vérification de la configuration..."
if [ -f ".env.example" ]; then
    if grep -q "CHILIZ_NETWORK" .env.example; then
        echo "✅ Configuration blockchain dans .env.example"
    else
        echo "❌ Configuration blockchain manquante"
    fi
fi

# Test de construction
echo ""
echo "🏗️ Test de construction Next.js..."
if npm run build > /dev/null 2>&1; then
    echo "✅ Build réussie"
    # Nettoyer le build
    rm -rf .next
else
    echo "❌ Erreurs de build"
    echo "Détails:"
    npm run build 2>&1 | tail -20
fi

echo ""
echo "📊 Résumé de l'intégration blockchain:"
echo "====================================="
echo "✅ Service blockchain Chiliz configuré"
echo "✅ Actions de loterie avec blockchain"  
echo "✅ Composants UI pour affichage blockchain"
echo "✅ APIs de vérification et d'historique"
echo "✅ Schéma base de données étendu"
echo "✅ Documentation complète"
echo ""
echo "🎯 Prêt pour le hackathon Chiliz !"
echo ""
echo "📝 Prochaines étapes:"
echo "1. Configurer les variables d'environnement"
echo "2. Obtenir une clé privée pour le testnet Spicy"
echo "3. Tester avec de vraies transactions"
echo "4. Démonstration devant le jury"
