"use client";

import { useAccount } from "wagmi";
import { Badge } from "@/components/ui/badge";
import { Coins } from "lucide-react";

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
  const { isConnected } = useAccount();
  
  const discountedPrice = originalPrice * (1 - discountPercentage / 100);

  return (
    <div className="flex items-center justify-between mb-3">
      <div>
        <span className={`text-2xl font-bold ${
          isConnected ? "text-green-600" : "text-gray-600"
        }`}>
          {isConnected ? Math.round(discountedPrice) : originalPrice}{currency}
        </span>
        {isConnected && (
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
  );
}
