// Script pour créer un concours de test actif
const createTestContest = async () => {
  console.log('🏗️ Création d\'un concours de test actif...');
  
  try {
    const contestData = {
      name: "Concours Test Gagnants",
      description: "Concours pour tester la sélection des gagnants sur blockchain",
      firstPrize: "1000 CHZ + Maillot Collector",
      secondPrize: "500 CHZ + Maillot",
      thirdPrize: "250 CHZ",
      maxWinners: 3,
      status: "ACTIVE"
    };
    
    console.log('📤 Données du concours:', contestData);
    
    const response = await fetch('http://localhost:3000/api/admin/contests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(contestData)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Concours créé avec succès!');
      console.log('ID:', result.id);
      console.log('Nom:', result.name);
      console.log('Statut:', result.status);
      return result.id;
    } else {
      const error = await response.json();
      console.log('❌ Erreur lors de la création:', error);
      return null;
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error);
    return null;
  }
};

// Exporter la fonction
if (typeof window !== 'undefined') {
  window.createTestContest = createTestContest;
} else {
  createTestContest();
}
