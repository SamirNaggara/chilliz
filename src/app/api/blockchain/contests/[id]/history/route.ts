import { NextRequest, NextResponse } from "next/server";
import { getContestBlockchainHistory } from "@/lib/blockchain-actions";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "ID de concours requis" },
        { status: 400 }
      );
    }

    // Récupérer l'historique blockchain du concours
    const history = await getContestBlockchainHistory(id);

    return NextResponse.json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error("Erreur récupération historique blockchain:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Erreur lors de la récupération de l'historique" 
      },
      { status: 500 }
    );
  }
}
