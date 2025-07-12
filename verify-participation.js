const { ethers } = require('ethers');

// Script pour vérifier une participation blockchain
async function verifyParticipation(transactionHash) {
    console.log('🔍 Vérification de la participation...');
    console.log('📋 Hash:', transactionHash);
    
    try {
        const provider = new ethers.JsonRpcProvider('https://spicy-rpc.chiliz.com');
        
        // 1. Récupérer la transaction
        const tx = await provider.getTransaction(transactionHash);
        
        if (!tx) {
            console.log('❌ Transaction non trouvée');
            return null;
        }
        
        console.log('✅ Transaction trouvée!');
        console.log('📦 Block:', tx.blockNumber);
        console.log('👤 From:', tx.from);
        console.log('📅 Timestamp:', new Date().toISOString());
        
        // 2. Décoder les données de participation
        if (tx.data && tx.data !== '0x') {
            try {
                const decodedData = ethers.toUtf8String(tx.data);
                const participationData = JSON.parse(decodedData);
                
                console.log('📄 DONNÉES DE PARTICIPATION:');
                console.log('   Type:', participationData.type);
                console.log('   Contest:', participationData.contestId);
                console.log('   Participant:', participationData.participantAddress);
                console.log('   Jersey:', participationData.jerseyId);
                console.log('   Username:', participationData.username);
                console.log('   Timestamp:', new Date(participationData.timestamp * 1000).toISOString());
                console.log('   Platform:', participationData.platform);
                
                return participationData;
                
            } catch (e) {
                console.log('⚠️ Impossible de décoder les données');
                return null;
            }
        } else {
            console.log('⚠️ Pas de données dans cette transaction');
            return null;
        }
        
    } catch (error) {
        console.error('❌ Erreur:', error.message);
        return null;
    }
}

// Test avec notre transaction
const testHash = '0xc343067a2e0fb442dbb432523e978ece526c4a6938a3656fc867b34df477f6a9';
verifyParticipation(testHash);
