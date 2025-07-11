"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { formatAddress, detectMetaMask } from "@/lib/web3";
import { useWeb3 } from "@/hooks/useWeb3";
import { Zap, Coins, CheckCircle, AlertCircle, Trophy } from "lucide-react";

interface JerseyWalletConnectorProps {
  variant?: "header" | "banner" | "compact";
}

export function JerseyWalletConnector({ 
  variant = "header" 
}: JerseyWalletConnectorProps) {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { 
    hasEnoughPsgTokens, 
    psgDiscountPercentage, 
    psgTokenBalance,
    disconnectWallet 
  } = useWeb3();

  const [metaMaskInfo, setMetaMaskInfo] = useState({
    isInstalled: false,
    isAvailable: false
  });

  useEffect(() => {
    const info = detectMetaMask();
    setMetaMaskInfo(info);
  }, []);

  const handleConnectWallet = async (connector: any) => {
    try {
      await connect({ connector });
    } catch (error) {
      console.error("Erreur de connexion wallet:", error);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet(); // Utiliser notre fonction personnalisée
    disconnect();
  };

  // Style compact pour la sticky bar
  if (variant === "compact") {
    if (isConnected && address) {
      return (
        <div className="flex items-center gap-2">
          {psgTokenBalance !== null && (
            <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs">
              <Coins className="w-3 h-3" />
              <span className="font-mono font-medium">
                {Number(psgTokenBalance.balance / BigInt(10 ** psgTokenBalance.decimals)).toLocaleString()} {psgTokenBalance.symbol}
              </span>
              {hasEnoughPsgTokens && (
                <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs px-1 py-0 ml-1">
                  -{psgDiscountPercentage}%
                </Badge>
              )}
            </div>
          )}
        </div>
      );
    }
    return null; // Pas d'affichage compact si pas connecté
  }

  // Style pour le header
  if (variant === "header") {
    if (isConnected && address) {
      return (
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm">
            <CheckCircle className="w-4 h-4" />
            <span className="font-medium">Connecté</span>
            <span className="font-mono">{formatAddress(address)}</span>
            {hasEnoughPsgTokens && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 ml-2">
                <Trophy className="w-3 h-3 mr-1" />
                PSG -{psgDiscountPercentage}%
              </Badge>
            )}
          </div>
          <Button
            onClick={handleDisconnect}
            variant="outline"
            size="sm"
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            Déconnecter
          </Button>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        {!metaMaskInfo.isInstalled && (
          <div className="hidden md:flex items-center gap-1 text-orange-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>MetaMask requis</span>
          </div>
        )}
        {metaMaskInfo.isInstalled ? (
          <Button 
            onClick={() => {
              const metamaskConnector = connectors.find(
                c => c.name === "MetaMask" || c.name === "Injected"
              );
              if (metamaskConnector) handleConnectWallet(metamaskConnector);
            }}
            disabled={isPending}
            className="bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 text-white font-semibold"
          >
            {isPending ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Connexion...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Connecter Wallet
              </>
            )}
          </Button>
        ) : (
          <Button 
            onClick={() => window.open("https://metamask.io/", "_blank")}
            variant="outline"
            className="border-orange-300 text-orange-600 hover:bg-orange-50"
          >
            <Zap className="w-4 h-4 mr-2" />
            Installer MetaMask
          </Button>
        )}
      </div>
    );
  }

  // Style pour la bannière du shop
  if (variant === "banner") {
    if (isConnected && address) {
      return (
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-6 mb-8 text-white">
          <div className="flex items-center justify-center gap-4 mb-4">
            <CheckCircle className="w-8 h-8" />
            <div>
              <h3 className="text-xl font-bold">
                Wallet Connecté !
              </h3>
              <p className="text-sm opacity-90">
                Profitez de vos avantages exclusifs Chilliz
              </p>
              <p className="text-sm font-mono mt-1">
                {formatAddress(address)}
              </p>
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            <Button className="bg-white text-green-600 hover:bg-gray-100 font-semibold">
              <Coins className="w-4 h-4 mr-2" />
              Voir mes CHZ
            </Button>
            <Button
              onClick={() => disconnect()}
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-green-600 transition-colors"
            >
              Déconnecter
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-gradient-to-r from-red-600 to-blue-600 rounded-2xl p-6 mb-8 text-white">
        <div className="flex items-center justify-center gap-4 mb-4">
          <Coins className="w-8 h-8" />
          <div>
            <h3 className="text-xl font-bold">
              Connectez votre Wallet
            </h3>
            <p className="text-sm opacity-90">
              Débloquez des réductions exclusives et des récompenses Chilliz
            </p>
          </div>
        </div>
        
        {!metaMaskInfo.isInstalled ? (
          <div className="text-center">
            <p className="text-sm opacity-90 mb-3">
              MetaMask n'est pas détecté sur votre navigateur
            </p>
            <Button 
              onClick={() => window.open("https://metamask.io/", "_blank")}
              className="bg-white text-red-600 hover:bg-gray-100 font-semibold"
            >
              <Zap className="w-4 h-4 mr-2" />
              Installer MetaMask
            </Button>
          </div>
        ) : (
          <div className="flex gap-3 justify-center">
            {(() => {
              const metamaskConnector = connectors.find(
                connector => connector.name === "MetaMask" || connector.name === "Injected"
              );
              if (!metamaskConnector) return null;
              
              return (
                <Button
                  onClick={() => handleConnectWallet(metamaskConnector)}
                  disabled={isPending}
                  className="bg-white text-red-600 hover:bg-gray-100 font-semibold"
                >
                  {isPending ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Connexion...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      🦊 Connecter MetaMask
                    </>
                  )}
                </Button>
              );
            })()}
          </div>
        )}
      </div>
    );
  }

  return null;
}
