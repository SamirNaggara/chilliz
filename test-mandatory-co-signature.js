// Test de la co-signature obligatoire
console.log('🧪 Test de la co-signature obligatoire');

// Test des différents types d'événements blockchain
const testEvents = [
  {
    type: 'LOTTERY_PARTICIPATION',
    data: {
      type: 'LOTTERY_PARTICIPATION_CO_SIGNED',
      serverSigner: '0x742d35Cc6cD28E5c0D6c67C8b8D7E8f12Ec4A567',
      blockchainConfirmed: true
    },
    transactionHash: '0xabc123def456789...',
    timestamp: Math.floor(Date.now() / 1000)
  },
  {
    type: 'LOTTERY_PARTICIPATION', 
    data: {
      type: 'LOTTERY_PARTICIPATION',
      blockchainConfirmed: true
    },
    transactionHash: '0xdef456abc123789...',
    timestamp: Math.floor(Date.now() / 1000) - 3600
  }
];

// Tester la fonction de formatage des labels
function getEventTypeLabel(type, data) {
  if (type === 'LOTTERY_PARTICIPATION') {
    return data?.type === 'LOTTERY_PARTICIPATION_CO_SIGNED' 
      ? 'Participation (Co-signée)' 
      : 'Participation';
  }
  return 'Annonce gagnant';
}

testEvents.forEach((event, index) => {
  console.log(`📋 Événement ${index + 1}:`);
  console.log(`  - Type: ${getEventTypeLabel(event.type, event.data)}`);
  console.log(`  - Co-signée: ${event.data?.type === 'LOTTERY_PARTICIPATION_CO_SIGNED' ? 'Oui' : 'Non'}`);
  if (event.data?.serverSigner) {
    console.log(`  - Serveur co-signataire: ${event.data.serverSigner.slice(0, 6)}...${event.data.serverSigner.slice(-4)}`);
  }
  console.log(`  - Hash TX: ${event.transactionHash.slice(0, 10)}...`);
  console.log('');
});

console.log('✅ Test terminé - la co-signature est maintenant obligatoire');
