import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { participateInLotteryWithBlockchain } from "@/lib/blockchain-actions";

export async function POST(request: NextRequest) {
  console.log('🎯 API PARTICIPATION APPELÉE');
  
  try {
    const body = await request.json();
    const { contestId, jerseyId, walletAddress, username } = body;
    
    console.log('📥 Données reçues:', { contestId, jerseyId, walletAddress, username });

    // Validation des données
    if (!contestId || !jerseyId || !walletAddress) {
      return NextResponse.json(
        { error: "ContestId, jerseyId et walletAddress sont requis" },
        { status: 400 }
      );
    }

    // Vérifier si le concours existe
    const contest = await prisma.contest.findUnique({
      where: { id: contestId },
    });

    if (!contest) {
      return NextResponse.json(
        { error: "Concours non trouvé" },
        { status: 404 }
      );
    }

    const now = new Date();
    if (now < contest.startedAt || (contest.endedAt && now > contest.endedAt)) {
      return NextResponse.json(
        { error: "Le concours n'est pas encore commencé ou est déjà terminé" },
        { status: 400 }
      );
    }

    // Vérifier le cooldown du maillot
    const jersey = await prisma.jersey.findUnique({
      where: { id: jerseyId },
    });

    if (!jersey) {
      return NextResponse.json(
        { error: "Maillot non trouvé" },
        { status: 404 }
      );
    }

    // 🚀 NOUVEAU: Utiliser la fonction blockchain pour la participation
    console.log('🎲 Participation avec blockchain via API:', { contestId, jerseyId, walletAddress, username });
    console.log('🚀 Appel de participateInLotteryWithBlockchain...');
    
    const blockchainResult = await participateInLotteryWithBlockchain(
      contestId,
      jerseyId,
      walletAddress,
      username
    );

    console.log('📋 Résultat blockchain reçu:', {
      success: blockchainResult.success,
      error: blockchainResult.error,
      transactionHash: blockchainResult.data?.blockchainTx || 'N/A'
    });

    if (!blockchainResult.success) {
      console.log('❌ Échec blockchain:', blockchainResult.error);
      return NextResponse.json(
        { error: blockchainResult.error },
        { status: 400 }
      );
    }

    console.log('✅ Participation blockchain réussie!');
    console.log('🌐 Hash de transaction:', blockchainResult.data.blockchainTx);

    // Retourner les données de participation avec les informations blockchain
    const response = {
      message: "Participation enregistrée avec succès",
      participation: blockchainResult.data.participation,
      blockchainTx: blockchainResult.data.blockchainTx,
      explorerUrl: `https://spicy-explorer.chiliz.com/tx/${blockchainResult.data.blockchainTx}`
    };
    
    console.log('📤 Réponse API:', response);

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la participation:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
