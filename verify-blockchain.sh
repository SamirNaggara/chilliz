#!/bin/bash

# Script pour tester et vérifier les données blockchain
echo "🔍 TEST DE VÉRIFICATION BLOCKCHAIN CHILIZ"
echo "=========================================="

# Fonction pour tester une transaction
test_transaction() {
    local tx_hash="$1"
    echo ""
    echo "🔎 Test de vérification pour TX: $tx_hash"
    echo "──────────────────────────────────────────────────────"
    
    # Appeler l'API d'inspection
    curl -s "http://localhost:3000/api/blockchain/inspect/$tx_hash" | jq '.'
    
    # URL direct explorateur
    echo ""
    echo "🌐 Vérification publique:"
    echo "   https://spicy-explorer.chiliz.com/tx/$tx_hash"
}

# Exemples de hash de transactions (à remplacer par de vrais hash)
echo ""
echo "📋 EXEMPLES DE VÉRIFICATION:"
echo ""

# Hash de participation (exemple)
echo "1️⃣ PARTICIPATION À LA LOTERIE:"
test_transaction "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"

echo ""
echo "2️⃣ ANNONCE DE GAGNANT:"
test_transaction "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"

echo ""
echo "💡 COMMENT UTILISER:"
echo "──────────────────────────────────────────────────────"
echo "1. Participez à un concours via l'interface"
echo "2. Notez le hash de transaction affiché"
echo "3. Utilisez ce script: ./verify-blockchain.sh <HASH>"
echo "4. Ouvrez le lien explorateur pour vérification publique"

echo ""
echo "🔗 LIENS UTILES:"
echo "──────────────────────────────────────────────────────"
echo "Explorateur Spicy: https://spicy-explorer.chiliz.com"
echo "RPC Endpoint: https://spicy-rpc.chiliz.com"
echo "Network ID: 88882"

echo ""
echo "✅ Toutes les données de loterie sont publiquement vérifiables !"
