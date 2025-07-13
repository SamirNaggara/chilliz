"use server";

import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";

export async function getJerseyDexEntries(walletAddress: string) {
  try {
    const entries = await prisma.jerseyDex.findMany({
      where: { walletAddress: walletAddress.toLowerCase() },
      include: {
        jersey: {
          select: {
            id: true,
            name: true,
            createdAt: true,
            assetUrl: true,
            assetType: true,
          },
        },
      },
      orderBy: { addedAt: "desc" },
    });

    console.log(
      "📊 getJerseyDexEntries - Data from DB:",
      entries.map((entry) => ({
        jerseyId: entry.jerseyId,
        jersey: entry.jersey,
      }))
    );

    return {
      success: true,
      entries,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération du Jerseydex:", error);
    return {
      success: false,
      error: "Erreur lors de la récupération du Jerseydex",
    };
  }
}

export async function addJerseyToDex(walletAddress: string, jerseyId: string) {
  try {
    // Vérifier si déjà ajouté
    const exists = await prisma.jerseyDex.findUnique({
      where: {
        wallet_jersey_unique: {
          walletAddress: walletAddress.toLowerCase(),
          jerseyId,
        },
      },
    });

    if (exists) {
      return {
        success: false,
        message: "Déjà dans la collection",
      };
    }

    // Ajouter à la collection
    const entry = await prisma.jerseyDex.create({
      data: {
        walletAddress: walletAddress.toLowerCase(),
        jerseyId,
      },
      include: {
        jersey: {
          select: {
            id: true,
            name: true,
            createdAt: true,
            assetUrl: true,
            assetType: true,
          },
        },
      },
    });

    // Revalidation des chemins pour forcer le rafraîchissement du cache
    revalidatePath("/jerseydex");
    revalidatePath("/");

    return {
      success: true,
      entry,
    };
  } catch (error) {
    console.error("Erreur lors de l'ajout au Jerseydex:", error);
    return {
      success: false,
      error: "Erreur lors de l'ajout au Jerseydex",
    };
  }
}

export async function removeJerseyFromDex(
  walletAddress: string,
  jerseyId: string
) {
  try {
    const deleted = await prisma.jerseyDex.deleteMany({
      where: {
        walletAddress: walletAddress.toLowerCase(),
        jerseyId,
      },
    });

    // Revalidation des chemins pour forcer le rafraîchissement du cache
    revalidatePath("/jerseydex");
    revalidatePath("/");

    return {
      success: true,
      deleted: deleted.count,
    };
  } catch (error) {
    console.error("Erreur lors de la suppression du Jerseydex:", error);
    return {
      success: false,
      error: "Erreur lors de la suppression du Jerseydex",
    };
  }
}
