// Test pour vérifier que l'historique blockchain utilise les vraies données
const testFixedBlockchainHistory = async () => {
  console.log('🧪 Test de l\'historique blockchain fixé');
  
  try {
    // Tester avec un concours réel (remplacez l'ID par un vrai)
    const response = await fetch('/api/blockchain/contests/cltl4xpvk0000ml01x8q8x8q8/history');
    const result = await response.json();
    
    console.log('📊 Réponse API:', result);
    
    if (result.success && result.data.totalEvents > 0) {
      console.log('✅ Événements trouvés:', result.data.totalEvents);
      
      // Vérifier les participations
      if (result.data.participations.length > 0) {
        const firstParticipation = result.data.participations[0];
        console.log('📝 Première participation:');
        console.log('  - Hash TX:', firstParticipation.transactionHash);
        console.log('  - Confirmé:', firstParticipation.data.blockchainConfirmed);
        console.log('  - Timestamp blockchain:', firstParticipation.timestamp);
      }
      
      // Vérifier les gagnants
      if (result.data.winners.length > 0) {
        const firstWinner = result.data.winners[0];
        console.log('🏆 Premier gagnant:');
        console.log('  - Hash TX:', firstWinner.transactionHash);
        console.log('  - Confirmé:', firstWinner.data.blockchainConfirmed);
        console.log('  - Prix:', firstWinner.data.prize);
      }
    } else {
      console.log('❌ Aucun événement trouvé ou erreur');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
};

// Exécuter le test
testFixedBlockchainHistory();
