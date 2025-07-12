"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Trophy, Users, RefreshCw } from "lucide-react";
import { blockchainUtils } from "@/lib/chiliz-blockchain";

interface BlockchainEvent {
  type: 'LOTTERY_PARTICIPATION' | 'WINNER_ANNOUNCEMENT';
  contestId: string;
  walletAddress: string;
  data: any;
  timestamp: number;
  transactionHash?: string;
  blockNumber?: number;
}

interface BlockchainHistoryProps {
  contestId: string;
}

export function BlockchainHistory({ contestId }: BlockchainHistoryProps) {
  const [history, setHistory] = useState<{
    participations: BlockchainEvent[];
    winners: BlockchainEvent[];
    totalEvents: number;
    loading: boolean;
    error?: string;
  }>({
    participations: [],
    winners: [],
    totalEvents: 0,
    loading: true,
  });

  const fetchHistory = async () => {
    setHistory(prev => ({ ...prev, loading: true, error: undefined }));

    try {
      const response = await fetch(`/api/blockchain/contests/${contestId}/history`);
      const result = await response.json();

      if (result.success) {
        setHistory({
          participations: result.data.participations,
          winners: result.data.winners,
          totalEvents: result.data.totalEvents,
          loading: false,
        });
      } else {
        setHistory(prev => ({
          ...prev,
          loading: false,
          error: result.error,
        }));
      }
    } catch (error) {
      setHistory(prev => ({
        ...prev,
        loading: false,
        error: "Erreur lors du chargement",
      }));
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [contestId]);

  const getEventTypeLabel = (type: string) => {
    return type === 'LOTTERY_PARTICIPATION' ? 'Participation' : 'Annonce gagnant';
  };

  const getEventIcon = (type: string) => {
    return type === 'LOTTERY_PARTICIPATION' ? <Users className="w-4 h-4" /> : <Trophy className="w-4 h-4" />;
  };

  const getEventColor = (type: string) => {
    return type === 'LOTTERY_PARTICIPATION' 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-yellow-100 text-yellow-800';
  };

  if (history.loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            Historique Blockchain
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-600">Chargement...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (history.error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            Historique Blockchain
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600">{history.error}</p>
            <Button onClick={fetchHistory} className="mt-4" size="sm">
              Réessayer
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const allEvents = [
    ...history.participations,
    ...history.winners,
  ].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Historique Blockchain
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {history.totalEvents} événements
            </Badge>
            <Button onClick={fetchHistory} size="sm" variant="outline">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {history.totalEvents === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Aucun événement blockchain pour ce concours</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Statistiques */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Participations</span>
                </div>
                <div className="text-2xl font-bold text-blue-900">
                  {history.participations.length}
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-2 mb-1">
                  <Trophy className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">Gagnants</span>
                </div>
                <div className="text-2xl font-bold text-yellow-900">
                  {history.winners.length}
                </div>
              </div>
            </div>

            {/* Timeline des événements */}
            <div>
              <h4 className="font-medium text-gray-800 mb-3">Timeline des événements</h4>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {allEvents.map((event, index) => (
                  <div
                    key={`${event.type}-${event.walletAddress}-${index}`}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border"
                  >
                    <div className={`p-2 rounded-full ${getEventColor(event.type)}`}>
                      {getEventIcon(event.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">
                          {getEventTypeLabel(event.type)}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {blockchainUtils.formatTimestamp(event.timestamp)}
                        </Badge>
                      </div>
                      
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>
                          <span className="font-medium">Wallet:</span>{" "}
                          {blockchainUtils.formatAddress(event.walletAddress)}
                        </div>
                        
                        {event.type === 'LOTTERY_PARTICIPATION' && event.data.jerseyId && (
                          <div>
                            <span className="font-medium">Jersey:</span> {event.data.jerseyId}
                          </div>
                        )}
                        
                        {event.type === 'WINNER_ANNOUNCEMENT' && event.data.prize && (
                          <div>
                            <span className="font-medium">Prix:</span> {event.data.prize}
                          </div>
                        )}

                        {event.transactionHash && (
                          <div className="flex items-center gap-1">
                            <span className="font-medium">TX:</span>
                            <span className="font-mono">
                              {blockchainUtils.formatAddress(event.transactionHash)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {event.transactionHash && (
                      <Button
                        onClick={() => 
                          window.open(
                            blockchainUtils.getExplorerLink(event.transactionHash!), 
                            '_blank'
                          )
                        }
                        size="sm"
                        variant="outline"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Informations réseau */}
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <div className="flex items-start gap-2">
                <div className="w-1 h-1 bg-orange-500 rounded-full mt-2"></div>
                <div className="text-xs text-orange-800">
                  <strong>Réseau:</strong> Chiliz Spicy Testnet<br />
                  <strong>Vérifiabilité:</strong> Tous les événements sont enregistrés de manière transparente 
                  sur la blockchain et peuvent être vérifiés publiquement via l&apos;explorateur.
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
