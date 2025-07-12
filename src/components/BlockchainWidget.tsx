"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  ExternalLink, 
  Clock, 
  AlertCircle,
  Eye
} from "lucide-react";
import { blockchainUtils } from "@/lib/chiliz-blockchain";

interface BlockchainWidgetProps {
  transactionHash?: string;
  contestId?: string;
  type?: 'participation' | 'winner' | 'contest';
  compact?: boolean;
  showVerifyButton?: boolean;
}

export function BlockchainWidget({ 
  transactionHash, 
  contestId, 
  type = 'participation',
  compact = false,
  showVerifyButton = true 
}: BlockchainWidgetProps) {
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationData, setVerificationData] = useState<any>(null);

  // Vérification automatique si on a un hash
  useEffect(() => {
    if (transactionHash && !isVerified) {
      verifyTransaction();
    }
  }, [transactionHash]);

  const verifyTransaction = async () => {
    if (!transactionHash) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/blockchain/inspect/${transactionHash}`);
      const result = await response.json();

      if (result.success) {
        setIsVerified(true);
        setVerificationData(result.data);
      } else {
        setIsVerified(false);
      }
    } catch (error) {
      setIsVerified(false);
    } finally {
      setIsLoading(false);
    }
  };

  const openInExplorer = () => {
    if (transactionHash) {
      const url = blockchainUtils.getExplorerLink(transactionHash);
      window.open(url, '_blank');
    }
  };

  const openVerificationPage = () => {
    const params = new URLSearchParams();
    if (transactionHash) params.set('tx', transactionHash);
    if (contestId) params.set('contest', contestId);
    
    window.open(`/blockchain-verification?${params.toString()}`, '_blank');
  };

  // Version compacte
  if (compact) {
    return (
      <div className="inline-flex items-center gap-2 text-sm">
        {transactionHash ? (
          <>
            <div className="flex items-center gap-1">
              {isVerified === true && (
                <CheckCircle className="w-4 h-4 text-green-600" />
              )}
              {isVerified === false && (
                <AlertCircle className="w-4 h-4 text-red-600" />
              )}
              {isVerified === null && (
                <Clock className="w-4 h-4 text-yellow-600 animate-pulse" />
              )}
              
              <Badge variant={isVerified === true ? "default" : "secondary"} className="text-xs">
                {isVerified === true ? "✅ Vérifié" : isVerified === false ? "❌ Erreur" : "⏳ Vérification"}
              </Badge>
            </div>
            
            <Button
              size="sm"
              variant="outline"
              onClick={openInExplorer}
              className="h-6 px-2 text-xs"
            >
              <ExternalLink className="w-3 h-3" />
            </Button>
          </>
        ) : (
          <Badge variant="secondary" className="text-xs">
            Pas de transaction blockchain
          </Badge>
        )}
      </div>
    );
  }

  // Version complète
  return (
    <Card className={`${
      isVerified === true ? 'border-green-200 bg-green-50' :
      isVerified === false ? 'border-red-200 bg-red-50' :
      'border-yellow-200 bg-yellow-50'
    }`}>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isVerified === true && <CheckCircle className="w-5 h-5 text-green-600" />}
              {isVerified === false && <AlertCircle className="w-5 h-5 text-red-600" />}
              {isVerified === null && <Clock className="w-5 h-5 text-yellow-600 animate-pulse" />}
              
              <span className="font-medium text-sm">
                {type === 'participation' && 'Participation Blockchain'}
                {type === 'winner' && 'Annonce Gagnant Blockchain'}
                {type === 'contest' && 'Historique Concours Blockchain'}
              </span>
            </div>

            <Badge className={
              isVerified === true ? "bg-green-100 text-green-800" :
              isVerified === false ? "bg-red-100 text-red-800" :
              "bg-yellow-100 text-yellow-800"
            }>
              {isVerified === true ? "✅ Vérifié" : isVerified === false ? "❌ Erreur" : "⏳ Vérification"}
            </Badge>
          </div>

          {/* Informations */}
          {transactionHash && (
            <div className="space-y-2">
              <div>
                <label className="text-xs font-medium text-gray-600">Transaction Hash</label>              <div className="text-xs font-mono bg-white p-2 rounded border break-all">
                {blockchainUtils.formatTxHash(transactionHash)}
              </div>
              </div>

              {verificationData && (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="font-medium text-gray-600">Block</label>
                    <div className="bg-white p-1 rounded border">
                      #{verificationData.blockNumber}
                    </div>
                  </div>
                  <div>
                    <label className="font-medium text-gray-600">Timestamp</label>
                    <div className="bg-white p-1 rounded border">
                      {blockchainUtils.formatTimestamp(verificationData.timestamp)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {contestId && (
            <div>
              <label className="text-xs font-medium text-gray-600">Contest ID</label>
              <div className="text-xs font-mono bg-white p-2 rounded border">
                {contestId}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t">
            {transactionHash && (
              <Button
                size="sm"
                variant="outline"
                onClick={openInExplorer}
                className="flex items-center gap-1 text-xs"
              >
                <ExternalLink className="w-3 h-3" />
                Explorateur
              </Button>
            )}

            {showVerifyButton && (
              <Button
                size="sm"
                variant="outline"
                onClick={openVerificationPage}
                className="flex items-center gap-1 text-xs"
              >
                <Eye className="w-3 h-3" />
                Vérifier Détails
              </Button>
            )}

            {transactionHash && isVerified !== true && (
              <Button
                size="sm"
                onClick={verifyTransaction}
                disabled={isLoading}
                className="flex items-center gap-1 text-xs"
              >
                {isLoading ? (
                  <Clock className="w-3 h-3 animate-spin" />
                ) : (
                  <CheckCircle className="w-3 h-3" />
                )}
                {isLoading ? 'Vérification...' : 'Vérifier'}
              </Button>
            )}
          </div>

          {/* Message */}
          <div className="text-xs text-gray-600 pt-2 border-t">
            {isVerified === true && (
              <div className="text-green-700">
                ✅ Cette {type === 'participation' ? 'participation' : type === 'winner' ? 'annonce' : 'données'} est 
                authentifiée et enregistrée de manière immuable sur la blockchain Chiliz.
              </div>
            )}
            {isVerified === false && (
              <div className="text-red-700">
                ❌ Impossible de vérifier cette transaction. Elle pourrait ne pas exister sur la blockchain.
              </div>
            )}
            {isVerified === null && (
              <div className="text-yellow-700">
                ⏳ Vérification en cours de la transaction sur la blockchain Chiliz...
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
