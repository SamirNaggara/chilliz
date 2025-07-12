// Test participation avec un autre utilisateur
async function testSecondParticipation() {
    console.log('🧪 Test seconde participation...');
    
    try {
        const participationData = {
            contestId: 'cmd08y1kq00067kz50yivsccy', // ID du concours créé
            jerseyId: 'jersey-messi-2024',
            walletAddress: '0x9876543210987654321098765432109876543210',
            username: 'TestUser2'
        };
        
        console.log('📤 Envoi participation:', participationData);
        
        const response = await fetch('http://localhost:3000/api/contests/participate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(participationData)
        });
        
        const result = await response.json();
        
        console.log('📋 Réponse participation:');
        console.log('   Status:', response.status);
        console.log('   Message:', result.message);
        console.log('   Error:', result.error);
        console.log('   BlockchainTx:', result.blockchainTx);
        
        if (response.status === 201 && result.blockchainTx) {
            console.log('✅ SECONDE PARTICIPATION RÉUSSIE!');
            console.log('🌐 Hash blockchain:', result.blockchainTx);
            console.log('🌐 Explorer:', result.explorerUrl);
            console.log('');
            console.log('🔗 Vérifiez les participations sur: http://localhost:3000/admin/contests/cmd08y1kq00067kz50yivsccy');
        } else {
            console.log('❌ PARTICIPATION ÉCHOUÉE:', result.error);
        }
        
    } catch (error) {
        console.error('❌ Erreur:', error.message);
    }
}

testSecondParticipation();
