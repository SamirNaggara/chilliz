"use server";

import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";

interface CreateContestData {
  name: string;
  description?: string;
  startTime: string;
  endTime: string;
  firstPrize: string;
  secondPrize: string;
  thirdPrize: string;
}

export async function createContest(data: CreateContestData) {
  try {
    // Validation des données
    if (
      !data.name ||
      !data.startTime ||
      !data.endTime ||
      !data.firstPrize ||
      !data.secondPrize ||
      !data.thirdPrize
    ) {
      return {
        success: false,
        error:
          "Tous les champs obligatoires doivent être remplis (nom, dates et 3 prix)",
      };
    }

    // Validation des dates
    const startDate = new Date(data.startTime);
    const endDate = new Date(data.endTime);
    const now = new Date();

    // Permettre les concours qui commencent maintenant pour les tests
    if (startDate < now && startDate.getTime() < now.getTime() - 60000) {
      // 1 minute de tolérance
      return {
        success: false,
        error:
          "L'heure de début doit être dans le futur (ou maintenant pour les tests)",
      };
    }

    if (endDate <= startDate) {
      return {
        success: false,
        error: "L'heure de fin doit être après l'heure de début",
      };
    }

    // Création du concours
    const contest = await prisma.contest.create({
      data: {
        name: data.name,
        description: data.description || null,
        startedAt: startDate,
        endedAt: endDate,
        firstPrize: data.firstPrize,
        secondPrize: data.secondPrize,
        thirdPrize: data.thirdPrize,
        maxWinners: 3, // Fixé à 3 gagnants
      },
    });

    // Revalidation des chemins pour forcer le rafraîchissement du cache
    revalidatePath("/admin/contests");
    revalidatePath("/");

    return {
      success: true,
      contest,
    };
  } catch (error) {
    console.error("Erreur lors de la création du concours:", error);
    return {
      success: false,
      error: "Erreur interne du serveur",
    };
  }
}

export async function getContests() {
  try {
    const contests = await prisma.contest.findMany({
      include: {
        participations: {
          include: {
            jersey: true,
          },
        },
        winners: {
          include: {},
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      contests,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des concours:", error);
    return {
      success: false,
      error: "Erreur lors de la récupération des concours",
    };
  }
}
