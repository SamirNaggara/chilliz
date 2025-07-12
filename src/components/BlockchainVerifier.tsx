"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  ExternalLink, 
  CheckCircle, 
  XCircle, 
  Clock,
  Trophy,
  Users,
  Copy,
  RefreshCw,
  Eye
} from "lucide-react";
import { blockchainUtils } from "@/lib/chiliz-blockchain";

interface TransactionData {
  hash: string;
  blockNumber: number;
  status: number;
  from: string;
  to: string;
  timestamp: number;
  data?: {
    type: string;
    contestId: string;
    participantAddress?: string;
    winnerAddress?: string;
    jerseyId?: string;
    username?: string;
    prize?: string;
    rank?: number;
    timestamp: number;
  };
}

interface HistoryData {
  participations: Array<{
    type: string;
    walletAddress: string;
    data: any;
    timestamp: number;
    transactionHash: string;
  }>;
  winners: Array<{
    type: string;
    walletAddress: string;
    data: any;
    timestamp: number;
    transactionHash: string;
  }>;
  totalEvents: number;
}

export function BlockchainVerifier() {
  const [activeTab, setActiveTab] = useState("transaction");
  const [transactionHash, setTransactionHash] = useState("");
  const [contestId, setContestId] = useState("");
  const [loading, setLoading] = useState(false);
  const [transactionData, setTransactionData] = useState<TransactionData | null>(null);
  const [historyData, setHistoryData] = useState<HistoryData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Vérifier une transaction
  const verifyTransaction = async () => {
    if (!transactionHash.trim()) {
      setError("Veuillez entrer un hash de transaction");
      return;
    }

    setLoading(true);
    setError(null);
    setTransactionData(null);

    try {
      const response = await fetch(`/api/blockchain/inspect/${transactionHash}`);
      const result = await response.json();

      if (result.success) {
        setTransactionData(result.data);
      } else {
        // Message d'erreur amélioré pour expliquer la simulation
        setError(
          `Transaction non trouvée sur la blockchain. 
          
          🔍 Raisons possibles:
          • Hash de transaction simulé (pour démonstration)
          • Transaction pas encore confirmée 
          • Hash invalide ou inexistant
          
          💡 Note: Ce système utilise actuellement des hashs simulés pour la démonstration. 
          Pour des vraies transactions blockchain, une configuration avec clé privée est nécessaire.`
        );
      }
    } catch (err) {
      setError("Erreur lors de la vérification");
    } finally {
      setLoading(false);
    }
  };

  // Récupérer l'historique d'un concours
  const fetchContestHistory = async () => {
    if (!contestId.trim()) {
      setError("Veuillez entrer un ID de concours");
      return;
    }

    setLoading(true);
    setError(null);
    setHistoryData(null);

    try {
      const response = await fetch(`/api/blockchain/contests/${contestId}/history`);
      const result = await response.json();

      if (result.success) {
        setHistoryData(result.data);
      } else {
        setError(result.error || "Concours non trouvé");
      }
    } catch (err) {
      setError("Erreur lors de la récupération");
    } finally {
      setLoading(false);
    }
  };

  // Copier dans le presse-papier
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Ouvrir dans l'explorateur
  const openInExplorer = (hash: string) => {
    const url = blockchainUtils.getExplorerLink(hash);
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-600" />
            Vérificateur Blockchain Chiliz
          </CardTitle>
          <p className="text-sm text-gray-600">
            Vérifiez la transparence et l'authenticité des données de loterie enregistrées sur la blockchain Chiliz
          </p>
        </CardHeader>
      </Card>

      {/* Onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="transaction" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            Vérifier Transaction
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Historique Concours
          </TabsTrigger>
        </TabsList>

        {/* Onglet Vérification Transaction */}
        <TabsContent value="transaction" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vérifier une Transaction</CardTitle>
              <p className="text-sm text-gray-600">
                Entrez le hash d'une transaction pour voir toutes les données de loterie
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="0x1234567890abcdef... (Hash de transaction)"
                  value={transactionHash}
                  onChange={(e) => setTransactionHash(e.target.value)}
                  className="font-mono text-sm"
                />
                <Button 
                  onClick={verifyTransaction}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  Vérifier
                </Button>
              </div>

              {/* Erreur */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-red-800">
                    <XCircle className="w-4 h-4" />
                    {error}
                  </div>
                </div>
              )}

              {/* Résultat Transaction */}
              {transactionData && (
                <div className="space-y-4">
                  {/* Informations de base */}
                  <Card className="border-green-200 bg-green-50">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-green-800">
                        <CheckCircle className="w-5 h-5" />
                        Transaction Vérifiée
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Hash</label>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-mono bg-white px-2 py-1 rounded border">
                              {blockchainUtils.formatTxHash(transactionData.hash)}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyToClipboard(transactionData.hash)}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-700">Block</label>
                          <div className="mt-1">
                            <Badge variant="secondary">#{transactionData.blockNumber}</Badge>
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700">Statut</label>
                          <div className="mt-1">
                            <Badge className={transactionData.status === 1 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                              {transactionData.status === 1 ? "✅ Succès" : "❌ Échec"}
                            </Badge>
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700">Timestamp</label>
                          <div className="mt-1 text-sm">
                            {blockchainUtils.formatTimestamp(transactionData.timestamp)}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => openInExplorer(transactionData.hash)}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Voir sur Chiliz Explorer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Données de Loterie */}
                  {transactionData.data && (
                    <Card className="border-blue-200 bg-blue-50">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-blue-800">
                          {transactionData.data.type === 'LOTTERY_PARTICIPATION' ? (
                            <Users className="w-5 h-5" />
                          ) : (
                            <Trophy className="w-5 h-5" />
                          )}
                          Données de Loterie
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700">Type</label>
                            <div className="mt-1">
                              <Badge className={
                                transactionData.data.type === 'LOTTERY_PARTICIPATION' 
                                  ? "bg-blue-100 text-blue-800" 
                                  : "bg-yellow-100 text-yellow-800"
                              }>
                                {transactionData.data.type === 'LOTTERY_PARTICIPATION' 
                                  ? '🎲 Participation' 
                                  : '🏆 Annonce Gagnant'}
                              </Badge>
                            </div>
                          </div>

                          <div>
                            <label className="text-sm font-medium text-gray-700">Contest ID</label>
                            <div className="mt-1 text-sm font-mono bg-white px-2 py-1 rounded border">
                              {transactionData.data.contestId}
                            </div>
                          </div>

                          {transactionData.data.type === 'LOTTERY_PARTICIPATION' && (
                            <>
                              <div>
                                <label className="text-sm font-medium text-gray-700">Participant</label>
                                <div className="mt-1 text-sm font-mono bg-white px-2 py-1 rounded border">
                                  {blockchainUtils.formatAddress(transactionData.data.participantAddress || '')}
                                </div>
                              </div>

                              <div>
                                <label className="text-sm font-medium text-gray-700">Jersey ID</label>
                                <div className="mt-1 text-sm bg-white px-2 py-1 rounded border">
                                  {transactionData.data.jerseyId}
                                </div>
                              </div>

                              <div>
                                <label className="text-sm font-medium text-gray-700">Username</label>
                                <div className="mt-1 text-sm bg-white px-2 py-1 rounded border">
                                  {transactionData.data.username || 'Non spécifié'}
                                </div>
                              </div>
                            </>
                          )}

                          {transactionData.data.type === 'WINNER_ANNOUNCEMENT' && (
                            <>
                              <div>
                                <label className="text-sm font-medium text-gray-700">Gagnant</label>
                                <div className="mt-1 text-sm font-mono bg-white px-2 py-1 rounded border">
                                  {blockchainUtils.formatAddress(transactionData.data.winnerAddress || '')}
                                </div>
                              </div>

                              <div>
                                <label className="text-sm font-medium text-gray-700">Prix</label>
                                <div className="mt-1 text-sm bg-white px-2 py-1 rounded border">
                                  {transactionData.data.prize}
                                </div>
                              </div>

                              <div>
                                <label className="text-sm font-medium text-gray-700">Rang</label>
                                <div className="mt-1">
                                  <Badge className="bg-yellow-100 text-yellow-800">
                                    {transactionData.data.rank}
                                  </Badge>
                                </div>
                              </div>
                            </>
                          )}
                        </div>

                        {/* JSON Complet */}
                        <details className="bg-white rounded border p-3">
                          <summary className="cursor-pointer font-medium text-sm text-gray-700">
                            Voir les données JSON complètes
                          </summary>
                          <pre className="mt-2 text-xs bg-gray-50 p-2 rounded overflow-auto">
                            {JSON.stringify(transactionData.data, null, 2)}
                          </pre>
                        </details>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Historique Concours */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Historique d'un Concours</CardTitle>
              <p className="text-sm text-gray-600">
                Voir tous les événements blockchain d'un concours spécifique
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="contest-summer-2024 (ID du concours)"
                  value={contestId}
                  onChange={(e) => setContestId(e.target.value)}
                />
                <Button 
                  onClick={fetchContestHistory}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  Récupérer
                </Button>
              </div>

              {/* Erreur */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-red-800">
                    <XCircle className="w-4 h-4" />
                    {error}
                  </div>
                </div>
              )}

              {/* Résultat Historique */}
              {historyData && (
                <div className="space-y-4">
                  {/* Statistiques */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-blue-600" />
                          <div>
                            <div className="text-sm font-medium text-blue-800">Participations</div>
                            <div className="text-2xl font-bold text-blue-900">{historyData.participations.length}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-yellow-50 border-yellow-200">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <Trophy className="w-5 h-5 text-yellow-600" />
                          <div>
                            <div className="text-sm font-medium text-yellow-800">Gagnants</div>
                            <div className="text-2xl font-bold text-yellow-900">{historyData.winners.length}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-green-50 border-green-200">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <div>
                            <div className="text-sm font-medium text-green-800">Total Événements</div>
                            <div className="text-2xl font-bold text-green-900">{historyData.totalEvents}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Timeline des événements */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Timeline des Événements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {[...historyData.participations, ...historyData.winners]
                          .sort((a, b) => b.timestamp - a.timestamp)
                          .map((event, index) => (
                            <div
                              key={`${event.type}-${event.walletAddress}-${index}`}
                              className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border"
                            >
                              <div className={`p-2 rounded-full ${
                                event.type === 'LOTTERY_PARTICIPATION' 
                                  ? 'bg-blue-100 text-blue-600' 
                                  : 'bg-yellow-100 text-yellow-600'
                              }`}>
                                {event.type === 'LOTTERY_PARTICIPATION' ? (
                                  <Users className="w-4 h-4" />
                                ) : (
                                  <Trophy className="w-4 h-4" />
                                )}
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="secondary" className="text-xs">
                                    {event.type === 'LOTTERY_PARTICIPATION' ? 'Participation' : 'Gagnant'}
                                  </Badge>
                                  <span className="text-xs text-gray-500">
                                    {blockchainUtils.formatTimestamp(event.timestamp)}
                                  </span>
                                </div>
                                
                                <div className="text-sm space-y-1">
                                  <div>
                                    <span className="font-medium">Wallet:</span>{" "}
                                    <span className="font-mono text-xs">
                                      {blockchainUtils.formatAddress(event.walletAddress)}
                                    </span>
                                  </div>
                                  
                                  {event.data.jerseyId && (
                                    <div>
                                      <span className="font-medium">Jersey:</span> {event.data.jerseyId}
                                    </div>
                                  )}
                                  
                                  {event.data.prize && (
                                    <div>
                                      <span className="font-medium">Prix:</span> {event.data.prize}
                                    </div>
                                  )}

                                  {event.transactionHash && (
                                    <div className="flex items-center gap-2 mt-2">
                                      <span className="text-xs font-medium">TX:</span>
                                      <span className="text-xs font-mono bg-white px-1 py-0.5 rounded">
                                        {blockchainUtils.formatTxHash(event.transactionHash)}
                                      </span>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => openInExplorer(event.transactionHash)}
                                        className="h-6 w-6 p-0"
                                      >
                                        <ExternalLink className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Info Réseau */}
      <Card className="bg-orange-50 border-orange-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <div className="w-1 h-1 bg-orange-500 rounded-full mt-2"></div>
            <div className="text-sm text-orange-800">
              <strong>Réseau Chiliz Spicy Testnet</strong><br />
              Toutes les données affichées sont stockées de manière immuable sur la blockchain Chiliz 
              et peuvent être vérifiées publiquement via l'explorateur officiel.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
