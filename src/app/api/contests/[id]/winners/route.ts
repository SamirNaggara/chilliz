import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { announceWinnersWithBlockchain } from "@/lib/blockchain-actions";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { winners } = await request.json();

    if (!winners || !Array.isArray(winners) || winners.length === 0) {
      return NextResponse.json(
        { error: "Liste des gagnants requise" },
        { status: 400 }
      );
    }

    // Vérifier que le concours existe et est actif
    const contest = await prisma.contest.findUnique({
      where: { id },
      include: {
        participations: true,
        winners: true,
      },
    });

    if (!contest) {
      return NextResponse.json(
        { error: "Concours non trouvé" },
        { status: 404 }
      );
    }

    if (contest.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "Le concours n'est plus actif" },
        { status: 400 }
      );
    }

    if (contest.winners.length > 0) {
      return NextResponse.json(
        { error: "Les gagnants ont déjà été sélectionnés pour ce concours" },
        { status: 400 }
      );
    }

    // Vérifier que tous les gagnants ont participé au concours
    const participantWalletAddresses = contest.participations.map(
      (p) => p.walletAddress
    );

    for (const winner of winners) {
      if (!participantWalletAddresses.includes(winner.walletAddress)) {
        return NextResponse.json(
          {
            error: `L'adresse ${winner.walletAddress} n'a pas participé au concours`,
          },
          { status: 400 }
        );
      }
    }

    // Vérifier qu'il n'y a pas de doublons dans les gagnants
    const winnerAddresses = winners.map((w) => w.walletAddress);
    const uniqueAddresses = new Set(winnerAddresses);
    if (uniqueAddresses.size !== winnerAddresses.length) {
      return NextResponse.json(
        { error: "Un participant ne peut pas gagner plusieurs fois" },
        { status: 400 }
      );
    }

    // Utiliser la fonction blockchain pour annoncer les gagnants
    const blockchainResult = await announceWinnersWithBlockchain(id, winners);

    if (blockchainResult.success) {
      return NextResponse.json({
        success: true,
        message: "Gagnants sélectionnés avec succès",
        winners: blockchainResult.data?.winners,
        blockchainEvents: blockchainResult.data?.blockchainEvents,
        explorerUrl: blockchainResult.explorerUrl,
      });
    } else {
      return NextResponse.json(
        { error: blockchainResult.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Erreur lors de la sélection des gagnants:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
