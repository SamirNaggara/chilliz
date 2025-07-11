"use server";

import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";

export async function createUser(wallet: string) {
  try {
    const user = await prisma.user.create({
      data: {
        wallet,
      },
    });
    revalidatePath("/");
    return { success: true, user };
  } catch (error) {
    console.error("Erreur création utilisateur:", error);
    return {
      success: false,
      error: "Erreur lors de la création de l'utilisateur",
    };
  }
}

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

export async function createScan(userId: string, jerseyId: string) {
  try {
    const scan = await prisma.scan.create({
      data: {
        userId,
        jerseyId,
      },
      include: {
        user: true,
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

export async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      include: {
        scans: {
          include: {
            jersey: true,
          },
        },
      },
    });
    return { success: true, users };
  } catch (error) {
    console.error("Erreur récupération utilisateurs:", error);
    return {
      success: false,
      error: "Erreur lors de la récupération des utilisateurs",
    };
  }
}

export async function getJerseys() {
  try {
    const jerseys = await prisma.jersey.findMany({
      include: {
        scans: {
          include: {
            user: true,
          },
        },
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
