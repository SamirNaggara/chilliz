"use client";

import { useWeb3 } from "@/hooks/useWeb3";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Coins, Trophy, Star, Zap } from "lucide-react";

export function PsgTokenDisplay() {
  const { 
    isConnected, 
    address,
    psgTokenBalance, 
    hasEnoughPsgTokens,
    psgDiscountPercentage,
    isCheckingPsgToken 
  } = useWeb3();

  if (!isConnected) {
    return (
      <Card className="bg-gradient-to-r from-blue-50 to-red-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-gray-400" />
            <div>
              <div className="font-medium text-gray-700">Tokens PSG Fan</div>
              <div className="text-sm text-gray-500">
                Connectez votre wallet pour voir votre solde
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isCheckingPsgToken) {
    return (
      <Card className="bg-gradient-to-r from-blue-50 to-red-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full" />
            <div>
              <div className="font-medium text-blue-700">Vérification en cours...</div>
              <div className="text-sm text-blue-600">
                Analyse de votre solde $PSG
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const tokenAmount = Number(psgTokenBalance?.balance || 0) / 1e18;
  const minimumRequired = Number(psgTokenBalance?.minimumForDiscount || 0) / 1e18;

  return (
    <Card className={`border-2 ${hasEnoughPsgTokens ? 'bg-gradient-to-r from-green-50 to-blue-50 border-green-200' : 'bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200'}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Coins className={`w-8 h-8 ${hasEnoughPsgTokens ? 'text-blue-600' : 'text-gray-500'}`} />
              {hasEnoughPsgTokens && (
                <Star className="w-4 h-4 text-yellow-500 absolute -top-1 -right-1" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg">
                  {tokenAmount.toLocaleString()} $PSG
                </span>
                {hasEnoughPsgTokens && (
                  <Badge className="bg-green-100 text-green-700">
                    <Trophy className="w-3 h-3 mr-1" />
                    VIP Fan
                  </Badge>
                )}
              </div>
              <div className="text-sm text-gray-600">
                {hasEnoughPsgTokens ? (
                  <span className="text-green-600 font-medium">
                    ✅ Réduction de {psgDiscountPercentage}% active
                  </span>
                ) : (
                  <span>
                    Minimum requis: {minimumRequired.toLocaleString()} $PSG
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Barre de progression */}
          <div className="flex flex-col items-end gap-2">
            {hasEnoughPsgTokens ? (
              <Badge className="bg-gradient-to-r from-blue-500 to-red-500 text-white">
                <Zap className="w-3 h-3 mr-1" />
                -{psgDiscountPercentage}%
              </Badge>
            ) : (
              <div className="text-right">
                <div className="text-xs text-gray-500 mb-1">
                  Progression vers VIP
                </div>
                <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-red-500 transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (tokenAmount / minimumRequired) * 100)}%`
                    }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {Math.round((tokenAmount / minimumRequired) * 100)}%
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Wallet info */}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Wallet connecté:</span>
            <span className="font-mono">
              {address?.substring(0, 6)}...{address?.substring(address.length - 4)}
            </span>
          </div>
        </div>

        {/* Avantages PSG */}
        {hasEnoughPsgTokens && (
          <div className="mt-3 p-2 bg-white/50 rounded border border-green-200">
            <div className="text-xs font-medium text-green-700 mb-1">
              🎉 Avantages Fan PSG actifs
            </div>
            <div className="text-xs text-green-600 space-y-1">
              <div>• Réduction {psgDiscountPercentage}% sur tous les produits</div>
              <div>• Accès aux collections exclusives</div>
              <div>• Badge VIP sur votre profil</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default PsgTokenDisplay;
