import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/jerseydex?wallet=0x...
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const wallet = searchParams.get("wallet");
  if (!wallet) {
    return NextResponse.json({ error: "wallet manquant" }, { status: 400 });
  }
  const entries = await prisma.jerseyDex.findMany({
    where: { walletAddress: wallet.toLowerCase() },
    include: { jersey: true },
    orderBy: { addedAt: "desc" },
  });
  return NextResponse.json({ success: true, entries });
}

// POST /api/jerseydex { walletAddress, jerseyId }
export async function POST(request: NextRequest) {
  try {
    const { walletAddress, jerseyId } = await request.json();
    if (!walletAddress || !jerseyId) {
      return NextResponse.json(
        { error: "walletAddress et jerseyId requis" },
        { status: 400 }
      );
    }
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
      return NextResponse.json({
        success: false,
        message: "Déjà dans la collection",
      });
    }
    // Ajouter à la collection
    const entry = await prisma.jerseyDex.create({
      data: { walletAddress: walletAddress.toLowerCase(), jerseyId },
    });
    return NextResponse.json({ success: true, entry });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
