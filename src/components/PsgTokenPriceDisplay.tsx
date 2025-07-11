"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Coins, Zap, Trophy } from "lucide-react";
import { useWeb3 } from "@/hooks/useWeb3";

interface PsgTokenPriceDisplayProps {
  originalPrice: number;
  currency?: string;
  chzPrice?: number;
  className?: string;
}

export function PsgTokenPriceDisplay({ 
  originalPrice, 
  currency = "€",
  chzPrice,
  className = ""
}: PsgTokenPriceDisplayProps) {
  const { 
    isConnected, 
    psgTokenBalance, 
    isCheckingPsgToken, 
    hasEnoughPsgTokens,
    psgDiscountPercentage 
  } = useWeb3();

  const [discountedPrice, setDiscountedPrice] = useState(originalPrice);

  useEffect(() => {
    if (hasEnoughPsgTokens && psgDiscountPercentage > 0) {
      const newPrice = originalPrice * (1 - psgDiscountPercentage / 100);
      setDiscountedPrice(Math.round(newPrice * 100) / 100);
    } else {
      setDiscountedPrice(originalPrice);
    }
  }, [originalPrice, hasEnoughPsgTokens, psgDiscountPercentage]);

  // Calcul de l'économie
  const savings = originalPrice - discountedPrice;

  if (!isConnected) {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">{originalPrice}{currency}</span>
          {chzPrice && (
            <span className="text-lg text-gray-600">{chzPrice} CHZ</span>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-blue-600">
          <Trophy className="w-4 h-4" />
          <span>Connectez votre wallet pour des réductions PSG exclusives</span>
        </div>
      </div>
    );
  }

  if (isCheckingPsgToken) {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">{originalPrice}{currency}</span>
          {chzPrice && (
            <span className="text-lg text-gray-600">{chzPrice} CHZ</span>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />
          <span>Vérification des tokens PSG...</span>
        </div>
      </div>
    );
  }

  if (!hasEnoughPsgTokens) {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">{originalPrice}{currency}</span>
          {chzPrice && (
            <span className="text-lg text-gray-600">{chzPrice} CHZ</span>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Trophy className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">
            Obtenez des $PSG Fan Tokens pour des réductions exclusives
          </span>
        </div>
        {psgTokenBalance && (
          <div className="text-xs text-gray-500">
            Solde actuel: {Number(psgTokenBalance.balance) / 1e18} $PSG 
            (minimum: {Number(psgTokenBalance.minimumForDiscount) / 1e18} $PSG)
          </div>
        )}
      </div>
    );
  }

  // Utilisateur avec assez de tokens PSG
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-green-600">
              {discountedPrice}{currency}
            </span>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              <Trophy className="w-3 h-3 mr-1" />
              -{psgDiscountPercentage}% PSG
            </Badge>
          </div>
          {savings > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <span className="line-through text-gray-500">
                {originalPrice}{currency}
              </span>
              <span className="text-green-600 font-medium">
                Économie: {savings.toFixed(2)}{currency}
              </span>
            </div>
          )}
        </div>
        {chzPrice && (
          <div className="text-right">
            <div className="text-lg text-gray-600">{chzPrice} CHZ</div>
            <div className="text-xs text-gray-500">Prix standard</div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-red-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2">
          <Coins className="w-5 h-5 text-blue-600" />
          <div className="text-sm">
            <div className="font-medium text-blue-700">
              Avantage Fan PSG
            </div>
            <div className="text-blue-600">
              {Number(psgTokenBalance?.balance || 0) / 1e18} $PSG dans votre wallet
            </div>
          </div>
        </div>
        <Zap className="w-4 h-4 text-yellow-500" />
      </div>
    </div>
  );
}

export default PsgTokenPriceDisplay;
