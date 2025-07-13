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
    console.log('🌟 DÉBUT createRealTransaction');
    console.log('📥 Données entrées:', data);
    
    try {
      if (!this.signer) {
        console.log('❌ Pas de signer configuré');
        return {
          success: false,
          error: 'Pas de clé privée configurée. Ajoutez BLOCKCHAIN_PRIVATE_KEY à .env.local'
        };
      }

      console.log('🚀 Création d\'une vraie transaction Chiliz...');
      console.log('🔑 Adresse du signer:', this.signer.address);
      console.log('📝 Données:', JSON.stringify(data, null, 2));

      // Créer une transaction simple avec les données en annexe
      console.log('⚡ Envoi de la transaction...');
      const transaction = await this.signer.sendTransaction({
        to: this.signer.address, // Se renvoyer à soi-même (transaction nulle)
        value: ethers.parseEther('0'), // 0 CHZ
        data: ethers.hexlify(ethers.toUtf8Bytes(JSON.stringify(data))), // Données en hex
        gasLimit: 50000, // Limite de gas raisonnable
      });

      console.log('✅ Transaction envoyée! Hash:', transaction.hash);

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
    console.log('🎯 DÉBUT createLotteryParticipation');
    console.log('📊 Paramètres:', { contestId, participantAddress, jerseyId, username });
    
    const lotteryData = {
      type: 'LOTTERY_PARTICIPATION',
      contestId,
      participantAddress,
      jerseyId,
      username,
      timestamp: Math.floor(Date.now() / 1000),
      platform: 'FanScan-Chiliz-Hackathon'
    };

    console.log('📋 Données de loterie créées:', lotteryData);
    console.log('🔄 Appel de createRealTransaction...');

    const result = await this.createRealTransaction(lotteryData);
    
    console.log('📤 Résultat de createRealTransaction:', result);
    return result;
  }

  // Créer une annonce de gagnant sur blockchain
  async createWinnerAnnouncement(
    contestId: string,
    winnerAddress: string,
    prize: string,
    rank: number,
    username?: string
  ): Promise<{
    success: boolean;
    transactionHash?: string;
    error?: string;
    receipt?: any;
  }> {
    console.log('🏆 DÉBUT createWinnerAnnouncement');
    console.log('📋 Paramètres:', { contestId, winnerAddress, prize, rank, username });

    if (!this.signer) {
      return {
        success: false,
        error: 'Signer blockchain non configuré'
      };
    }

    try {
      // Données de l'annonce de gagnant avec nom d'utilisateur
      const announcementData = {
        type: 'WINNER_ANNOUNCEMENT',
        contestId,
        winnerAddress,
        prize,
        rank,
        username, // 🆕 Ajout du nom d'utilisateur
        timestamp: Math.floor(Date.now() / 1000),
        network: 'chiliz-spicy-testnet'
      };

      console.log('📝 Données annonce:', announcementData);

      // Créer et envoyer la transaction
      const transaction = await this.signer!.sendTransaction({
        to: winnerAddress, // Envoyer vers l'adresse du gagnant
        value: 0, // Pas de transfert de valeur
        data: ethers.hexlify(ethers.toUtf8Bytes(JSON.stringify(announcementData))),
        gasLimit: 25000 // Gas pour les données
      });

      console.log('📡 Transaction envoyée:', transaction.hash);

      // Attendre la confirmation
      const receipt = await transaction.wait();
      console.log('✅ Transaction confirmée bloc:', receipt?.blockNumber);

      return {
        success: true,
        transactionHash: transaction.hash,
        receipt
      };

    } catch (error) {
      console.error('❌ Erreur createWinnerAnnouncement:', error);
      return {
        success: false,
        error: `Erreur: ${error}`
      };
    }
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
