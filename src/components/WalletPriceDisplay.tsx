"use client";

import { useWeb3 } from "@/hooks/useWeb3";
import { Badge } from "@/components/ui/badge";
import { Coins, Trophy, Zap } from "lucide-react";

interface WalletPriceDisplayProps {
  originalPrice: number;
  discountPercentage: number;
  chzPrice: number;
  currency?: string;
}

export function WalletPriceDisplay({ 
  originalPrice, 
  discountPercentage, 
  chzPrice,
  currency = "€"
}: WalletPriceDisplayProps) {
  const { 
    isConnected, 
    hasEnoughPsgTokens, 
    psgDiscountPercentage,
    psgTokenBalance,
    isCheckingPsgToken 
  } = useWeb3();
  
  // Calculer la réduction totale (wallet + PSG tokens)
  const totalDiscountPercentage = isConnected 
    ? discountPercentage + (hasEnoughPsgTokens ? psgDiscountPercentage : 0)
    : 0;
  
  const discountedPrice = originalPrice * (1 - totalDiscountPercentage / 100);
  const walletDiscount = originalPrice * (1 - discountPercentage / 100);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <span className={`text-2xl font-bold ${
            isConnected ? "text-green-600" : "text-gray-600"
          }`}>
            {isConnected ? Math.round(discountedPrice) : originalPrice}{currency}
          </span>
          {isConnected && totalDiscountPercentage > 0 && (
            <span className="text-sm text-gray-500 line-through ml-2">
              {originalPrice}{currency}
            </span>
          )}
          {!isConnected && (
            <Badge className="ml-2 bg-orange-100 text-orange-700 text-xs">
              -{discountPercentage}% avec wallet
            </Badge>
          )}
        </div>
        <div className="text-right">
          <div className={`text-sm font-semibold ${
            isConnected ? "text-green-600" : "text-blue-600"
          }`}>
            {isConnected && <Coins className="w-3 h-3 inline mr-1" />}
            {chzPrice} CHZ
          </div>
          <div className="text-xs text-gray-500">
            {isConnected ? "disponible" : "avec wallet"}
          </div>
        </div>
      </div>

      {/* Détails des réductions */}
      {isConnected && (
        <div className="space-y-2">
          {/* Réduction wallet de base */}
          <div className="flex items-center gap-2 text-sm">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              <Zap className="w-3 h-3 mr-1" />
              -{discountPercentage}% Wallet
            </Badge>
            <span className="text-gray-600">
              {Math.round(walletDiscount)}{currency} 
              <span className="text-xs ml-1">
                (économie: {Math.round(originalPrice - walletDiscount)}{currency})
              </span>
            </span>
          </div>

          {/* Réduction PSG tokens */}
          {isCheckingPsgToken ? (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="animate-spin w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full" />
              <span>Vérification tokens PSG...</span>
            </div>
          ) : hasEnoughPsgTokens ? (
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                <Trophy className="w-3 h-3 mr-1" />
                -{psgDiscountPercentage}% PSG Fan
              </Badge>
              <span className="text-gray-600">
                Réduction supplémentaire: {Math.round(walletDiscount - discountedPrice)}{currency}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Trophy className="w-3 h-3" />
              <span>
                Obtenez des $PSG tokens pour plus de réductions
                {psgTokenBalance && (
                  <span className="ml-1">
                    ({Number(psgTokenBalance.balance) / 1e18}/{Number(psgTokenBalance.minimumForDiscount) / 1e18} $PSG)
                  </span>
                )}
              </span>
            </div>
          )}

          {/* Total des économies */}
          {totalDiscountPercentage > discountPercentage && (
            <div className="p-2 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 text-sm font-medium text-green-700">
                <Trophy className="w-4 h-4" />
                <span>
                  Total économisé: {Math.round(originalPrice - discountedPrice)}{currency} 
                  ({totalDiscountPercentage}% de réduction)
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
