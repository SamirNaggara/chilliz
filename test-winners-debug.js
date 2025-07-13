// Test debug de la sélection des gagnants
const testWinnersSelection = async () => {
  console.log('🧪 Test debug de la sélection des gagnants');
  
  try {
    // 1. D'abord vérifier les concours existants
    console.log('📋 Récupération des concours...');
    const contestsResponse = await fetch('http://localhost:3000/api/contests');
    const contests = await contestsResponse.json();
    
    console.log('Nombre de concours:', contests.length);
    
    // Trouver un concours actif ou le premier concours
    let testContest = contests.find(c => c.status === 'ACTIVE');
    if (!testContest && contests.length > 0) {
      testContest = contests[0];
      console.log('⚠️ Aucun concours actif, utilisation du premier concours:', testContest.id);
      console.log('Statut:', testContest.status);
    }
    
    if (!testContest) {
      console.log('❌ Aucun concours trouvé');
      return;
    }
    
    console.log('✅ Concours de test:', testContest.id, '-', testContest.name);
    
    // 2. Tester l'API de sélection des gagnants
    console.log('🎯 Test de l\'API de sélection des gagnants...');
    
    const winnersData = {
      winners: [
        {
          walletAddress: "0x742d35Cc6cD28E5c0D6c67C8b8D7E8f12Ec4A567",
          prize: "1er Prix - Test"
        },
        {
          walletAddress: "0x8ba1f109551bD432803012645Hac189451c4e155", 
          prize: "2ème Prix - Test"
        }
      ]
    };
    
    console.log('📤 Envoi des données:', winnersData);
    
    const response = await fetch(`http://localhost:3000/api/contests/${testContest.id}/winners`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(winnersData)
    });
    
    console.log('📥 Status de la réponse:', response.status);
    
    const result = await response.json();
    console.log('📋 Réponse complète:', JSON.stringify(result, null, 2));
    
    if (response.ok) {
      console.log('✅ Sélection des gagnants réussie');
      
      // 3. Vérifier l'historique blockchain après sélection
      console.log('🔍 Vérification de l\'historique blockchain...');
      const historyResponse = await fetch(`http://localhost:3000/api/blockchain/contests/${testContest.id}/history`);
      const historyResult = await historyResponse.json();
      
      console.log('📊 Historique après sélection:');
      console.log('- Participations:', historyResult.data?.participations?.length || 0);
      console.log('- Gagnants:', historyResult.data?.winners?.length || 0);
      console.log('- Total événements:', historyResult.data?.totalEvents || 0);
      
      if (historyResult.data?.winners?.length > 0) {
        console.log('🏆 Premier gagnant:');
        console.log(JSON.stringify(historyResult.data.winners[0], null, 2));
      }
      
    } else {
      console.log('❌ Erreur lors de la sélection:', result.error);
    }
    
  } catch (error) {
    console.error('❌ Erreur dans le test:', error);
  }
};

// Exporter la fonction pour pouvoir l'appeler
if (typeof window !== 'undefined') {
  window.testWinnersSelection = testWinnersSelection;
} else {
  testWinnersSelection();
}
