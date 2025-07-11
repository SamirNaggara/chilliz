#!/bin/bash

# Script pour créer la Pull Request
echo "🚀 Création de la Pull Request MetaMask Integration..."

# URL pour créer la PR sur GitHub
REPO_URL="https://github.com/SamirNaggara/chilliz"
PR_URL="${REPO_URL}/compare/main...Axel?quick_pull=1"

echo ""
echo "📋 Informations de la PR :"
echo "   Source: Axel"
echo "   Target: main"
echo "   Titre: 🦊 Intégration Complète Connexion MetaMask - Pages Scan & Jersey"
echo ""
echo "📁 Fichiers modifiés :"
echo "   ✅ src/app/jersey/[id]/page.tsx"
echo "   ✅ src/app/scan/page.tsx" 
echo "   ✅ src/app/api/scan/route.ts"
echo "   ✅ src/app/test-wallet/page.tsx"
echo "   ✅ src/components/CreateScanForm.tsx"
echo "   ✅ src/components/JerseyWalletConnector.tsx"
echo "   ✅ src/components/WalletPriceDisplay.tsx"
echo "   ✅ src/lib/web3.ts"
echo "   📄 Documentation complète incluse"
echo ""
echo "🔗 URL pour créer la PR :"
echo "   ${PR_URL}"
echo ""
echo "📝 Description automatique générée dans PR_DESCRIPTION.md"
echo ""
echo "✨ Prêt pour review et merge !"
