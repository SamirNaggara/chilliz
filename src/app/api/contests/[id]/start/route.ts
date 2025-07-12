import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Vérifier que le concours existe
    const contest = await prisma.contest.findUnique({
      where: { id },
    });

    if (!contest) {
      return NextResponse.json(
        { error: "Concours non trouvé" },
        { status: 404 }
      );
    }

    if (contest.status !== "PENDING") {
      return NextResponse.json(
        { error: "Le concours n'est pas en attente de démarrage" },
        { status: 400 }
      );
    }

    // Vérifier qu'il n'y a pas déjà un concours actif
    const activeContest = await prisma.contest.findFirst({
      where: {
        status: "ACTIVE",
      },
    });

    if (activeContest) {
      return NextResponse.json(
        { error: "Il y a déjà un concours actif en cours" },
        { status: 400 }
      );
    }

    // Démarrer le concours
    const updatedContest = await prisma.contest.update({
      where: { id },
      data: {
        status: "ACTIVE",
      },
    });

    return NextResponse.json({
      message: "Concours démarré avec succès",
      contest: updatedContest,
    });
  } catch (error) {
    console.error("Erreur lors du démarrage du concours:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
