import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { participateInLotteryWithBlockchain } from "@/lib/blockchain-actions";

export async function POST(request: NextRequest) {
  console.log("🎯 API PARTICIPATION APPELÉE");

  try {
    const body = await request.json();
    const { contestId, jerseyId, walletAddress, username } = body;

    console.log("📥 Données reçues:", {
      contestId,
      jerseyId,
      walletAddress,
      username,
    });

    // Validation des données
    if (!contestId || !jerseyId || !walletAddress) {
      return NextResponse.json(
        { error: "ContestId, jerseyId et walletAddress sont requis" },
        { status: 400 }
      );
    }

    // Vérifier si le concours existe et est actif
    const contest = await prisma.contest.findUnique({
      where: { id: contestId },
    });

    if (!contest) {
      return NextResponse.json(
        { error: "Concours non trouvé" },
        { status: 404 }
      );
    }

    // Vérifier que le concours est actif
    if (contest.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "Le concours n'est pas actif" },
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
    console.log("🎲 Participation avec blockchain via API:", {
      contestId,
      jerseyId,
      walletAddress,
      username,
    });
    console.log("🚀 Appel de participateInLotteryWithBlockchain...");

    const blockchainResult = await participateInLotteryWithBlockchain(
      contestId,
      jerseyId,
      walletAddress,
      username
    );

    if (!blockchainResult.success) {
      return NextResponse.json(
        { error: blockchainResult.error || "Erreur lors de la participation" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "Participation enregistrée avec succès",
      participation: blockchainResult.data?.participation,
      blockchainTxHash: blockchainResult.transactionHash,
    });
  } catch (error) {
    console.error("Erreur lors de la participation:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
