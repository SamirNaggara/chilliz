import { NextResponse } from "next/server";

// API pour tester la connexion wallet sur mobile
export async function GET() {
  return NextResponse.json({
    message: "Test API pour connexion wallet mobile",
    tips: {
      mobile: {
        metamask: {
          deepLink: "metamask://",
          appStore: {
            ios: "https://apps.apple.com/app/metamask/id1438144202",
            android: "https://play.google.com/store/apps/details?id=io.metamask"
          },
          webLink: "https://metamask.app.link/dapp/"
        },
        walletConnect: {
          supported: true,
          projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || "non-configuré"
        }
      },
      troubleshooting: [
        "Sur mobile, MetaMask doit être installé comme app native",
        "WalletConnect fonctionne avec plus de wallets mobiles",
        "Certains navigateurs mobiles bloquent les popups",
        "Essayez d'ouvrir le site directement dans MetaMask mobile"
      ]
    }
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userAgent, wallet, error } = body;
    
    console.log('📱 Rapport de connexion mobile:', {
      userAgent,
      wallet,
      error,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json({
      success: true,
      message: "Rapport reçu"
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Erreur lors du traitement du rapport"
    }, { status: 500 });
  }
}
