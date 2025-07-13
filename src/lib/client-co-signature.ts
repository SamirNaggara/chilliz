// Fonctions côté client pour la co-signature
import { createParticipationMessage } from './co-signature-blockchain';

// Interface pour les résultats de signature côté client
export interface ClientSignatureResult {
  success: boolean;
  signature?: string;
  messageHash?: string;
  message?: string;
  error?: string;
}

// Fonction pour signer la participation côté client
export async function signParticipation(
  contestId: string,
  jerseyId: string,
  walletAddress: string,
  username?: string
): Promise<ClientSignatureResult> {
  try {
    // Vérifier que MetaMask est disponible
    if (typeof window === 'undefined' || !window.ethereum) {
      return {
        success: false,
        error: 'MetaMask non disponible'
      };
    }

    const ethereum = window.ethereum;

    // Créer le timestamp
    const timestamp = Math.floor(Date.now() / 1000);

    // Créer le message à signer
    const message = createParticipationMessage(
      contestId,
      jerseyId,
      walletAddress,
      timestamp,
      username
    );

    console.log('📝 Message à signer:', message);

    // Calculer le hash du message
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const messageHash = '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Demander la signature à l'utilisateur
    const signature = await ethereum.request({
      method: 'personal_sign',
      params: [message, walletAddress]
    });

    return {
      success: true,
      signature,
      messageHash,
      message
    };

  } catch (error: any) {
    console.error('Erreur signature client:', error);
    
    // Messages d'erreur spécifiques
    if (error?.code === 4001) {
      return {
        success: false,
        error: 'Signature refusée par l\'utilisateur'
      };
    }

    return {
      success: false,
      error: `Erreur lors de la signature: ${error?.message || error}`
    };
  }
}

// Fonction complète pour participer avec co-signature
export async function participateWithClientSignature(
  contestId: string,
  jerseyId: string,
  walletAddress: string,
  username?: string
): Promise<{
  success: boolean;
  transactionHash?: string;
  explorerUrl?: string;
  error?: string;
  participationId?: string;
}> {
  try {
    console.log('🤝 Début participation avec co-signature');

    // 1. Faire signer par le client
    const signatureResult = await signParticipation(
      contestId,
      jerseyId,
      walletAddress,
      username
    );

    if (!signatureResult.success) {
      return {
        success: false,
        error: signatureResult.error
      };
    }

    console.log('✅ Signature client obtenue');

    // 2. Envoyer au serveur pour co-signature
    const response = await fetch('/api/contests/participate-with-signature', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contestId,
        jerseyId,
        walletAddress,
        username,
        timestamp: Math.floor(Date.now() / 1000),
        signature: signatureResult.signature,
        messageHash: signatureResult.messageHash
      })
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Erreur serveur'
      };
    }

    console.log('✅ Co-signature complétée');

    return {
      success: true,
      transactionHash: result.transactionHash,
      explorerUrl: result.explorerUrl,
      participationId: result.participationId
    };

  } catch (error: any) {
    console.error('Erreur participation co-signature:', error);
    return {
      success: false,
      error: `Erreur lors de la participation: ${error?.message || error}`
    };
  }
}
