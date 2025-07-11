import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contestId, jerseyId, walletAddress } = body;

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

    // On ne gère plus le cooldown si le champ n'existe pas

    // Vérifier si l'utilisateur a déjà participé avec ce maillot
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

    // Créer la participation
    const participation = await prisma.participation.create({
      data: {
        contestId,
        jerseyId,
        walletAddress,
      },
    });

    return NextResponse.json(
      {
        message: "Participation enregistrée avec succès",
        participation,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur lors de la participation:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
