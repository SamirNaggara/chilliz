"use client";

import { useWeb3 } from "@/hooks/useWeb3";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Coins, Trophy, Zap, TrendingUp, Shield } from "lucide-react";

export function PsgTokenSummary() {
  const { 
    isConnected, 
    address,
    psgTokenBalance, 
    hasEnoughPsgTokens,
    psgDiscountPercentage,
    isCheckingPsgToken,
    recheckPsgBalance 
  } = useWeb3();

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="w-5 h-5 text-gray-400" />
            Statut Fan PSG
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="text-gray-500 mb-3">
              Connectez votre wallet pour accéder
            </div>
            <div className="text-sm text-gray-400">
              aux avantages exclusifs PSG
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const tokenAmount = Number(psgTokenBalance?.balance || 0) / 1e18;
  const minimumRequired = Number(psgTokenBalance?.minimumForDiscount || 0) / 1e18;
  const progressPercentage = Math.min(100, (tokenAmount / minimumRequired) * 100);

  return (
    <Card className={hasEnoughPsgTokens ? 'border-blue-200 bg-gradient-to-br from-blue-50 to-red-50' : ''}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Coins className={`w-5 h-5 ${hasEnoughPsgTokens ? 'text-blue-600' : 'text-gray-500'}`} />
          Statut Fan PSG
          {hasEnoughPsgTokens && (
            <Badge className="bg-gradient-to-r from-blue-500 to-red-500 text-white text-xs">
              VIP
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isCheckingPsgToken ? (
          <div className="flex items-center gap-2 text-gray-600">
            <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />
            <span className="text-sm">Vérification...</span>
          </div>
        ) : (
          <>
            {/* Solde principal */}
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800 mb-1">
                {tokenAmount.toLocaleString()} $PSG
              </div>
              <div className="text-sm text-gray-600">
                dans votre wallet
              </div>
            </div>

            {/* Statut et réduction */}
            {hasEnoughPsgTokens ? (
              <div className="bg-white/70 p-3 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-green-700">Fan VIP Actif</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-600">Réduction active:</span>
                  <Badge className="bg-green-100 text-green-700">
                    <Zap className="w-3 h-3 mr-1" />
                    -{psgDiscountPercentage}%
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-sm text-gray-600 text-center">
                  Progression vers le statut VIP
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{tokenAmount.toLocaleString()}</span>
                    <span>{minimumRequired.toLocaleString()} $PSG</span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-red-500 transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  <div className="text-center text-xs text-gray-500">
                    {Math.round(progressPercentage)}% complété
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2">
              <Button
                onClick={recheckPsgBalance}
                variant="outline"
                size="sm"
                className="w-full"
                disabled={isCheckingPsgToken}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Actualiser
              </Button>

              {!hasEnoughPsgTokens && (
                <div className="text-xs text-center text-gray-500">
                  Obtenez {(minimumRequired - tokenAmount).toLocaleString()} $PSG de plus
                  <br />
                  pour débloquer le statut VIP
                </div>
              )}
            </div>

            {/* Wallet info */}
            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Wallet:</span>
                <span className="font-mono">
                  {address?.substring(0, 8)}...{address?.substring(address.length - 4)}
                </span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default PsgTokenSummary;
