import { NextRequest, NextResponse } from "next/server";
import { verifyBlockchainEvent } from "@/lib/blockchain-actions";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ hash: string }> }
) {
  try {
    const { hash } = await params;

    if (!hash) {
      return NextResponse.json(
        { error: "Hash de transaction requis" },
        { status: 400 }
      );
    }

    // Vérifier l'événement blockchain
    const result = await verifyBlockchainEvent(hash);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erreur vérification blockchain:", error);
    return NextResponse.json(
      { 
        verified: false, 
        error: "Erreur lors de la vérification" 
      },
      { status: 500 }
    );
  }
}
