"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAccount, useConnect, useDisconnect, type Connector } from "wagmi";
import { 
  formatAddress, 
  detectMetaMask, 
  isMobileDevice, 
  createMetaMaskDeepLink, 
  connectMetaMaskMobile,
  getMobileMetaMaskError,
  isProductionEnvironment
} from "@/lib/web3";
import { useWeb3 } from "@/hooks/useWeb3";
import {
  Zap,
  Coins,
  CheckCircle,
  ChevronDown,
  Wallet,
  ShoppingCart,
} from "lucide-react";

interface JerseyWalletConnectorProps {
  variant?: "header" | "banner" | "compact";
}

export function JerseyWalletConnector({
  variant = "header",
}: JerseyWalletConnectorProps) {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const {
    hasEnoughPsgTokens,
    psgDiscountPercentage,
    psgTokenBalance,
    disconnectWallet,
  } = useWeb3();

  const [metaMaskInfo, setMetaMaskInfo] = useState({
    isInstalled: false,
    isAvailable: false,
  });

  const [showDropdown, setShowDropdown] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isProduction, setIsProduction] = useState(false);

  useEffect(() => {
    setMounted(true);
    const info = detectMetaMask();
    setMetaMaskInfo(info);
    setIsMobile(isMobileDevice());
    setIsProduction(isProductionEnvironment());
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".wallet-dropdown")) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const handleConnectWallet = async (connector: Connector) => {
    try {
      // Sur mobile, utiliser la logique spéciale pour MetaMask
      if (isMobile && (connector.name === "MetaMask" || connector.name === "Injected")) {
        // Si MetaMask n'est pas installé sur mobile, utiliser deep link
        if (!metaMaskInfo.isInstalled) {
          const deepLink = createMetaMaskDeepLink();
          console.log("🔗 Redirection vers MetaMask mobile:", deepLink);
          window.location.href = deepLink;
          return;
        }
        
        // Si MetaMask est installé, essayer la connexion directe
        try {
          await connectMetaMaskMobile();
        } catch (error) {
          console.error("Erreur connexion directe mobile:", error);
          // Fallback vers deep link en cas d'erreur
          const deepLink = createMetaMaskDeepLink();
          window.location.href = deepLink;
          return;
        }
      }
      
      // Connexion standard pour desktop ou autres wallets
      await connect({ connector });
    } catch (error) {
      console.error("Erreur de connexion wallet:", error);
      
      // Sur mobile, toujours essayer le deep link en cas d'erreur
      if (isMobile && (connector.name === "MetaMask" || connector.name === "Injected")) {
        const deepLink = createMetaMaskDeepLink();
        console.log("🔗 Fallback deep link:", deepLink);
        window.location.href = deepLink;
      }
    }
  };

  const handleDisconnect = () => {
    disconnectWallet?.();
    disconnect();
    setShowDropdown(false);
  };

  const handleBuyCHZ = () => {
    // Redirect to Binance to buy PSG Fan Tokens (CHZ)
    window.open("https://www.binance.com/en/trade/PSG_USDT", "_blank");
    setShowDropdown(false);
  };

  // Style compact for sticky bar
  if (variant === "compact") {
    if (isConnected && address) {
      return (
        <div className="flex items-center gap-2">
          {psgTokenBalance !== null && (
            <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs">
              <Coins className="w-3 h-3" />
              <span className="font-mono font-medium">
                {Number(
                  psgTokenBalance.balance /
                    BigInt(10 ** psgTokenBalance.decimals)
                ).toLocaleString()}{" "}
                {psgTokenBalance.symbol}
              </span>
              {hasEnoughPsgTokens && (
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-700 text-xs px-1 py-0 ml-1"
                >
                  -{psgDiscountPercentage}%
                </Badge>
              )}
            </div>
          )}
        </div>
      );
    }
    return null;
  }

  // Style for header
  if (variant === "header") {
    if (isConnected && address) {
      return (
        <div className="relative">
          <Button
            onClick={() => setShowDropdown(!showDropdown)}
            variant="outline"
            className="flex items-center gap-2 bg-white/90 backdrop-blur-sm border-gray-200 hover:bg-gray-50"
          >
            <Coins className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-gray-700">
              {psgTokenBalance !== null
                ? `${Number(
                    psgTokenBalance.balance /
                      BigInt(10 ** psgTokenBalance.decimals)
                  ).toLocaleString()} CHZ`
                : "CHZ"}
            </span>
            {hasEnoughPsgTokens && (
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-700 text-xs"
              >
                -{psgDiscountPercentage}%
              </Badge>
            )}
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </Button>

          {showDropdown && (
            <div className="wallet-dropdown absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <div className="text-sm text-gray-600">Wallet</div>
                <div className="text-xs text-gray-500 font-mono">
                  {formatAddress(address)}
                </div>
              </div>

              <Button
                onClick={handleBuyCHZ}
                variant="ghost"
                className="w-full justify-start px-4 py-2 text-sm hover:bg-gray-50"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Buy CHZ
              </Button>

              <Button
                onClick={handleDisconnect}
                variant="ghost"
                className="w-full justify-start px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Disconnect
              </Button>
            </div>
          )}
        </div>
      );
    }

    // Ne pas rendre tant que le composant n'est pas monté côté client
    if (!mounted) {
      return null;
    }

    return (
      <div className="flex items-center gap-2">
        {metaMaskInfo.isInstalled || isMobile ? (
          <Button
            onClick={() => {
              const metamaskConnector = connectors.find(
                (c) => c.name === "MetaMask" || c.name === "Injected"
              );
              if (metamaskConnector) handleConnectWallet(metamaskConnector);
            }}
            disabled={isPending}
            className="bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 text-white font-semibold"
          >
            {isPending ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Connecting...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                {isMobile && !metaMaskInfo.isInstalled ? "Open MetaMask" : "Connect Wallet"}
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={() => {
              if (isMobile) {
                // Sur mobile, rediriger vers l'App Store/Play Store
                const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
                const storeUrl = isIOS 
                  ? "https://apps.apple.com/app/metamask/id1438144202"
                  : "https://play.google.com/store/apps/details?id=io.metamask";
                window.open(storeUrl, "_blank");
              } else {
                // Sur desktop, aller sur le site MetaMask
                window.open("https://metamask.io/", "_blank");
              }
            }}
            variant="outline"
            className="border-orange-300 text-orange-600 hover:bg-orange-50"
          >
            <Zap className="w-4 h-4 mr-2" />
            {isMobile ? "Install MetaMask App" : "Install MetaMask"}
          </Button>
        )}
        
        {isMobile && !isProduction && (
          <div className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
            ⚠️ HTTPS requis pour mobile
          </div>
        )}
      </div>
    );
  }

  // Style for shop banner
  if (variant === "banner") {
    if (isConnected && address) {
      return (
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-6 mb-8 text-white">
          <div className="flex items-center justify-center gap-4 mb-4">
            <CheckCircle className="w-8 h-8" />
            <div>
              <h3 className="text-xl font-bold">Wallet Connected!</h3>
              <p className="text-sm opacity-90">
                Enjoy your exclusive Chilliz benefits
              </p>
              <p className="text-sm font-mono mt-1">{formatAddress(address)}</p>
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            <Button className="bg-white text-green-600 hover:bg-gray-100 font-semibold">
              <Coins className="w-4 h-4 mr-2" />
              View my CHZ
            </Button>
            <Button
              onClick={handleDisconnect}
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-green-600 transition-colors"
            >
              Disconnect
            </Button>
          </div>
        </div>
      );
    }

    // Ne pas rendre tant que le composant n'est pas monté côté client
    if (!mounted) {
      return null;
    }

    return (
      <div className="bg-gradient-to-r from-red-600 to-blue-600 rounded-2xl p-6 mb-8 text-white">
        <div className="flex items-center justify-center gap-4 mb-4">
          <Zap className="w-8 h-8" />
          <div>
            <h3 className="text-xl font-bold">Connect Your Wallet</h3>
            <p className="text-sm opacity-90">
              Get exclusive Chilliz benefits and discounts
            </p>
          </div>
        </div>
        <div className="flex gap-3 justify-center">
          {metaMaskInfo.isInstalled || isMobile ? (
            <Button
              onClick={() => {
                const metamaskConnector = connectors.find(
                  (c) => c.name === "MetaMask" || c.name === "Injected"
                );
                if (metamaskConnector) handleConnectWallet(metamaskConnector);
              }}
              disabled={isPending}
              className="bg-white text-red-600 hover:bg-gray-100 font-semibold"
            >
              {isPending ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Connecting...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  {isMobile && !metaMaskInfo.isInstalled ? "Open MetaMask" : "Connect Wallet"}
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={() => {
                if (isMobile) {
                  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
                  const storeUrl = isIOS 
                    ? "https://apps.apple.com/app/metamask/id1438144202"
                    : "https://play.google.com/store/apps/details?id=io.metamask";
                  window.open(storeUrl, "_blank");
                } else {
                  window.open("https://metamask.io/", "_blank");
                }
              }}
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-red-600 transition-colors"
            >
              <Zap className="w-4 h-4 mr-2" />
              {isMobile ? "Install MetaMask App" : "Install MetaMask"}
            </Button>
          )}
        </div>
        
        {isMobile && !isProduction && (
          <div className="text-center mt-4">
            <div className="text-xs text-yellow-200 bg-yellow-600/20 px-3 py-2 rounded-lg">
              ⚠️ MetaMask mobile requiert HTTPS en production
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}
