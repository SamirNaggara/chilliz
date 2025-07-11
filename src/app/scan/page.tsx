"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { formatAddress } from "@/lib/web3";

function ScanPageContent() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [jerseyId, setJerseyId] = useState("");
  const [isAuth, setIsAuth] = useState(false);

  const searchParams = useSearchParams();
  
  // Hooks Web3
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  // Lire les paramètres d'URL au chargement
  useEffect(() => {
    const jerseyIdParam = searchParams.get("jerseyId");
    const isAuthParam = searchParams.get("isAuth");
    
    if (jerseyIdParam) setJerseyId(jerseyIdParam);
    if (isAuthParam === "true") setIsAuth(true);
  }, [searchParams]);

  // Synchroniser l'état wallet avec les hooks wagmi
  useEffect(() => {
    if (isConnected && address) {
      setWalletConnected(true);
      setWalletAddress(address);
    } else {
      setWalletConnected(false);
      setWalletAddress("");
    }
  }, [isConnected, address]);

  // Auto-scan quand wallet est connecté et jerseyId disponible
  useEffect(() => {
    if (walletConnected && walletAddress && jerseyId && !isLoading) {
      handleAutoScan();
    }
  }, [walletConnected, walletAddress, jerseyId]);

  const handleAutoScan = async () => {
    setIsLoading(true);
    setMessage("⏳ Enregistrement du scan...");

    try {
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletAddress,
          jerseyId,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setMessage("✅ Maillot ajouté à ta collection !");
      } else {
        // Gestion des différents types d'erreurs
        if (result.error?.includes("déjà") || response.status === 409) {
          setMessage("⚠️ Vous avez déjà scanné ce maillot");
        } else if (result.error?.includes("minute") || result.error?.includes("trop tôt")) {
          setMessage("⏱️ Ce maillot vient d'être scanné, réessayez dans 1 minute");
        } else {
          setMessage("❌ Erreur lors de l'enregistrement du scan");
        }
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
      setMessage("🔌 Erreur de connexion au wallet");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectWallet = async (connector: any) => {
    try {
      await connect({ connector });
    } catch (error) {
      console.error("Erreur de connexion wallet:", error);
      setMessage("🔌 Erreur de connexion au wallet");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🔍 Scan Maillot
          </h1>
          <p className="text-gray-600">
            Scannez votre maillot pour l'ajouter à votre collection
          </p>
        </div>

        {/* Card principale */}
        <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6">
          {/* Informations du maillot */}
          {jerseyId && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <h3 className="font-semibold text-blue-900 mb-2">🏆 Maillot détecté</h3>
              <p className="text-blue-700 font-mono text-sm">ID: {jerseyId}</p>
            </div>
          )}

          {/* Section connexion wallet */}
          {isAuth && (
            <div className="space-y-4">
              {!walletConnected ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    🔐 Connexion requise
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Connectez votre wallet pour enregistrer ce scan
                  </p>
                  
                  <div className="space-y-2">
                    {connectors.map((connector) => (
                      <Button
                        key={connector.uid}
                        onClick={() => handleConnectWallet(connector)}
                        disabled={isPending}
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl"
                      >
                        {isPending ? (
                          <>
                            <span className="animate-spin mr-2">⏳</span>
                            Connexion...
                          </>
                        ) : (
                          <>🔗 Connecter {connector.name}</>
                        )}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="font-semibold text-green-700">Wallet connecté</span>
                    </div>
                    <p className="text-green-600 font-mono text-sm">
                      {formatAddress(walletAddress)}
                    </p>
                  </div>
                  
                  <Button
                    onClick={() => disconnect()}
                    variant="outline"
                    className="w-full text-red-600 border-red-200 hover:bg-red-50"
                  >
                    Déconnecter
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* État de chargement */}
          {isLoading && (
            <div className="text-center py-6">
              <div className="animate-spin text-4xl mb-2">⏳</div>
              <p className="text-gray-600">Enregistrement en cours...</p>
            </div>
          )}

          {/* Message de statut */}
          {message && !isLoading && (
            <div
              className={`p-4 rounded-xl text-center font-medium ${
                message.includes("✅") ? "bg-green-50 text-green-700 border border-green-200" :
                message.includes("⚠️") ? "bg-yellow-50 text-yellow-700 border border-yellow-200" :
                message.includes("⏱️") ? "bg-orange-50 text-orange-700 border border-orange-200" :
                message.includes("🔌") ? "bg-red-50 text-red-700 border border-red-200" :
                "bg-gray-50 text-gray-700 border border-gray-200"
              }`}
            >
              {message}
            </div>
          )}

          {/* Instructions */}
          {!jerseyId && (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-center">
              <p className="text-gray-600 text-sm">
                📱 Scannez le QR code ou tapez votre maillot NFC pour commencer
              </p>
            </div>
          )}

          {!isAuth && jerseyId && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-center">
              <p className="text-yellow-700 text-sm">
                ⚠️ Authentification requise pour enregistrer ce scan
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>🏆 POC Chiliz - Collection de Maillots</p>
        </div>
      </div>
    </div>
  );
}

function ScanPageFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-blue-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="text-center py-8">
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    </div>
  );
}

export default function ScanPage() {
  return (
    <Suspense fallback={<ScanPageFallback />}>
      <ScanPageContent />
    </Suspense>
  );
}
