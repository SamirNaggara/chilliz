const { ethers } = require('ethers');

// Configuration directe
const PRIVATE_KEY = '0x5a0824f928cd3cc76cd07f92c92dc24d5a7eb1de1dc6321ab79a565f2679250d';
const RPC_URL = 'https://spicy-rpc.chiliz.com';

async function testBlockchain() {
    console.log('🧪 Test blockchain Chiliz...');
    
    try {
        // 1. Connexion au réseau
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
        
        console.log('🔑 Adresse:', wallet.address);
        
        // 2. Vérifier le solde
        const balance = await provider.getBalance(wallet.address);
        const balanceChz = ethers.formatEther(balance);
        console.log('💰 Solde CHZ:', balanceChz);
        
        if (parseFloat(balanceChz) === 0) {
            console.log('❌ Pas de CHZ! Allez sur https://spicy-faucet.chiliz.com/');
            console.log('📝 Adresse à financer:', wallet.address);
            return;
        }
        
        // 3. Créer une participation de test
        const participationData = {
            type: 'LOTTERY_PARTICIPATION',
            contestId: 'test-contest-123',
            participantAddress: '0x1234567890123456789012345678901234567890',
            jerseyId: 'jersey-mbappe-2024',
            username: 'TestUser',
            timestamp: Math.floor(Date.now() / 1000),
            platform: 'FanScan-Test'
        };
        
        console.log('📝 Données participation:', participationData);
        
        // 4. Créer la transaction
        console.log('🚀 Création transaction...');
        
        const tx = await wallet.sendTransaction({
            to: wallet.address, // Transaction à soi-même
            value: 0, // 0 CHZ
            data: ethers.hexlify(ethers.toUtf8Bytes(JSON.stringify(participationData))),
            gasLimit: 50000
        });
        
        console.log('✅ Transaction créée!');
        console.log('📋 Hash:', tx.hash);
        console.log('🌐 Explorer:', `https://spicy-explorer.chiliz.com/tx/${tx.hash}`);
        
        // 5. Attendre la confirmation
        console.log('⏳ Attente confirmation...');
        const receipt = await tx.wait();
        
        console.log('✅ Transaction confirmée!');
        console.log('📦 Block:', receipt.blockNumber);
        console.log('⛽ Gas utilisé:', receipt.gasUsed.toString());
        
        // 6. Vérifier qu'on peut récupérer la transaction
        console.log('🔍 Vérification...');
        const retrievedTx = await provider.getTransaction(tx.hash);
        
        if (retrievedTx) {
            console.log('✅ Transaction trouvée sur la blockchain!');
            
            // Décoder les données
            if (retrievedTx.data && retrievedTx.data !== '0x') {
                try {
                    const decodedData = ethers.toUtf8String(retrievedTx.data);
                    const parsedData = JSON.parse(decodedData);
                    console.log('📄 Données décodées:', parsedData);
                } catch (e) {
                    console.log('⚠️ Données non décodables (normal pour certaines transactions)');
                }
            }
        } else {
            console.log('❌ Transaction non trouvée');
        }
        
        console.log('');
        console.log('🎉 TEST RÉUSSI!');
        console.log('🔗 Votre lien explorateur devrait maintenant fonctionner:');
        console.log(`   ${`https://spicy-explorer.chiliz.com/tx/${tx.hash}`}`);
        
    } catch (error) {
        console.error('❌ Erreur:', error.message);
        
        if (error.message.includes('insufficient funds')) {
            console.log('💡 Solution: Obtenez des CHZ sur https://spicy-faucet.chiliz.com/');
        }
    }
}

testBlockchain();
