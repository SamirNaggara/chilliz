// Fonction pour créer une vraie transaction blockchain simple
import { ethers } from 'ethers';

interface SimpleBlockchainLogger {
  provider: ethers.JsonRpcProvider;
  signer?: ethers.Wallet;
}

class SimpleChilizLogger implements SimpleBlockchainLogger {
  provider: ethers.JsonRpcProvider;
  signer?: ethers.Wallet;

  constructor() {
    // Configuration pour Chiliz Spicy Testnet
    this.provider = new ethers.JsonRpcProvider('https://spicy-rpc.chiliz.com');
    
    // Vous devez avoir une clé privée pour signer des transactions
    const privateKey = process.env.BLOCKCHAIN_PRIVATE_KEY;
    if (privateKey) {
      this.signer = new ethers.Wallet(privateKey, this.provider);
      console.log('🔑 Signer configuré avec l\'adresse:', this.signer.address);
    } else {
      console.warn('⚠️ BLOCKCHAIN_PRIVATE_KEY manquante dans .env.local');
    }
  }

  // Créer une vraie transaction qui enregistre des données dans la blockchain
  async createRealTransaction(data: any): Promise<{
    success: boolean;
    transactionHash?: string;
    error?: string;
  }> {
    try {
      if (!this.signer) {
        return {
          success: false,
          error: 'Pas de clé privée configurée. Ajoutez BLOCKCHAIN_PRIVATE_KEY à .env.local'
        };
      }

      console.log('🚀 Création d\'une vraie transaction Chiliz...');
      console.log('📝 Données:', JSON.stringify(data, null, 2));

      // Créer une transaction simple avec les données en annexe
      const transaction = await this.signer.sendTransaction({
        to: this.signer.address, // Se renvoyer à soi-même (transaction nulle)
        value: ethers.parseEther('0'), // 0 CHZ
        data: ethers.hexlify(ethers.toUtf8Bytes(JSON.stringify(data))), // Données en hex
        gasLimit: 50000, // Limite de gas raisonnable
      });

      console.log('✅ Transaction créée:', transaction.hash);
      console.log('🌐 Voir sur explorer:', `https://spicy-explorer.chiliz.com/tx/${transaction.hash}`);
      
      // Attendre la confirmation (optionnel pour l'instant)
      transaction.wait().then((receipt) => {
        console.log('✅ Transaction confirmée dans le block:', receipt?.blockNumber);
      }).catch((error) => {
        console.warn('⚠️ Erreur confirmation:', error);
      });
      
      return {
        success: true,
        transactionHash: transaction.hash
      };

    } catch (error: any) {
      console.error('❌ Erreur création transaction:', error);
      
      // Messages d'erreur spécifiques
      if (error.message?.includes('insufficient funds')) {
        return {
          success: false,
          error: 'Fonds insuffisants. Obtenez des CHZ de test sur https://spicy-faucet.chiliz.com/'
        };
      }
      
      return {
        success: false,
        error: `Erreur blockchain: ${error.message || 'Erreur inconnue'}`
      };
    }
  }

  // Créer une transaction pour une participation de loterie
  async createLotteryParticipation(
    contestId: string,
    participantAddress: string,
    jerseyId: string,
    username?: string
  ) {
    const lotteryData = {
      type: 'LOTTERY_PARTICIPATION',
      contestId,
      participantAddress,
      jerseyId,
      username,
      timestamp: Math.floor(Date.now() / 1000),
      platform: 'FanScan-Chiliz-Hackathon'
    };

    return await this.createRealTransaction(lotteryData);
  }

  // Créer une transaction pour l'annonce d'un gagnant
  async createWinnerAnnouncement(
    contestId: string,
    winnerAddress: string,
    prize: string,
    rank: number
  ) {
    const winnerData = {
      type: 'WINNER_ANNOUNCEMENT',
      contestId,
      winnerAddress,
      prize,
      rank,
      timestamp: Math.floor(Date.now() / 1000),
      platform: 'FanScan-Chiliz-Hackathon'
    };

    return await this.createRealTransaction(winnerData);
  }

  // Vérifier si une transaction existe vraiment
  async verifyTransactionExists(txHash: string): Promise<{
    exists: boolean;
    transaction?: any;
    receipt?: any;
  }> {
    try {
      const [transaction, receipt] = await Promise.all([
        this.provider.getTransaction(txHash),
        this.provider.getTransactionReceipt(txHash)
      ]);
      
      return {
        exists: transaction !== null,
        transaction,
        receipt
      };
    } catch (error) {
      console.error('Erreur vérification transaction:', error);
      return { exists: false };
    }
  }

  // Obtenir le solde CHZ de l'adresse
  async getBalance(): Promise<string> {
    if (!this.signer) return '0';
    
    try {
      const balance = await this.provider.getBalance(this.signer.address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Erreur récupération solde:', error);
      return '0';
    }
  }

  // Vérifier la connexion au réseau
  async checkNetwork(): Promise<{
    connected: boolean;
    network?: any;
    blockNumber?: number;
  }> {
    try {
      const [network, blockNumber] = await Promise.all([
        this.provider.getNetwork(),
        this.provider.getBlockNumber()
      ]);
      
      return {
        connected: true,
        network,
        blockNumber
      };
    } catch (error) {
      return { connected: false };
    }
  }
}

export const realChilizLogger = new SimpleChilizLogger();
