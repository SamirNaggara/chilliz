import { NextRequest, NextResponse } from "next/server";
import { inspectLotteryTransaction } from "@/lib/blockchain-inspector";

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

    // Inspecter la transaction
    const inspection = await inspectLotteryTransaction(hash);

    if (!inspection) {
      return NextResponse.json(
        { error: "Transaction non trouvée ou données invalides" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: inspection,
      message: "Transaction trouvée et vérifiée",
    });
  } catch (error) {
    console.error("Erreur inspection transaction:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Erreur lors de l'inspection" 
      },
      { status: 500 }
    );
  }
}
