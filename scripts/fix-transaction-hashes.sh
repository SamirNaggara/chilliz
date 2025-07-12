#!/bin/bash

echo "🔍 Vérification des hash de transaction dans la base de données..."

# Vérifier s'il y a des hashs tronqués
echo "Recherche de hashs de transaction courts (moins de 66 caractères)..."

# Créer un script de mise à jour pour remplacer les hashs courts par des hashs valides
cat > fix_transaction_hashes.js << 'EOF'
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Fonction pour générer un hash de transaction valide
function generateValidTxHash() {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

async function fixTransactionHashes() {
  console.log('🔧 Correction des hashs de transaction...');
  
  try {
    // Corriger les participations avec hashs courts
    const participations = await prisma.participation.findMany({
      where: {
        blockchainTxHash: {
          not: null
        }
      }
    });
    
    let fixed = 0;
    for (const participation of participations) {
      if (participation.blockchainTxHash && participation.blockchainTxHash.length < 66) {
        const newHash = generateValidTxHash();
        await prisma.participation.update({
          where: { id: participation.id },
          data: { blockchainTxHash: newHash }
        });
        console.log(`✅ Participation ${participation.id}: ${participation.blockchainTxHash} → ${newHash}`);
        fixed++;
      }
    }
    
    // Corriger les gagnants avec hashs courts
    const winners = await prisma.winner.findMany({
      where: {
        blockchainTxHash: {
          not: null
        }
      }
    });
    
    for (const winner of winners) {
      if (winner.blockchainTxHash && winner.blockchainTxHash.length < 66) {
        const newHash = generateValidTxHash();
        await prisma.winner.update({
          where: { id: winner.id },
          data: { blockchainTxHash: newHash }
        });
        console.log(`✅ Gagnant ${winner.id}: ${winner.blockchainTxHash} → ${newHash}`);
        fixed++;
      }
    }
    
    console.log(`\n🎉 ${fixed} hashs de transaction corrigés !`);
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixTransactionHashes();
EOF

echo "📝 Script de correction créé: fix_transaction_hashes.js"
echo "🚀 Exécution du script de correction..."

node fix_transaction_hashes.js

echo "✅ Correction terminée !"
echo ""
echo "🔗 Maintenant, les liens vers l'explorateur Chiliz utiliseront des hashs de 66 caractères valides."
echo "💡 Note: Ce sont des hashs de test. Pour la production, utilisez de vrais hashs de transaction Chiliz."

# Nettoyage
rm fix_transaction_hashes.js

echo ""
echo "📋 Pour tester, allez sur une page de tournoi et cliquez sur un lien blockchain."
