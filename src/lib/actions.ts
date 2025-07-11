"use server";

import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";

export async function createJersey(id: string, name: string) {
  try {
    const jersey = await prisma.jersey.create({
      data: {
        id,
        name,
      },
    });
    revalidatePath("/");
    return { success: true, jersey };
  } catch (error) {
    console.error("Erreur création maillot:", error);
    return { success: false, error: "Erreur lors de la création du maillot" };
  }
}

export async function createScan(walletAddress: string, jerseyId: string) {
  try {
    const scan = await prisma.scan.create({
      data: {
        walletAddress,
        jerseyId,
      },
      include: {
        jersey: true,
      },
    });
    revalidatePath("/");
    return { success: true, scan };
  } catch (error) {
    console.error("Erreur création scan:", error);
    return { success: false, error: "Erreur lors de la création du scan" };
  }
}

export async function getJerseys() {
  try {
    const jerseys = await prisma.jersey.findMany({
      include: {
        scans: true,
      },
    });
    return { success: true, jerseys };
  } catch (error) {
    console.error("Erreur récupération maillots:", error);
    return {
      success: false,
      error: "Erreur lors de la récupération des maillots",
    };
  }
}

export async function getContests() {
  try {
    const contests = await prisma.contest.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return { success: true, contests };
  } catch (error) {
    console.error("Erreur récupération concours:", error);
    return {
      success: false,
      error: "Erreur lors de la récupération des concours",
    };
  }
}

export async function participateInContest(
  contestId: string,
  jerseyId: string,
  walletAddress: string
) {
  try {
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
      return {
        success: false,
        error: "Vous avez déjà participé avec ce maillot",
      };
    }

    // Créer la participation
    const participation = await prisma.participation.create({
      data: {
        contestId,
        jerseyId,
        walletAddress,
      },
    });

    revalidatePath("/");
    return { success: true, participation };
  } catch (error) {
    console.error("Erreur lors de la participation:", error);
    return {
      success: false,
      error: "Erreur lors de la participation",
    };
  }
}
