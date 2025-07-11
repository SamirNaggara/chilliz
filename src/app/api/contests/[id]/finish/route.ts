import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    // Marquer le concours comme terminé
    const updatedContest = await prisma.contest.update({
      where: { id },
      data: {
        status: "FINISHED",
        endedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: "Concours terminé avec succès",
      contest: updatedContest,
    });
  } catch (error) {
    console.error("Erreur lors de la finalisation du concours:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
