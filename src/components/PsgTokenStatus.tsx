"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Coins, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { useWeb3 } from "@/hooks/useWeb3";
import { SIMULATED_TOKEN_HOLDERS } from "@/lib/chiliz";

export function PsgTokenStatus() {
  const { 
    address, 
    isConnected, 
    psgTokenBalance, 
    isCheckingPsgToken, 
    hasEnoughPsgTokens,
    psgDiscountPercentage,
    recheckPsgBalance 
  } = useWeb3();

  const [isSimulating, setIsSimulating] = useState(false);

  // Fonction pour simuler l'ajout/suppression de tokens PSG
  const toggleSimulation = () => {
    if (!address) return;

    setIsSimulating(true);
    
    if (SIMULATED_TOKEN_HOLDERS.has(address.toLowerCase())) {
      SIMULATED_TOKEN_HOLDERS.delete(address.toLowerCase());
    } else {
      SIMULATED_TOKEN_HOLDERS.add(address.toLowerCase());
    }

    // Forcer la re-vérification
    setTimeout(async () => {
      await recheckPsgBalance();
      setIsSimulating(false);
    }, 1000);
  };

  if (!isConnected) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-gray-400" />
            Tokens PSG Fan
          </CardTitle>
          <CardDescription>
            Connectez votre wallet pour vérifier vos tokens PSG
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-blue-600" />
          Statut Tokens PSG
        </CardTitle>
        <CardDescription>
          Wallet: {address?.substring(0, 10)}...{address?.substring(address.length - 4)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isCheckingPsgToken || isSimulating ? (
          <div className="flex items-center gap-2 text-gray-600">
            <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />
            <span>Vérification des tokens...</span>
          </div>
        ) : (
          <>
            {/* Solde actuel */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Solde $PSG:</span>
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-blue-600" />
                <span className="font-mono">
                  {Number(psgTokenBalance?.balance || 0) / 1e18} $PSG
                </span>
              </div>
            </div>

            {/* Statut de réduction */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Réduction disponible:</span>
              <Badge 
                variant={hasEnoughPsgTokens ? "default" : "secondary"}
                className={hasEnoughPsgTokens ? "bg-green-100 text-green-700" : ""}
              >
                {hasEnoughPsgTokens ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    -{psgDiscountPercentage}%
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Non éligible
                  </>
                )}
              </Badge>
            </div>

            {/* Minimum requis */}
            <div className="text-xs text-gray-500 border-t pt-2">
              Minimum requis: {Number(psgTokenBalance?.minimumForDiscount || 0) / 1e18} $PSG
            </div>

            {/* Barres de progression */}
            {psgTokenBalance && (
              <div className="space-y-2">
                <div className="text-xs font-medium">Progression vers la réduction:</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      hasEnoughPsgTokens ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    style={{
                      width: `${Math.min(100, (Number(psgTokenBalance.balance) / Number(psgTokenBalance.minimumForDiscount)) * 100)}%`
                    }}
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <Button
                onClick={recheckPsgBalance}
                variant="outline"
                size="sm"
                className="w-full"
                disabled={isCheckingPsgToken}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualiser le solde
              </Button>

              {/* Bouton de simulation pour le hackathon */}
              <Button
                onClick={toggleSimulation}
                variant={hasEnoughPsgTokens ? "destructive" : "default"}
                size="sm"
                className="w-full"
                disabled={isSimulating}
              >
                {hasEnoughPsgTokens ? "🔴 Retirer tokens (sim)" : "🎁 Ajouter tokens (sim)"}
              </Button>
              
              <div className="text-xs text-gray-500 text-center">
                ⚡ Mode simulation pour le hackathon
              </div>
            </div>

            {/* Avantages */}
            {hasEnoughPsgTokens && (
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <div className="text-sm font-medium text-green-700 mb-1">
                  🎉 Avantages Fan PSG actifs
                </div>
                <ul className="text-xs text-green-600 space-y-1">
                  <li>• Réduction de {psgDiscountPercentage}% sur tous les produits</li>
                  <li>• Accès prioritaire aux nouvelles collections</li>
                  <li>• Badges exclusifs dans votre profil</li>
                </ul>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default PsgTokenStatus;
