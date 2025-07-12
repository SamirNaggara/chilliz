// Outil de vérification blockchain pour les loteries
import { chilizBlockchain, blockchainUtils, type BlockchainEvent } from './chiliz-blockchain';

// Fonction pour vérifier et afficher les données blockchain d'une transaction
async function inspectLotteryTransaction(transactionHash: string) {
  console.log('🔍 Inspection de la transaction:', transactionHash);
  
  try {
    // 1. Vérifier la transaction via notre service
    const verification = await chilizBlockchain.verifyEvent(transactionHash);
    
    if (!verification) {
      console.log('❌ Transaction non trouvée');
      return null;
    }

    console.log('✅ Transaction trouvée !');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // 2. Afficher les informations de base
    console.log('📊 INFORMATIONS TRANSACTION:');
    console.log(`   Hash: ${verification.hash}`);
    console.log(`   Block: #${verification.blockNumber}`);
    console.log(`   Status: ${verification.status === 1 ? '✅ Succès' : '❌ Échec'}`);
    console.log(`   From: ${verification.from}`);
    console.log(`   To: ${verification.to}`);
    console.log(`   Timestamp: ${blockchainUtils.formatTimestamp(verification.timestamp)}`);
    
    // 3. Décoder et afficher les données de loterie
    if (verification.data) {
      console.log('');
      console.log('🎲 DONNÉES DE LOTERIE DÉCODÉES:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      const lotteryData = verification.data;
      
      console.log(`   Type: ${lotteryData.type}`);
      console.log(`   Contest ID: ${lotteryData.contestId}`);
      
      if (lotteryData.type === 'LOTTERY_PARTICIPATION') {
        console.log(`   👤 Participant: ${lotteryData.participantAddress}`);
        console.log(`   👕 Jersey ID: ${lotteryData.jerseyId}`);
        console.log(`   📝 Username: ${lotteryData.username || 'Non spécifié'}`);
        console.log(`   ⏰ Participation: ${blockchainUtils.formatTimestamp(lotteryData.timestamp)}`);
      } else if (lotteryData.type === 'WINNER_ANNOUNCEMENT') {
        console.log(`   🏆 Gagnant: ${lotteryData.winnerAddress}`);
        console.log(`   🎁 Prix: ${lotteryData.prize}`);
        console.log(`   🥇 Rang: ${lotteryData.rank}`);
        console.log(`   ⏰ Annonce: ${blockchainUtils.formatTimestamp(lotteryData.timestamp)}`);
      }
      
      console.log('');
      console.log('📋 DONNÉES JSON COMPLÈTES:');
      console.log(JSON.stringify(lotteryData, null, 2));
    } else {
      console.log('⚠️ Aucune donnée de loterie trouvée dans cette transaction');
    }
    
    // 4. Lien explorateur
    console.log('');
    console.log('🌐 VÉRIFICATION PUBLIQUE:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const explorerUrl = chilizBlockchain.getExplorerUrl(transactionHash);
    console.log(`   Explorateur: ${explorerUrl}`);
    console.log('   👆 Ouvrez ce lien pour voir la transaction publiquement');
    
    return verification;
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'inspection:', error);
    return null;
  }
}

// Fonction pour récupérer et afficher l'historique complet d'un concours
async function inspectContestHistory(contestId: string) {
  console.log('📊 Inspection de l\'historique du concours:', contestId);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  try {
    // Récupérer l'historique via l'API
    const response = await fetch(`/api/blockchain/contests/${contestId}/history`);
    const result = await response.json();
    
    if (!result.success) {
      console.log('❌ Erreur:', result.error);
      return;
    }
    
    const { participations, winners, totalEvents } = result.data;
    
    console.log(`📈 STATISTIQUES BLOCKCHAIN:`);
    console.log(`   Total événements: ${totalEvents}`);
    console.log(`   Participations: ${participations.length}`);
    console.log(`   Gagnants annoncés: ${winners.length}`);
    console.log('');
    
    // Afficher toutes les participations
    if (participations.length > 0) {
      console.log('👥 PARTICIPATIONS ON-CHAIN:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      participations.forEach((event: BlockchainEvent, index: number) => {
        console.log(`   ${index + 1}. ${blockchainUtils.formatAddress(event.walletAddress)}`);
        console.log(`      Jersey: ${event.data.jerseyId}`);
        console.log(`      Username: ${event.data.username || 'Anonyme'}`);
        console.log(`      Timestamp: ${blockchainUtils.formatTimestamp(event.timestamp)}`);
        console.log(`      TX: ${event.transactionHash}`);
        console.log(`      Explorateur: ${blockchainUtils.getExplorerLink(event.transactionHash!)}`);
        console.log('');
      });
    }
    
    // Afficher tous les gagnants
    if (winners.length > 0) {
      console.log('🏆 GAGNANTS ANNONCÉS ON-CHAIN:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      winners.forEach((event: BlockchainEvent, index: number) => {
        console.log(`   ${index + 1}. ${blockchainUtils.formatAddress(event.walletAddress)}`);
        console.log(`      Prix: ${event.data.prize}`);
        console.log(`      Rang: ${event.data.rank || 'Non spécifié'}`);
        console.log(`      Timestamp: ${blockchainUtils.formatTimestamp(event.timestamp)}`);
        console.log(`      TX: ${event.transactionHash}`);
        console.log(`      Explorateur: ${blockchainUtils.getExplorerLink(event.transactionHash!)}`);
        console.log('');
      });
    }
    
    console.log('✅ Toutes ces informations sont vérifiables publiquement sur la blockchain Chiliz !');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'inspection du concours:', error);
  }
}

// Fonction pour générer un rapport de vérification complet
async function generateVerificationReport(contestId: string) {
  console.log('📋 RAPPORT DE VÉRIFICATION BLOCKCHAIN');
  console.log('════════════════════════════════════════════════════════════════');
  console.log(`Contest ID: ${contestId}`);
  console.log(`Date: ${new Date().toLocaleString('fr-FR')}`);
  console.log(`Réseau: ${chilizBlockchain.getNetworkInfo().name}`);
  console.log('');
  
  // Récupérer et afficher l'historique
  await inspectContestHistory(contestId);
  
  console.log('');
  console.log('🔐 GARANTIES BLOCKCHAIN:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ Toutes les participations sont horodatées et immuables');
  console.log('✅ Toutes les annonces de gagnants sont publiquement vérifiables');
  console.log('✅ Impossible de modifier rétroactivement les données');
  console.log('✅ Transparence totale via l\'explorateur Chiliz');
  console.log('✅ Conformité avec les standards blockchain');
  console.log('');
  console.log('🌐 Pour vérifier publiquement:');
  console.log(`   Explorateur: ${chilizBlockchain.getNetworkInfo().explorerUrl}`);
  console.log('   Recherchez les hash de transactions listés ci-dessus');
}

// Exports
export { inspectLotteryTransaction, inspectContestHistory, generateVerificationReport };
