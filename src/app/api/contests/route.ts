import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, firstPrize, secondPrize, thirdPrize } = body;

    // Validation des données
    if (!name || !firstPrize || !secondPrize || !thirdPrize) {
      return NextResponse.json(
        {
          error:
            "Tous les champs obligatoires doivent être remplis (nom et 3 prix)",
        },
        { status: 400 }
      );
    }

    // Création du concours
    const contest = await prisma.contest.create({
      data: {
        name,
        description: description || null,
        firstPrize,
        secondPrize,
        thirdPrize,
        maxWinners: 3, // Fixé à 3 gagnants
        status: "PENDING", // Nouveau concours en attente
      },
    });

    // Revalidation des chemins pour forcer le rafraîchissement du cache
    revalidatePath("/admin/contests");
    revalidatePath("/");

    return NextResponse.json({
      message: "Concours créé avec succès",
      contest,
    });
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
