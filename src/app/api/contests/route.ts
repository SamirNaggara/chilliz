import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      startTime,
      endTime,
      firstPrize,
      secondPrize,
      thirdPrize,
    } = body;

    // Validation des données
    if (
      !name ||
      !startTime ||
      !endTime ||
      !firstPrize ||
      !secondPrize ||
      !thirdPrize
    ) {
      return NextResponse.json(
        {
          error:
            "Tous les champs obligatoires doivent être remplis (nom, dates et 3 prix)",
        },
        { status: 400 }
      );
    }

    // Validation des dates
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    const now = new Date();

    // Permettre les concours qui commencent maintenant pour les tests
    if (startDate < now && startDate.getTime() < now.getTime() - 60000) {
      // 1 minute de tolérance
      return NextResponse.json(
        {
          error:
            "L'heure de début doit être dans le futur (ou maintenant pour les tests)",
        },
        { status: 400 }
      );
    }

    if (endDate <= startDate) {
      return NextResponse.json(
        { error: "L'heure de fin doit être après l'heure de début" },
        { status: 400 }
      );
    }

    // Création du concours
    const contest = await prisma.contest.create({
      data: {
        name,
        description: description || null,
        startedAt: startDate,
        endedAt: endDate,
        firstPrize,
        secondPrize,
        thirdPrize,
        maxWinners: 3, // Fixé à 3 gagnants
      },
    });

    // Revalidation des chemins pour forcer le rafraîchissement du cache
    revalidatePath("/admin/contests");
    revalidatePath("/");

    return NextResponse.json(
      {
        message: "Concours créé avec succès",
        contest,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur lors de la création du concours:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const contests = await prisma.contest.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(contests);
  } catch (error) {
    console.error("Erreur lors de la récupération des concours:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
