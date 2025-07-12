"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { blockchainUtils } from "@/lib/chiliz-blockchain";

interface BlockchainStatusProps {
  transactionHash?: string;
  type: "participation" | "winner_announcement";
  contestId: string;
  walletAddress?: string;
}

export function BlockchainStatus({ 
  transactionHash, 
  type, 
  contestId, 
  walletAddress 
}: BlockchainStatusProps) {
  const [verificationStatus, setVerificationStatus] = useState<{
    verified: boolean;
    data?: any;
    loading: boolean;
    error?: string;
  }>({
    verified: false,
    loading: false,
  });

  const verifyTransaction = async () => {
    if (!transactionHash) return;

    setVerificationStatus({ verified: false, loading: true });

    try {
      const response = await fetch(`/api/blockchain/verify/${transactionHash}`);
      const result = await response.json();

      setVerificationStatus({
        verified: result.verified,
        data: result.data,
        loading: false,
        error: result.error,
      });
    } catch (error) {
      setVerificationStatus({
        verified: false,
        loading: false,
        error: "Erreur lors de la vérification",
      });
    }
  };

  const getStatusColor = () => {
    if (verificationStatus.loading) return "bg-yellow-100 text-yellow-800";
    if (verificationStatus.verified) return "bg-green-100 text-green-800";
    if (verificationStatus.error) return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = () => {
    if (verificationStatus.loading) return <Clock className="w-4 h-4" />;
    if (verificationStatus.verified) return <CheckCircle className="w-4 h-4" />;
    if (verificationStatus.error) return <AlertCircle className="w-4 h-4" />;
    return <Clock className="w-4 h-4" />;
  };

  const getStatusText = () => {
    if (verificationStatus.loading) return "Vérification...";
    if (verificationStatus.verified) return "Confirmé on-chain";
    if (verificationStatus.error) return "Non vérifié";
    return "En attente";
  };

  const getTypeLabel = () => {
    return type === "participation" ? "Participation" : "Annonce gagnant";
  };

  return (
    <Card className="border-l-4 border-l-orange-500">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
          Blockchain - {getTypeLabel()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {transactionHash ? (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Statut:</span>
                <Badge className={getStatusColor()}>
                  {getStatusIcon()}
                  <span className="ml-1">{getStatusText()}</span>
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Transaction:</span>
                <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                  {blockchainUtils.formatAddress(transactionHash)}
                </span>
              </div>

              {walletAddress && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Wallet:</span>
                  <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                    {blockchainUtils.formatAddress(walletAddress)}
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                onClick={verifyTransaction}
                disabled={verificationStatus.loading}
                size="sm"
                variant="outline"
                className="flex-1"
              >
                {verificationStatus.loading ? (
                  <>
                    <Clock className="w-3 h-3 mr-1 animate-spin" />
                    Vérification...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Vérifier
                  </>
                )}
              </Button>

              <Button
                onClick={() => window.open(blockchainUtils.getExplorerLink(transactionHash), '_blank')}
                size="sm"
                variant="outline"
              >
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>

            {verificationStatus.data && (
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <div className="text-xs text-green-800 space-y-1">
                  <div>Block: #{verificationStatus.data.blockNumber}</div>
                  {verificationStatus.data.timestamp && (
                    <div>
                      Temps: {blockchainUtils.formatTimestamp(verificationStatus.data.timestamp)}
                    </div>
                  )}
                  <div className="text-green-600">✅ Transaction confirmée sur Chiliz Chain</div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-3">
            <div className="text-yellow-600 mb-2">
              <Clock className="w-8 h-8 mx-auto" />
            </div>
            <p className="text-sm text-gray-600">
              Enregistrement blockchain en cours...
            </p>
            <p className="text-xs text-gray-500 mt-1">
              La transaction sera disponible dans quelques instants
            </p>
          </div>
        )}

        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <div className="flex items-start gap-2">
            <div className="w-1 h-1 bg-blue-500 rounded-full mt-2"></div>
            <div className="text-xs text-blue-800">
              <strong>Blockchain Chiliz:</strong> Cette action est enregistrée de manière transparente 
              sur le testnet Spicy de Chiliz Chain pour garantir l&apos;équité et la traçabilité du concours.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
