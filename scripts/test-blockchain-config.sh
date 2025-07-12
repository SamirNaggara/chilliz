#!/bin/bash

echo "🔍 Test de configuration blockchain..."

# Vérifier si la clé privée est configurée
if grep -q "BLOCKCHAIN_PRIVATE_KEY" .env.local; then
    echo "✅ Clé privée configurée"
else
    echo "❌ Clé privée manquante dans .env.local"
    exit 1
fi

# Test de connexion au réseau Chiliz
echo "🌐 Test de connexion au réseau Chiliz..."

node -e "
const { ethers } = require('ethers');

async function testConnection() {
    try {
        const provider = new ethers.JsonRpcProvider('https://spicy-rpc.chiliz.com');
        
        // Test de connexion
        const network = await provider.getNetwork();
        console.log('✅ Réseau connecté:', network.name, 'Chain ID:', network.chainId.toString());
        
        // Test du block actuel
        const blockNumber = await provider.getBlockNumber();
        console.log('✅ Block actuel:', blockNumber);
        
        // Test de la clé privée
        const privateKey = process.env.BLOCKCHAIN_PRIVATE_KEY;
        if (privateKey) {
            const wallet = new ethers.Wallet(privateKey, provider);
            console.log('✅ Wallet configuré:', wallet.address);
            
            // Vérifier le solde
            const balance = await provider.getBalance(wallet.address);
            const balanceEth = ethers.formatEther(balance);
            console.log('💰 Solde CHZ:', balanceEth);
            
            if (parseFloat(balanceEth) === 0) {
                console.log('⚠️ Solde vide. Obtenez des CHZ de test:');
                console.log('🔗 https://spicy-faucet.chiliz.com/');
                console.log('📝 Adresse:', wallet.address);
            } else {
                console.log('✅ Prêt pour les transactions!');
            }
        }
        
    } catch (error) {
        console.error('❌ Erreur:', error.message);
    }
}

testConnection();
"

echo ""
echo "🚀 Configuration terminée !"
echo "📝 Pour obtenir des CHZ de test:"
echo "   1. Allez sur https://spicy-faucet.chiliz.com/"
echo "   2. Entrez votre adresse de test"
echo "   3. Récupérez des CHZ gratuits"
echo ""
echo "🔗 Une fois les CHZ reçus, vos participations créeront de vraies transactions !"
