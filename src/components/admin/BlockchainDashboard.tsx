"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  Users, 
  Trophy, 
  TrendingUp,
  ExternalLink,
  RefreshCw,
  Calendar,
  Clock
} from "lucide-react";
import { blockchainUtils } from "@/lib/chiliz-blockchain";

interface BlockchainStats {
  totalParticipations: number;
  totalWinners: number;
  activeContests: number;
  recentTransactions: Array<{
    hash: string;
    type: string;
    timestamp: number;
    contestId: string;
    status: 'confirmed' | 'pending' | 'failed';
  }>;
}

export function BlockchainDashboard() {
  const [stats, setStats] = useState<BlockchainStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [contestFilter, setContestFilter] = useState("");

  // Charger les statistiques
  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/blockchain/stats');
      const result = await response.json();
      
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshStats = () => {
    loadStats();
  };

  const openExplorer = (hash: string) => {
    const url = blockchainUtils.getExplorerLink(hash);
    window.open(url, '_blank');
  };

  const filteredTransactions = stats?.recentTransactions.filter(tx => 
    !contestFilter || tx.contestId.toLowerCase().includes(contestFilter.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord Blockchain</h1>
          <p className="text-gray-600">Monitoring en temps réel de l'activité blockchain</p>
        </div>
        <Button 
          onClick={refreshStats}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Participations Total</p>
                <p className="text-2xl font-bold text-blue-900">
                  {stats?.totalParticipations || 0}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 text-sm font-medium">Gagnants Annoncés</p>
                <p className="text-2xl font-bold text-yellow-900">
                  {stats?.totalWinners || 0}
                </p>
              </div>
              <Trophy className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Concours Actifs</p>
                <p className="text-2xl font-bold text-green-900">
                  {stats?.activeContests || 0}
                </p>
              </div>
              <Activity className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Transactions 24h</p>
                <p className="text-2xl font-bold text-purple-900">
                  {stats?.recentTransactions.length || 0}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activité récente */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Activité Blockchain Récente
            </CardTitle>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Filtrer par Contest ID..."
                value={contestFilter}
                onChange={(e) => setContestFilter(e.target.value)}
                className="w-48"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin text-gray-500" />
              <span className="ml-2 text-gray-500">Chargement...</span>
            </div>
          ) : filteredTransactions.length > 0 ? (
            <div className="space-y-3">
              {filteredTransactions.slice(0, 10).map((tx, index) => (
                <div
                  key={tx.hash}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${
                      tx.status === 'confirmed' ? 'bg-green-500' :
                      tx.status === 'pending' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`} />
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant={tx.type === 'LOTTERY_PARTICIPATION' ? 'default' : 'secondary'}>
                          {tx.type === 'LOTTERY_PARTICIPATION' ? '🎲 Participation' : '🏆 Gagnant'}
                        </Badge>
                        <span className="text-sm font-mono text-gray-600">
                          {blockchainUtils.formatTxHash(tx.hash)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Contest: <span className="font-medium">{tx.contestId}</span>
                        {" • "}
                        <span>{blockchainUtils.formatTimestamp(tx.timestamp)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge className={
                      tx.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }>
                      {tx.status === 'confirmed' ? '✅ Confirmé' :
                       tx.status === 'pending' ? '⏳ En attente' :
                       '❌ Échec'}
                    </Badge>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openExplorer(tx.hash)}
                      className="h-8 w-8 p-0"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {contestFilter ? 
                `Aucune transaction trouvée pour "${contestFilter}"` :
                "Aucune activité blockchain récente"
              }
            </div>
          )}
        </CardContent>
      </Card>

      {/* Informations réseau */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <Activity className="w-5 h-5" />
            Statut Réseau Chiliz
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-orange-800 mb-2">Configuration Actuelle</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Réseau:</span>
                  <span className="font-medium">Chiliz Spicy Testnet</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Chain ID:</span>
                  <span className="font-medium">88882</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Explorateur:</span>
                  <Button
                    size="sm"
                    variant="link"
                    className="h-auto p-0 text-blue-600"
                    onClick={() => window.open('https://spicy-explorer.chiliz.com', '_blank')}
                  >
                    spicy-explorer.chiliz.com
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-orange-800 mb-2">Garanties Blockchain</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Données immuables et horodatées</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Vérification publique possible</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Transparence totale des loteries</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Conformité hackathon Chiliz</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
