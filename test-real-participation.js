const { ethers } = require('ethers');

// Test de participation complète
async function testRealParticipation() {
    console.log('🧪 Test de participation réelle...');
    
    try {
        // 1. Créer une participation via l'API comme le ferait un utilisateur
        const participationData = {
            contestId: 'test-contest-123',
            jerseyId: 'jersey-mbappe-2024',
            walletAddress: '0x1234567890123456789012345678901234567890',
            username: 'TestUserReal'
        };
        
        console.log('📤 Données participation:', participationData);
        
        // Simuler l'appel API (sans Next.js, on importe directement la fonction)
        const path = require('path');
        const dotenv = require('dotenv');
        
        // Charger les variables d'environnement
        dotenv.config({ path: path.join(__dirname, '.env.local') });
        
        console.log('🔑 Clé privée chargée:', process.env.BLOCKCHAIN_PRIVATE_KEY ? 'OUI' : 'NON');
        
        // Simuler la fonction de participation
        console.log('🚀 Simulation de la participation...');
        
        // Test direct du real-blockchain-logger
        const { realChilizLogger } = require('./src/lib/real-blockchain-logger');
        
        const result = await realChilizLogger.createLotteryParticipation(
            participationData.contestId,
            participationData.walletAddress,
            participationData.jerseyId,
            participationData.username
        );
        
        console.log('📋 Résultat blockchain:');
        console.log('   Success:', result.success);
        console.log('   Hash:', result.transactionHash);
        console.log('   Error:', result.error);
        
        if (result.success) {
            console.log('✅ PARTICIPATION RÉUSSIE!');
            console.log('🌐 Explorer:', `https://spicy-explorer.chiliz.com/tx/${result.transactionHash}`);
            
            // Vérifier la transaction
            console.log('🔍 Vérification immédiate...');
            const provider = new ethers.JsonRpcProvider('https://spicy-rpc.chiliz.com');
            const tx = await provider.getTransaction(result.transactionHash);
            
            if (tx) {
                console.log('✅ Transaction trouvée sur blockchain!');
                console.log('📦 Block:', tx.blockNumber);
                
                // Décoder les données
                if (tx.data && tx.data !== '0x') {
                    try {
                        const decodedData = ethers.toUtf8String(tx.data);
                        const parsedData = JSON.parse(decodedData);
                        console.log('📄 Données stockées:', parsedData);
                    } catch (e) {
                        console.log('⚠️ Données non décodables');
                    }
                }
            } else {
                console.log('❌ Transaction non trouvée (peut-être en attente)');
            }
        } else {
            console.log('❌ PARTICIPATION ÉCHOUÉE:', result.error);
        }
        
    } catch (error) {
        console.error('❌ Erreur test:', error.message);
        console.error('Stack:', error.stack);
    }
}

testRealParticipation();
