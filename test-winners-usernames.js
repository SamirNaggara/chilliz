#!/usr/bin/env node

console.log("🧪 Test des transactions blockchain avec noms d'utilisateur pour les gagnants");
console.log("=" + "=".repeat(70));

async function testWinnersWithUsernames() {
  try {
    console.log("\n1. 🔍 Test de sélection des gagnants avec noms d'utilisateur...");
    
    const testContestId = "cmd1cor4400007k2skgq51l3q";
    
    console.log("\n2. 🎯 Simulation de données de gagnants avec noms:");
    
    const winnersData = {
      winners: [
        {
          walletAddress: "0x1234567890123456789012345678901234567890",
          prize: "1er Prix - Maillot PSG Signé",
          rank: 1
        },
        {
          walletAddress: "0x2345678901234567890123456789012345678901", 
          prize: "2ème Prix - Ballon PSG",
          rank: 2
        },
        {
          walletAddress: "0x3456789012345678901234567890123456789012",
          prize: "3ème Prix - Casquette PSG",
          rank: 3
        }
      ]
    };

    console.log("📋 Données gagnants:", JSON.stringify(winnersData, null, 2));
    console.log("\n3. 📡 Envoi vers l'API winners...");

    const { spawn } = require('child_process');
    
    const curlProcess = spawn('curl', [
      '-X', 'POST',
      `http://localhost:3000/api/contests/${testContestId}/winners`,
      '-H', 'Content-Type: application/json',
      '-d', JSON.stringify(winnersData),
      '-s' // Silent mode pour cleaner output
    ]);

    let output = '';

    curlProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    curlProcess.on('close', (code) => {
      console.log(`\n4. 📋 Réponse API (code ${code}):`);
      try {
        const response = JSON.parse(output);
        console.log(JSON.stringify(response, null, 2));
        
        if (response.success && response.blockchainEvents) {
          console.log(`\n✅ ${response.blockchainEvents.length} transaction(s) blockchain créée(s)`);
          
          // Tester l'historique pour voir les noms
          setTimeout(() => testHistoryWithUsernames(testContestId), 2000);
        } else {
          console.log("❌ Erreur lors de la création des gagnants");
        }
      } catch (e) {
        console.log("❌ Erreur parsing réponse:", output);
      }
    });

  } catch (error) {
    console.error("❌ Erreur:", error);
  }
}

async function testHistoryWithUsernames(contestId) {
  console.log("\n5. 🔍 Test de l'historique blockchain avec noms d'utilisateur...");
  
  const { spawn } = require('child_process');
  
  const curlProcess = spawn('curl', [
    `http://localhost:3000/api/blockchain/contests/${contestId}/history`,
    '-s'
  ]);

  let output = '';

  curlProcess.stdout.on('data', (data) => {
    output += data.toString();
  });

  curlProcess.on('close', (code) => {
    console.log(`\n6. 📋 Historique blockchain (code ${code}):`);
    try {
      const history = JSON.parse(output);
      
      if (history.success && history.data) {
        const { participations, winners, totalEvents } = history.data;
        console.log(`📊 ${totalEvents} événements au total`);
        console.log(`👥 ${participations.length} participations`);
        console.log(`🏆 ${winners.length} annonces de gagnants`);
        
        console.log("\n7. 🏆 Détails des annonces de gagnants avec noms:");
        winners.forEach((winner, index) => {
          console.log(`\n   Gagnant ${index + 1}:`);
          console.log(`   🆔 Type: ${winner.type}`);
          console.log(`   💰 Wallet: ${winner.walletAddress}`);
          console.log(`   🎁 Prix: ${winner.data?.prize || 'Non spécifié'}`);
          console.log(`   👤 Nom: ${winner.data?.username || 'Non disponible'}`);
          console.log(`   🔗 TX: ${winner.transactionHash || 'Non disponible'}`);
          console.log(`   📅 Date: ${new Date(winner.timestamp * 1000).toLocaleString()}`);
          
          if (winner.data?.blockchainData) {
            console.log(`   🔍 Données blockchain:`);
            console.log(`      📝 Username dans blockchain: ${winner.data.blockchainData.username || 'NON TROUVÉ'}`);
          }
        });
        
        if (winners.length === 0) {
          console.log("   ⚠️ Aucune annonce de gagnant trouvée dans l'historique");
        }
        
      } else {
        console.log("❌ Erreur récupération historique:", history);
      }
    } catch (e) {
      console.log("❌ Erreur parsing historique:", output);
    }
  });
}

async function testDirectBlockchainData() {
  console.log("\n8. 🔬 Test direct des données blockchain...");
  
  // Simuler inspection d'une transaction réelle
  const testTxHash = "0x1234567890abcdef1234567890abcdef12345678"; // Example hash
  
  console.log(`   🔍 Inspection transaction: ${testTxHash}`);
  console.log("   📋 Données attendues dans la blockchain:");
  console.log(`   {`);
  console.log(`     "type": "WINNER_ANNOUNCEMENT",`);
  console.log(`     "contestId": "cmd1cor4400007k2skgq51l3q",`);
  console.log(`     "winnerAddress": "0x1234...7890",`);
  console.log(`     "prize": "1er Prix - Maillot PSG Signé",`);
  console.log(`     "rank": 1,`);
  console.log(`     "username": "NOM_DU_GAGNANT", // 🆕 Maintenant inclus!`);
  console.log(`     "timestamp": ${Math.floor(Date.now() / 1000)},`);
  console.log(`     "network": "chiliz-spicy-testnet"`);
  console.log(`   }`);
}

console.log("🚀 Démarrage du test complet...");
testWinnersWithUsernames();

// Test des données blockchain après 5 secondes
setTimeout(testDirectBlockchainData, 5000);
