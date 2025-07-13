import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { participateWithCoSignature, type ParticipationSignature } from "@/lib/co-signature-blockchain";

export async function POST(request: NextRequest) {
  console.log("🤝 API PARTICIPATION AVEC CO-SIGNATURE");

  try {
    const body = await request.json();
    const { contestId, jerseyId, walletAddress, username, timestamp, signature, messageHash } = body;

    console.log("📥 Données reçues:", {
      contestId,
      jerseyId,
      walletAddress,
      username,
      timestamp,
      signature: signature ? `${signature.slice(0, 10)}...` : 'non fournie',
      messageHash: messageHash ? `${messageHash.slice(0, 10)}...` : 'non fourni'
    });

    // Validation des données
    if (!contestId || !jerseyId || !walletAddress || !signature || !messageHash || !timestamp) {
      return NextResponse.json(
        { error: "Tous les champs sont requis pour la co-signature" },
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

    if (contest.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "Le concours n'est pas actif" },
        { status: 400 }
      );
    }

    // Vérifier si la participation existe déjà
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
      return NextResponse.json(
        { error: "Vous avez déjà participé avec ce maillot" },
        { status: 400 }
      );
    }

    // Vérifier que le maillot existe
    const jersey = await prisma.jersey.findUnique({
      where: { id: jerseyId },
    });

    if (!jersey) {
      return NextResponse.json(
        { error: "Maillot non trouvé" },
        { status: 404 }
      );
    }

    // Préparer la signature pour vérification
    const clientSignature: ParticipationSignature = {
      contestId,
      jerseyId,
      walletAddress,
      username,
      timestamp,
      signature,
      messageHash
    };

    console.log("🔐 Traitement de la co-signature...");

    // Effectuer la co-signature blockchain
    const blockchainResult = await participateWithCoSignature(clientSignature);

    if (!blockchainResult.success) {
      console.error("❌ Erreur co-signature blockchain:", blockchainResult.error);
      return NextResponse.json(
        { error: blockchainResult.error || "Erreur lors de la co-signature" },
        { status: 400 }
      );
    }

    console.log("✅ Co-signature blockchain réussie:", blockchainResult.transactionHash);

    // Enregistrer en base de données avec les informations de co-signature
    const participation = await prisma.participation.create({
      data: {
        contestId,
        jerseyId,
        walletAddress,
        username,
        // Champs blockchain avec co-signature
        blockchainTxHash: blockchainResult.transactionHash,
        blockchainTimestamp: new Date(),
        blockchainConfirmed: true,
        blockchainData: {
          type: 'LOTTERY_PARTICIPATION_CO_SIGNED',
          contestId,
          participantAddress: walletAddress,
          jerseyId,
          username,
          timestamp,
          clientSignature: signature,
          serverSigner: blockchainResult.data?.serverSigner,
          coSignedAt: Math.floor(Date.now() / 1000),
          explorerUrl: blockchainResult.explorerUrl
        }
      },
    });

    console.log("💾 Participation enregistrée en base:", participation.id);

    return NextResponse.json({
      success: true,
      message: "Participation enregistrée avec co-signature",
      participationId: participation.id,
      transactionHash: blockchainResult.transactionHash,
      explorerUrl: blockchainResult.explorerUrl,
      clientSignature: signature.slice(0, 10) + '...',
      serverSigner: blockchainResult.data?.serverSigner
    });

  } catch (error) {
    console.error("❌ Erreur lors de la participation avec co-signature:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
