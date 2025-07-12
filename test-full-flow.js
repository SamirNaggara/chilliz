// Créer un concours de test
async function createTestContest() {
    console.log('🎯 Création d\'un concours de test...');
    
    try {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setHours(endDate.getHours() + 1); // Concours d'1h
        
        const contestData = {
            name: 'Test Concours Blockchain',
            description: 'Concours de test pour vérifier l\'intégration blockchain',
            startTime: startDate.toISOString(),
            endTime: endDate.toISOString(),
            firstPrize: 'Maillot PSG dédicacé',
            secondPrize: 'Écharpe PSG',
            thirdPrize: 'Badge PSG',
            maxWinners: 3
        };
        
        console.log('📤 Création concours:', contestData);
        
        const response = await fetch('http://localhost:3000/api/contests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(contestData)
        });
        
        const result = await response.json();
        
        console.log('📋 Réponse création:');
        console.log('   Status:', response.status);
        console.log('   Message:', result.message);
        console.log('   Contest ID:', result.contest?.id);
        
        if (response.status === 201 && result.contest) {
            console.log('✅ CONCOURS CRÉÉ!');
            console.log('🆔 ID:', result.contest.id);
            
            // Maintenant tester la participation
            console.log('');
            console.log('🧪 Test de participation...');
            
            const participationData = {
                contestId: result.contest.id,
                jerseyId: 'jersey-mbappe-2024',
                walletAddress: '0x1234567890123456789012345678901234567890',
                username: 'TestUserAPI'
            };
            
            console.log('📤 Envoi participation:', participationData);
            
            const participationResponse = await fetch('http://localhost:3000/api/contests/participate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(participationData)
            });
            
            const participationResult = await participationResponse.json();
            
            console.log('📋 Réponse participation:');
            console.log('   Status:', participationResponse.status);
            console.log('   Message:', participationResult.message);
            console.log('   Error:', participationResult.error);
            console.log('   BlockchainTx:', participationResult.blockchainTx);
            
            if (participationResponse.status === 201 && participationResult.blockchainTx) {
                console.log('✅ PARTICIPATION RÉUSSIE!');
                console.log('🌐 Hash blockchain:', participationResult.blockchainTx);
                console.log('🌐 Explorer:', participationResult.explorerUrl);
                
                console.log('');
                console.log('🎉 TOUT FONCTIONNE!');
                console.log('🔗 Vérifiez le concours sur: http://localhost:3000/admin/contests/' + result.contest.id);
                
            } else {
                console.log('❌ PARTICIPATION ÉCHOUÉE:', participationResult.error);
            }
            
        } else {
            console.log('❌ CRÉATION CONCOURS ÉCHOUÉE:', result.error || result.message);
        }
        
    } catch (error) {
        console.error('❌ Erreur:', error.message);
    }
}

createTestContest();
