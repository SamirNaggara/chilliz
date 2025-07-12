// Test API de participation
async function testParticipationAPI() {
    console.log('🧪 Test API de participation...');
    
    try {
        const participationData = {
            contestId: 'test-contest-123',
            jerseyId: 'jersey-mbappe-2024',
            walletAddress: '0x1234567890123456789012345678901234567890',
            username: 'TestUserAPI'
        };
        
        console.log('📤 Envoi vers API:', participationData);
        
        const response = await fetch('http://localhost:3000/api/contests/participate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(participationData)
        });
        
        const result = await response.json();
        
        console.log('📋 Réponse API:');
        console.log('   Status:', response.status);
        console.log('   Success:', result.success);
        console.log('   Data:', result.data);
        console.log('   Error:', result.error);
        
        if (result.success && result.data?.blockchainTx) {
            console.log('✅ PARTICIPATION API RÉUSSIE!');
            console.log('🌐 Hash blockchain:', result.data.blockchainTx);
            console.log('🌐 Explorer:', `https://spicy-explorer.chiliz.com/tx/${result.data.blockchainTx}`);
            
            // Test du lien explorer
            console.log('🔍 Test du lien explorer...');
            const explorerResponse = await fetch(`https://spicy-explorer.chiliz.com/tx/${result.data.blockchainTx}`);
            console.log('🌐 Explorer status:', explorerResponse.status);
            
        } else {
            console.log('❌ PARTICIPATION API ÉCHOUÉE');
            if (result.error) {
                console.log('💥 Erreur:', result.error);
            }
        }
        
    } catch (error) {
        console.error('❌ Erreur test API:', error.message);
    }
}

testParticipationAPI();
