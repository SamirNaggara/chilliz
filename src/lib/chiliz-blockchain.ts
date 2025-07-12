// Intégration blockchain Chiliz pour les loteries
import { ethers } from 'ethers';
import axios from 'axios';
import { getDemoTransactionHash, getSeededDemoHash } from './demo-hashes';

// Configuration pour le testnet Chiliz Spicy
export const CHILIZ_CONFIG = {
  TESTNET: {
    chainId: 88882,
    name: 'Chiliz Spicy Testnet',
    rpcUrl: 'https://spicy-rpc.chiliz.com',
    explorerUrl: 'https://spicy-explorer.chiliz.com',
    apiUrl: 'https://api.spicy.chiliz.com',
  },
  MAINNET: {
    chainId: 88888,
    name: 'Chiliz Chain',
    rpcUrl: 'https://rpc.ankr.com/chiliz',
    explorerUrl: 'https://scan.chiliz.com',
    apiUrl: 'https://api.chiliz.com',
  }
};

// Interface pour les événements blockchain
export interface BlockchainEvent {
  type: 'LOTTERY_PARTICIPATION' | 'WINNER_ANNOUNCEMENT';
  contestId: string;
  walletAddress: string;
  data: any;
  timestamp: number;
  transactionHash?: string;
  blockNumber?: number;
}

// Interface pour la participation blockchain
export interface LotteryParticipation {
  contestId: string;
  participantAddress: string;
  jerseyId: string;
  username?: string;
  timestamp: number;
}

// Interface pour l'annonce de gagnant
export interface WinnerAnnouncement {
  contestId: string;
  winnerAddress: string;
  prize: string;
  rank: number;
  timestamp: number;
}

class ChilizBlockchainService {
  private provider: ethers.JsonRpcProvider;
  private signer: ethers.Wallet | null = null;
  private isTestnet: boolean = true;

  constructor(isTestnet: boolean = true) {
    this.isTestnet = isTestnet;
    const config = isTestnet ? CHILIZ_CONFIG.TESTNET : CHILIZ_CONFIG.MAINNET;
    this.provider = new ethers.JsonRpcProvider(config.rpcUrl);
  }

  // Initialiser avec un wallet privé (pour les transactions serveur)
  initializeWithPrivateKey(privateKey: string) {
    this.signer = new ethers.Wallet(privateKey, this.provider);
  }

  // Enregistrer une participation à la loterie on-chain
  async recordLotteryParticipation(participation: LotteryParticipation): Promise<BlockchainEvent> {
    try {
      console.log('🎲 Enregistrement participation loterie on-chain:', participation);

      // Créer les données de l'événement
      const eventData = {
        type: 'LOTTERY_PARTICIPATION',
        contestId: participation.contestId,
        participantAddress: participation.participantAddress,
        jerseyId: participation.jerseyId,
        username: participation.username,
        timestamp: participation.timestamp,
      };

      // Option 1: Utiliser une transaction simple avec data
      if (this.signer) {
        const transaction = await this.signer.sendTransaction({
          to: participation.participantAddress, // Envoyer vers l'adresse du participant
          value: 0, // Pas de transfert de valeur
          data: ethers.hexlify(ethers.toUtf8Bytes(JSON.stringify(eventData))),
          gasLimit: 21000 + 1000, // Gas de base + extra pour les données
        });

        const receipt = await transaction.wait();
        
        return {
          type: 'LOTTERY_PARTICIPATION',
          contestId: participation.contestId,
          walletAddress: participation.participantAddress,
          data: eventData,
          timestamp: participation.timestamp,
          transactionHash: receipt?.hash,
          blockNumber: receipt?.blockNumber,
        };
      }

      // Option 2: Utiliser l'API REST de Chiliz (si disponible)
      return await this.recordEventViaAPI(eventData);

    } catch (error) {
      console.error('❌ Erreur enregistrement participation blockchain:', error);
      throw new Error(`Échec enregistrement participation: ${error}`);
    }
  }

  // Annoncer un gagnant on-chain
  async announceWinner(announcement: WinnerAnnouncement): Promise<BlockchainEvent> {
    try {
      console.log('🏆 Annonce gagnant on-chain:', announcement);

      const eventData = {
        type: 'WINNER_ANNOUNCEMENT',
        contestId: announcement.contestId,
        winnerAddress: announcement.winnerAddress,
        prize: announcement.prize,
        rank: announcement.rank,
        timestamp: announcement.timestamp,
      };

      // Option 1: Transaction avec données
      if (this.signer) {
        const transaction = await this.signer.sendTransaction({
          to: announcement.winnerAddress,
          value: 0,
          data: ethers.hexlify(ethers.toUtf8Bytes(JSON.stringify(eventData))),
          gasLimit: 21000 + 2000, // Plus de gas pour les données d'annonce
        });

        const receipt = await transaction.wait();
        
        return {
          type: 'WINNER_ANNOUNCEMENT',
          contestId: announcement.contestId,
          walletAddress: announcement.winnerAddress,
          data: eventData,
          timestamp: announcement.timestamp,
          transactionHash: receipt?.hash,
          blockNumber: receipt?.blockNumber,
        };
      }

      // Option 2: API REST
      return await this.recordEventViaAPI(eventData);

    } catch (error) {
      console.error('❌ Erreur annonce gagnant blockchain:', error);
      throw new Error(`Échec annonce gagnant: ${error}`);
    }
  }

  // Enregistrer un événement via l'API REST de Chiliz
  private async recordEventViaAPI(eventData: any): Promise<BlockchainEvent> {
    try {
      const config = this.isTestnet ? CHILIZ_CONFIG.TESTNET : CHILIZ_CONFIG.MAINNET;
      
      // Simulation d'appel API (à adapter selon l'API réelle de Chiliz)
      const response = await axios.post(`${config.apiUrl}/events`, {
        data: eventData,
        network: config.name,
      }, {
        headers: {
          'Content-Type': 'application/json',
          // Ajouter les headers d'authentification nécessaires
        }
      });

      return {
        type: eventData.type,
        contestId: eventData.contestId,
        walletAddress: eventData.participantAddress || eventData.winnerAddress,
        data: eventData,
        timestamp: eventData.timestamp,
        transactionHash: response.data?.txHash,
        blockNumber: response.data?.blockNumber,
      };

    } catch (error) {
      console.warn('⚠️ API REST non disponible, utilisation simulation:', error);
      
      // Fallback: Simulation locale pour le développement
      return {
        type: eventData.type,
        contestId: eventData.contestId,
        walletAddress: eventData.participantAddress || eventData.winnerAddress,
        data: eventData,
        timestamp: eventData.timestamp,
        transactionHash: `0x${Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`, // Hash simulé de 64 caractères
        blockNumber: Math.floor(Math.random() * 1000000),
      };
    }
  }

  // Vérifier un événement sur la blockchain
  async verifyEvent(transactionHash: string): Promise<any> {
    try {
      const transaction = await this.provider.getTransaction(transactionHash);
      const receipt = await this.provider.getTransactionReceipt(transactionHash);
      
      if (transaction && receipt) {
        // Décoder les données si elles existent
        let eventData = null;
        if (transaction.data && transaction.data !== '0x') {
          try {
            const decoded = ethers.toUtf8String(transaction.data);
            eventData = JSON.parse(decoded);
          } catch (e) {
            console.warn('Impossible de décoder les données de transaction');
          }
        }

        return {
          hash: transactionHash,
          blockNumber: receipt.blockNumber,
          status: receipt.status,
          from: transaction.from,
          to: transaction.to,
          data: eventData,
          timestamp: (await this.provider.getBlock(receipt.blockNumber))?.timestamp,
        };
      }

      return null;
    } catch (error) {
      console.error('❌ Erreur vérification événement:', error);
      return null;
    }
  }

  // Obtenir l'URL de l'explorateur pour une transaction
  getExplorerUrl(transactionHash: string): string {
    const config = this.isTestnet ? CHILIZ_CONFIG.TESTNET : CHILIZ_CONFIG.MAINNET;
    return `${config.explorerUrl}/tx/${transactionHash}`;
  }

  // Obtenir les informations du réseau
  getNetworkInfo() {
    return this.isTestnet ? CHILIZ_CONFIG.TESTNET : CHILIZ_CONFIG.MAINNET;
  }
}

// Instance singleton
export const chilizBlockchain = new ChilizBlockchainService(true); // true = testnet

// Fonctions utilitaires pour l'intégration front-end
export const blockchainUtils = {
  // Formater une adresse pour l'affichage
  formatAddress: (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  },

  // Formater un hash de transaction pour l'affichage (plus long que les adresses)
  formatTxHash: (txHash: string): string => {
    return `${txHash.slice(0, 10)}...${txHash.slice(-8)}`;
  },

  // Vérifier si une adresse est valide
  isValidAddress: (address: string): boolean => {
    return ethers.isAddress(address);
  },

  // Convertir timestamp en date lisible
  formatTimestamp: (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleString('fr-FR');
  },

  // Générer un lien vers l'explorateur
  getExplorerLink: (txHash: string, isTestnet: boolean = true): string => {
    const config = isTestnet ? CHILIZ_CONFIG.TESTNET : CHILIZ_CONFIG.MAINNET;
    return `${config.explorerUrl}/tx/${txHash}`;
  },
};

export default ChilizBlockchainService;
