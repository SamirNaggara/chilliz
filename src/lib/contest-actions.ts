"use server";

import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";

interface CreateContestData {
  name: string;
  description?: string;
  firstPrize: string;
  secondPrize: string;
  thirdPrize: string;
}

export async function createContest(data: CreateContestData) {
  try {
    // Validation des données
    if (
      !data.name ||
      !data.firstPrize ||
      !data.secondPrize ||
      !data.thirdPrize
    ) {
      return {
        success: false,
        error:
          "Tous les champs obligatoires doivent être remplis (nom et 3 prix)",
      };
    }

    // Création du concours
    const contest = await prisma.contest.create({
      data: {
        name: data.name,
        description: data.description || null,
        firstPrize: data.firstPrize,
        secondPrize: data.secondPrize,
        thirdPrize: data.thirdPrize,
        maxWinners: 3, // Fixé à 3 gagnants
        status: "PENDING", // Nouveau concours en attente
      },
    });

    // Revalidation des chemins pour forcer le rafraîchissement du cache
    revalidatePath("/admin/contests");
    revalidatePath("/");
    // Revalider toutes les pages de maillots pour que l'info des concours soit mise à jour
    revalidatePath("/jersey", "page");

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
