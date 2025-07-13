// Nouvelle implémentation avec co-signature client/serveur
import { ethers } from 'ethers';
import { CHILIZ_CONFIG } from './chiliz-blockchain';

// Structure pour la signature du client
export interface ParticipationSignature {
  contestId: string;
  jerseyId: string;
  walletAddress: string;
  username?: string;
  timestamp: number;
  signature: string; // Signature du client
  messageHash: string; // Hash du message signé
}

// Fonction pour créer le message à signer côté client
export function createParticipationMessage(
  contestId: string,
  jerseyId: string,
  walletAddress: string,
  timestamp: number,
  username?: string
): string {
  return JSON.stringify({
    action: 'LOTTERY_PARTICIPATION',
    contestId,
    jerseyId,
    walletAddress,
    username: username || '',
    timestamp,
    network: 'chiliz-spicy-testnet'
  });
}

// Fonction pour vérifier la signature côté serveur
export async function verifyParticipationSignature(
  signature: ParticipationSignature
): Promise<{ valid: boolean; recoveredAddress?: string; error?: string }> {
  try {
    // Recréer le message original
    const message = createParticipationMessage(
      signature.contestId,
      signature.jerseyId,
      signature.walletAddress,
      signature.timestamp,
      signature.username
    );

    // Vérifier que le hash correspond
    const expectedHash = ethers.keccak256(ethers.toUtf8Bytes(message));
    if (expectedHash !== signature.messageHash) {
      return { valid: false, error: 'Hash du message invalide' };
    }

    // Récupérer l'adresse qui a signé
    const recoveredAddress = ethers.verifyMessage(message, signature.signature);
    
    // Vérifier que l'adresse correspond
    if (recoveredAddress.toLowerCase() !== signature.walletAddress.toLowerCase()) {
      return { 
        valid: false, 
        error: `Signature invalide: attendu ${signature.walletAddress}, récupéré ${recoveredAddress}` 
      };
    }

    return { valid: true, recoveredAddress };

  } catch (error) {
    console.error('Erreur vérification signature:', error);
    return { valid: false, error: 'Erreur lors de la vérification' };
  }
}

// Nouvelle fonction de participation avec co-signature
export async function participateWithCoSignature(
  clientSignature: ParticipationSignature
): Promise<{
  success: boolean;
  transactionHash?: string;
  explorerUrl?: string;
  error?: string;
  data?: any;
}> {
  try {
    console.log('🤝 PARTICIPATION AVEC CO-SIGNATURE');
    console.log('📝 Signature client:', clientSignature);

    // 1. Vérifier la signature du client
    const signatureVerification = await verifyParticipationSignature(clientSignature);
    if (!signatureVerification.valid) {
      return {
        success: false,
        error: `Signature client invalide: ${signatureVerification.error}`
      };
    }

    console.log('✅ Signature client valide, adresse récupérée:', signatureVerification.recoveredAddress);

    // 2. Vérifier le timestamp (pas trop ancien, max 5 minutes)
    const now = Math.floor(Date.now() / 1000);
    const maxAge = 5 * 60; // 5 minutes
    if (now - clientSignature.timestamp > maxAge) {
      return {
        success: false,
        error: 'Signature expirée (plus de 5 minutes)'
      };
    }

    // 3. Créer la transaction blockchain avec co-signature
    const provider = new ethers.JsonRpcProvider(CHILIZ_CONFIG.TESTNET.rpcUrl);
    const serverSigner = new ethers.Wallet(process.env.BLOCKCHAIN_PRIVATE_KEY!, provider);

    // Créer les données de la transaction avec les deux signatures
    const transactionData = {
      participantSignature: {
        address: clientSignature.walletAddress,
        signature: clientSignature.signature,
        messageHash: clientSignature.messageHash,
        timestamp: clientSignature.timestamp
      },
      serverValidation: {
        address: serverSigner.address,
        validatedAt: now,
        contestId: clientSignature.contestId,
        jerseyId: clientSignature.jerseyId
      }
    };

    // 4. Envoyer la transaction sur la blockchain
    const transaction = await serverSigner.sendTransaction({
      to: clientSignature.walletAddress, // Envoyer vers l'adresse du participant
      value: 0, // Pas de transfert de valeur
      data: ethers.hexlify(ethers.toUtf8Bytes(JSON.stringify(transactionData))),
      gasLimit: 25000 // Gas pour les données
    });

    console.log('📡 Transaction envoyée:', transaction.hash);

    // 5. Attendre la confirmation
    const receipt = await transaction.wait();
    console.log('✅ Transaction confirmée dans le bloc:', receipt?.blockNumber);

    const explorerUrl = `${CHILIZ_CONFIG.TESTNET.explorerUrl}/tx/${transaction.hash}`;

    return {
      success: true,
      transactionHash: transaction.hash,
      explorerUrl,
      data: {
        blockNumber: receipt?.blockNumber,
        gasUsed: receipt?.gasUsed?.toString(),
        clientSignature: clientSignature.signature,
        serverSigner: serverSigner.address,
        timestamp: now
      }
    };

  } catch (error) {
    console.error('❌ Erreur co-signature:', error);
    return {
      success: false,
      error: `Erreur lors de la co-signature: ${error}`
    };
  }
}
