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
    console.log('🏆 Annonce gagnants avec blockchain:', { contestId, winners });

    const blockchainEvents: BlockchainEvent[] = [];
    const timestamp = Math.floor(Date.now() / 1000);

    // 1. Enregistrer chaque gagnant on-chain
    for (let i = 0; i < winners.length; i++) {
      const winner = winners[i];
      const announcementData: WinnerAnnouncement = {
        contestId,
        winnerAddress: winner.walletAddress,
        prize: winner.prize,
        rank: winner.rank || (i + 1),
        timestamp,
      };

      try {
        const blockchainEvent = await chilizBlockchain.announceWinner(announcementData);
        blockchainEvents.push(blockchainEvent);
        console.log(`✅ Gagnant ${i + 1} annoncé on-chain:`, blockchainEvent);
      } catch (blockchainError) {
        console.error(`❌ Erreur blockchain gagnant ${i + 1}:`, blockchainError);
        // Continue avec les autres gagnants
      }
    }

    // 2. Enregistrer les gagnants en base de données
    const result = await prisma.$transaction(async (tx) => {
      // Créer tous les gagnants
      const createdWinners = await Promise.all(
        winners.map((winner, index) =>
          tx.winner.create({
            data: {
              contestId,
              walletAddress: winner.walletAddress,
              prize: winner.prize,
              // Ajouter hash blockchain si disponible
              // blockchainTxHash: blockchainEvents[index]?.transactionHash,
            },
          })
        )
      );

      // Marquer le concours comme terminé
      await tx.contest.update({
        where: { id: contestId },
        data: { status: 'FINISHED' },
      });

      return createdWinners;
    });

    // 3. Retourner le succès avec toutes les informations blockchain
    return {
      success: true,
      data: {
        winners: result,
        blockchainEvents,
      },
      transactionHash: blockchainEvents[0]?.transactionHash,
      explorerUrl: blockchainEvents[0]?.transactionHash 
        ? chilizBlockchain.getExplorerUrl(blockchainEvents[0].transactionHash)
        : undefined,
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

    // Simuler les événements blockchain basés sur les données DB
    const participations: BlockchainEvent[] = contest.participations.map(p => ({
      type: 'LOTTERY_PARTICIPATION' as const,
      contestId,
      walletAddress: p.walletAddress,
      data: {
        jerseyId: p.jerseyId,
        username: p.username,
        participatedAt: p.participatedAt,
      },
      timestamp: Math.floor(p.participatedAt.getTime() / 1000),
      transactionHash: `0x${Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`, // Simulé
    }));

    const winners: BlockchainEvent[] = contest.winners.map(w => ({
      type: 'WINNER_ANNOUNCEMENT' as const,
      contestId,
      walletAddress: w.walletAddress,
      data: {
        prize: w.prize,
        wonAt: w.wonAt,
      },
      timestamp: Math.floor(w.wonAt.getTime() / 1000),
      transactionHash: `0x${Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`, // Simulé
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
