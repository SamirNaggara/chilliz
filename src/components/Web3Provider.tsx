"use client";

import React, { useEffect } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "@/lib/web3";
import { useAccount, useReconnect } from "wagmi";

// Créer une instance du QueryClient
const queryClient = new QueryClient();

// Composant pour gérer la reconnexion automatique
function WalletReconnector() {
  const { isConnected } = useAccount();
  const { reconnect } = useReconnect();

  useEffect(() => {
    const handleReconnect = async () => {
      try {
        const wasConnected =
          localStorage.getItem("wallet-connected") === "true";
        const previousAddress = localStorage.getItem("wallet-address");

        if (wasConnected && previousAddress && !isConnected) {
          console.log("🔄 Tentative de reconnexion automatique...");
          await reconnect();
        }
      } catch (error) {
        console.log("❌ Reconnexion automatique échouée:", error);
        // Nettoyer le localStorage si la reconnexion échoue
        localStorage.removeItem("wallet-connected");
        localStorage.removeItem("wallet-address");
      }
    };

    // Délai pour laisser le temps à wagmi de s'initialiser
    const timeoutId = setTimeout(handleReconnect, 1000);

    return () => clearTimeout(timeoutId);
  }, [reconnect, isConnected]);

  // Sauvegarder l'état de connexion quand il change
  useEffect(() => {
    if (isConnected) {
      localStorage.setItem("wallet-connected", "true");
      console.log("✅ Connexion wallet sauvegardée");
    } else {
      localStorage.removeItem("wallet-connected");
      localStorage.removeItem("wallet-address");
      console.log("🚪 Connexion wallet supprimée");
    }
  }, [isConnected]);

  return null; // Ce composant ne rend rien, il gère juste la logique
}

interface Web3ProviderProps {
  children: React.ReactNode;
}

export function Web3Provider({ children }: Web3ProviderProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <WalletReconnector />
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default Web3Provider;
