// Actions blockchain pour les loteries
import { chilizBlockchain, type LotteryParticipation, type WinnerAnnouncement, type BlockchainEvent } from './chiliz-blockchain';
import { prisma } from './prisma';
import { realChilizLogger } from './real-blockchain-logger';

// Interface pour les résultats d'actions blockchain
export interface BlockchainActionResult {
  success: boolean;
  data?: any;
  error?: string;
  transactionHash?: string;
  explorerUrl?: string;
}

// Enregistrer une participation à la loterie avec blockchain
export async function participateInLotteryWithBlockchain(
  contestId: string,
  jerseyId: string,
  walletAddress: string,
  username?: string
): Promise<BlockchainActionResult> {
  console.log('🔥 DÉBUT PARTICIPATION BLOCKCHAIN');
  console.log('📊 Paramètres:', { contestId, jerseyId, walletAddress, username });
  
  try {
    console.log('🎲 Participation loterie avec blockchain:', { contestId, jerseyId, walletAddress, username });

    // 1. Vérifier si la participation existe déjà (off-chain)
    const existingParticipation = await prisma.participation.findUnique({
      where: {
        contest_wallet_jersey_unique: {
          contestId,
          walletAddress,
          jerseyId,
        },
      },
    });

    if (existingParticipation) {
      return {
        success: false,
        error: "Vous avez déjà participé avec ce maillot",
      };
    }

    // 2. Créer les données de participation blockchain
    const participationData: LotteryParticipation = {
      contestId,
      participantAddress: walletAddress,
      jerseyId,
      username,
      timestamp: Math.floor(Date.now() / 1000),
    };

    // 3. Créer une VRAIE transaction blockchain AVANT d'enregistrer en base
    console.log('🚀 Création d\'une vraie transaction blockchain...');
    console.log('🔑 Appel de realChilizLogger.createLotteryParticipation...');
    
    const blockchainResult = await realChilizLogger.createLotteryParticipation(
      contestId,
      walletAddress,
      jerseyId,
      username
    );

    console.log('📋 Résultat de realChilizLogger:', blockchainResult);

    if (!blockchainResult.success) {
      console.error('❌ Erreur transaction blockchain:', blockchainResult.error);
      return {
        success: false,
        error: `Erreur blockchain: ${blockchainResult.error}`
      };
    }

    console.log('✅ Transaction blockchain créée:', blockchainResult.transactionHash);
    console.log('🌐 Voir sur explorer:', `https://spicy-explorer.chiliz.com/tx/${blockchainResult.transactionHash}`);

    // 4. Enregistrer en base de données avec le hash de transaction réel
    const participation = await prisma.participation.create({
      data: {
        contestId,
        jerseyId,
        walletAddress,
        username,
        // Champs blockchain avec la vraie transaction
        blockchainTxHash: blockchainResult.transactionHash,
        blockchainTimestamp: new Date(),
        blockchainConfirmed: true,
        blockchainData: {
          type: 'LOTTERY_PARTICIPATION',
          contestId,
          participantAddress: walletAddress,
          jerseyId,
          username,
          timestamp: Math.floor(Date.now() / 1000)
        }
      },
    });

    // 5. Retourner le succès avec les informations blockchain réelles
    return {
      success: true,
      data: {
        participation,
        blockchainTx: blockchainResult.transactionHash,
      },
      transactionHash: blockchainResult.transactionHash,
      explorerUrl: `https://spicy-explorer.chiliz.com/tx/${blockchainResult.transactionHash}`,
    };

  } catch (error) {
    console.error('❌ Erreur participation loterie blockchain:', error);
    return {
      success: false,
      error: "Erreur lors de la participation",
    };
  }
}

// Annoncer les gagnants avec enregistrement blockchain
export async function announceWinnersWithBlockchain(
  contestId: string,
  winners: Array<{
    walletAddress: string;
    prize: string;
    rank?: number;
  }>
): Promise<BlockchainActionResult> {
  try {
    console.log('🏆 ANNONCE GAGNANTS AVEC BLOCKCHAIN OBLIGATOIRE');
    console.log('📊 Paramètres:', { contestId, winners });

    // 🆕 Récupérer les noms d'utilisateur depuis les participations
    const participations = await prisma.participation.findMany({
      where: { 
        contestId,
        walletAddress: {
          in: winners.map(w => w.walletAddress)
        }
      },
      select: {
        walletAddress: true,
        username: true
      }
    });

    console.log('👥 Noms d\'utilisateur récupérés:', participations);

    const blockchainTransactions: Array<{
      winner: any;
      transactionHash: string;
      explorerUrl: string;
    }> = [];
    const timestamp = Math.floor(Date.now() / 1000);

    // 1. Créer une VRAIE transaction blockchain pour CHAQUE gagnant
    for (let i = 0; i < winners.length; i++) {
      const winner = winners[i];
      
      // 🆕 Trouver le nom d'utilisateur correspondant
      const participation = participations.find(p => p.walletAddress === winner.walletAddress);
      const username = participation?.username;
      
      console.log(`🏆 Annonce gagnant ${i + 1}/${winners.length} sur blockchain...`);
      console.log(`📝 Gagnant: ${winner.walletAddress} (${username || 'Anonyme'}) - Prix: ${winner.prize}`);

      try {
        // Utiliser realChilizLogger pour créer une vraie transaction avec le nom
        const blockchainResult = await realChilizLogger.createWinnerAnnouncement(
          contestId,
          winner.walletAddress,
          winner.prize,
          winner.rank || (i + 1),
          username || undefined // 🆕 Passer le nom d'utilisateur (gérer null)
        );

        if (blockchainResult.success && blockchainResult.transactionHash) {
          console.log(`✅ Gagnant ${i + 1} annoncé sur blockchain:`, blockchainResult.transactionHash);
          console.log(`🌐 Explorer: https://spicy-explorer.chiliz.com/tx/${blockchainResult.transactionHash}`);
          
          blockchainTransactions.push({
            winner,
            transactionHash: blockchainResult.transactionHash,
            explorerUrl: `https://spicy-explorer.chiliz.com/tx/${blockchainResult.transactionHash}`
          });
        } else {
          console.error(`❌ Erreur blockchain gagnant ${i + 1}:`, blockchainResult.error);
          // On continue même si une transaction échoue
        }
      } catch (blockchainError) {
        console.error(`❌ Erreur blockchain gagnant ${i + 1}:`, blockchainError);
        // On continue même si une transaction échoue
      }
    }

    console.log(`📡 ${blockchainTransactions.length}/${winners.length} transactions blockchain créées`);

    // 2. Enregistrer les gagnants en base de données avec les vrais hashes
    const result = await prisma.$transaction(async (tx) => {
      // Créer tous les gagnants avec leurs hash blockchain
      const createdWinners = await Promise.all(
        winners.map((winner, index) => {
          const blockchainTx = blockchainTransactions[index];
          
          // 🆕 Récupérer le nom d'utilisateur pour ce gagnant
          const participation = participations.find(p => p.walletAddress === winner.walletAddress);
          const username = participation?.username;
          
          return tx.winner.create({
            data: {
              contestId,
              walletAddress: winner.walletAddress,
              prize: winner.prize,
              // Champs blockchain avec vraie transaction
              blockchainTxHash: blockchainTx?.transactionHash || null,
              blockchainTimestamp: blockchainTx ? new Date() : null,
              blockchainConfirmed: !!blockchainTx,
              blockchainData: blockchainTx ? {
                type: 'WINNER_ANNOUNCEMENT',
                contestId,
                winnerAddress: winner.walletAddress,
                prize: winner.prize,
                rank: winner.rank || (index + 1),
                username, // 🆕 Ajouter le nom d'utilisateur dans blockchainData
                timestamp,
                explorerUrl: blockchainTx.explorerUrl
              } : undefined
            },
          });
        })
      );

      // Marquer le concours comme terminé
      await tx.contest.update({
        where: { id: contestId },
        data: { status: 'FINISHED' },
      });

      return createdWinners;
    });

    console.log('💾 Tous les gagnants enregistrés en base avec blockchain');

    // 3. Retourner le succès avec toutes les informations blockchain
    return {
      success: true,
      data: {
        winners: result,
        blockchainTransactions,
        totalBlockchainTx: blockchainTransactions.length,
      },
      transactionHash: blockchainTransactions[0]?.transactionHash,
      explorerUrl: blockchainTransactions[0]?.explorerUrl,
    };

  } catch (error) {
    console.error('❌ Erreur annonce gagnants blockchain:', error);
    return {
      success: false,
      error: "Erreur lors de l'annonce des gagnants",
    };
  }
}

// Vérifier un événement blockchain
export async function verifyBlockchainEvent(transactionHash: string): Promise<{
  verified: boolean;
  data?: any;
  error?: string;
}> {
  try {
    const eventData = await chilizBlockchain.verifyEvent(transactionHash);
    
    if (eventData) {
      return {
        verified: true,
        data: eventData,
      };
    } else {
      return {
        verified: false,
        error: "Transaction non trouvée ou invalide",
      };
    }
  } catch (error) {
    console.error('❌ Erreur vérification blockchain:', error);
    return {
      verified: false,
      error: "Erreur lors de la vérification",
    };
  }
}

// Obtenir l'historique blockchain d'un concours
export async function getContestBlockchainHistory(contestId: string): Promise<{
  participations: BlockchainEvent[];
  winners: BlockchainEvent[];
  totalEvents: number;
}> {
  try {
    // Dans un vrai système, ceci interrogerait l'indexeur blockchain
    // Pour la démo, on simule avec les données en base
    
    const contest = await prisma.contest.findUnique({
      where: { id: contestId },
      include: {
        participations: true,
        winners: true,
      },
    });

    if (!contest) {
      return {
        participations: [],
        winners: [],
        totalEvents: 0,
      };
    }

    // Utiliser les vraies données blockchain stockées en base
    const participations: BlockchainEvent[] = contest.participations.map(p => ({
      type: 'LOTTERY_PARTICIPATION' as const,
      contestId,
      walletAddress: p.walletAddress,
      data: {
        jerseyId: p.jerseyId,
        username: p.username,
        participatedAt: p.participatedAt,
        blockchainConfirmed: p.blockchainConfirmed,
        blockchainData: p.blockchainData,
      },
      timestamp: p.blockchainTimestamp 
        ? Math.floor(p.blockchainTimestamp.getTime() / 1000)
        : Math.floor(p.participatedAt.getTime() / 1000),
      transactionHash: p.blockchainTxHash || undefined,
    }));

    const winners: BlockchainEvent[] = contest.winners.map(w => ({
      type: 'WINNER_ANNOUNCEMENT' as const,
      contestId,
      walletAddress: w.walletAddress,
      data: {
        prize: w.prize,
        wonAt: w.wonAt,
        blockchainConfirmed: w.blockchainConfirmed,
        blockchainData: w.blockchainData,
      },
      timestamp: w.blockchainTimestamp 
        ? Math.floor(w.blockchainTimestamp.getTime() / 1000)
        : Math.floor(w.wonAt.getTime() / 1000),
      transactionHash: w.blockchainTxHash || undefined,
    }));

    return {
      participations,
      winners,
      totalEvents: participations.length + winners.length,
    };

  } catch (error) {
    console.error('❌ Erreur historique blockchain:', error);
    return {
      participations: [],
      winners: [],
      totalEvents: 0,
    };
  }
}

// Initialiser le service blockchain avec clé privée (côté serveur)
export function initializeBlockchainService(privateKey?: string) {
  if (privateKey) {
    chilizBlockchain.initializeWithPrivateKey(privateKey);
    console.log('🔑 Service blockchain initialisé avec clé privée');
  } else {
    console.log('⚠️ Service blockchain en mode lecture seule (pas de clé privée)');
  }
}
