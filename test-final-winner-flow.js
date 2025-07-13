#!/usr/bin/env node

console.log("🧪 Test du flux complet de sélection des gagnants avec blockchain");
console.log("=" + "=".repeat(60));

async function testWinnerFlow() {
  try {
    console.log("\n1. 🔍 Recherche d'un concours FINISHED avec des participants...");
    
    // Test de l'API winners avec curl pour voir la réponse complète
    const testContestId = "cmd1cor4400007k2skgq51l3q"; // ID du concours de test
    
    console.log(`\n2. 🏆 Test de sélection des gagnants pour le concours ${testContestId}...`);
    
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

    const { spawn } = require('child_process');
    
    console.log("📋 Données envoyées:", JSON.stringify(winnersData, null, 2));
    
    const curlProcess = spawn('curl', [
      '-X', 'POST',
      `http://localhost:3000/api/contests/${testContestId}/winners`,
      '-H', 'Content-Type: application/json',
      '-d', JSON.stringify(winnersData),
      '-v'
    ]);

    let output = '';
    let errorOutput = '';

    curlProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    curlProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    curlProcess.on('close', (code) => {
      console.log(`\n3. 📡 Réponse HTTP (code: ${code}):`);
      console.log("Headers et infos de connexion:", errorOutput);
      console.log("\n4. 📋 Réponse JSON:");
      console.log(output);
      
      console.log("\n5. 🔗 Test de l'historique blockchain...");
      testBlockchainHistory(testContestId);
    });

  } catch (error) {
    console.error("❌ Erreur:", error);
  }
}

async function testBlockchainHistory(contestId) {
  try {
    const { spawn } = require('child_process');
    
    const curlProcess = spawn('curl', [
      `http://localhost:3000/api/blockchain/contests/${contestId}/history`,
      '-H', 'Accept: application/json'
    ]);

    let output = '';

    curlProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    curlProcess.on('close', (code) => {
      console.log(`\n📡 Historique blockchain (code: ${code}):`);
      try {
        const history = JSON.parse(output);
        console.log(`✅ ${history.length} événements trouvés dans l'historique`);
        
        history.forEach((event, index) => {
          console.log(`\n📋 Événement ${index + 1}:`);
          console.log(`   Type: ${event.type}`);
          console.log(`   Hash: ${event.transactionHash}`);
          console.log(`   Date: ${event.timestamp}`);
          if (event.metadata) {
            console.log(`   Métadonnées: ${JSON.stringify(event.metadata)}`);
          }
        });
        
        const winnerEvents = history.filter(e => e.type === 'WINNER_ANNOUNCEMENT');
        console.log(`\n🏆 ${winnerEvents.length} annonce(s) de gagnants trouvée(s)`);
        
      } catch (e) {
        console.log("❌ Erreur parsing JSON:", output);
      }
    });

  } catch (error) {
    console.error("❌ Erreur test historique:", error);
  }
}

console.log("🚀 Démarrage du test...");
testWinnerFlow();
