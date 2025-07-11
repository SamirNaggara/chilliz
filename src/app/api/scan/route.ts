import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, jerseyId } = await request.json();

    if (!walletAddress || !jerseyId) {
      return NextResponse.json(
        { success: false, error: "Wallet address et jersey ID requis" },
        { status: 400 }
      );
    }

    // Vérifier si le maillot existe
    const jersey = await prisma.jersey.findUnique({
      where: { id: jerseyId },
    });

    if (!jersey) {
      return NextResponse.json(
        { success: false, error: "Maillot non trouvé" },
        { status: 404 }
      );
    }

    // Vérifier si l'utilisateur a déjà scanné ce maillot
    const existingScan = await prisma.scan.findFirst({
      where: {
        walletAddress: walletAddress.toLowerCase(),
        jerseyId: jerseyId,
      },
    });

    if (existingScan) {
      return NextResponse.json(
        { success: false, error: "Vous avez déjà scanné ce maillot" },
        { status: 409 }
      );
    }

    // Vérifier les scans récents pour ce maillot (limite de temps)
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    const recentScan = await prisma.scan.findFirst({
      where: {
        jerseyId: jerseyId,
        scannedAt: {
          gte: oneMinuteAgo,
        },
      },
    });

    if (recentScan) {
      return NextResponse.json(
        {
          success: false,
          error: "Ce maillot vient d'être scanné, réessayez dans 1 minute",
        },
        { status: 429 }
      );
    }

    // Créer le scan
    const scan = await prisma.scan.create({
      data: {
        walletAddress: walletAddress.toLowerCase(),
        jerseyId: jerseyId,
      },
      include: {
        jersey: true,
      },
    });

    return NextResponse.json({
      success: true,
      scan,
      message: "Maillot ajouté à ta collection !",
    });
  } catch (error) {
    console.error("Erreur API scan:", error);
    return NextResponse.json(
      { success: false, error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
