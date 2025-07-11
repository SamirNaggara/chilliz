"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWeb3 } from "@/hooks/useWeb3";
import { 
  addToSimulation, 
  removeFromSimulation, 
  getSimulationList, 
  enablePsgTokensForCurrentWallet,
  isInSimulation 
} from "@/lib/chiliz";
import { 
  Settings, 
  Plus, 
  Minus, 
  RefreshCw, 
  Copy, 
  Check,
  Users,
  Zap,
  Database
} from "lucide-react";

export function WalletDebugPanel() {
  const { 
    address, 
    isConnected, 
    chainId, 
    balance, 
    psgTokenBalance,
    hasEnoughPsgTokens,
    psgDiscountPercentage,
    recheckPsgBalance 
  } = useWeb3();

  const [newAddress, setNewAddress] = useState("");
  const [simulationList, setSimulationList] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  // Rafraîchir la liste de simulation
  const refreshSimulationList = () => {
    setSimulationList(getSimulationList());
  };

  useEffect(() => {
    refreshSimulationList();
  }, []);

  // Ajouter une adresse à la simulation
  const handleAddAddress = () => {
    if (newAddress && addToSimulation(newAddress)) {
      setNewAddress("");
      refreshSimulationList();
      // Recheck si c'est l'adresse courante
      if (address && newAddress.toLowerCase() === address.toLowerCase()) {
        recheckPsgBalance();
      }
    }
  };

  // Retirer une adresse de la simulation
  const handleRemoveAddress = (addressToRemove: string) => {
    if (removeFromSimulation(addressToRemove)) {
      refreshSimulationList();
      // Recheck si c'est l'adresse courante
      if (address && addressToRemove.toLowerCase() === address.toLowerCase()) {
        recheckPsgBalance();
      }
    }
  };

  // Activer PSG pour l'adresse courante
  const handleEnableCurrentWallet = () => {
    if (address) {
      enablePsgTokensForCurrentWallet(address);
      refreshSimulationList();
      recheckPsgBalance();
    }
  };

  // Copier les informations de debug
  const copyDebugInfo = () => {
    const debugInfo = {
      wallet: {
        address,
        isConnected,
        chainId,
        balance: balance?.toString(),
      },
      psgTokens: {
        balance: psgTokenBalance?.balance.toString(),
        hasEnoughTokens: hasEnoughPsgTokens,
        discountPercentage: psgDiscountPercentage,
        isInSimulation: address ? isInSimulation(address) : false,
      },
      simulation: {
        totalAddresses: simulationList.length,
        addresses: simulationList,
      },
      localStorage: {
        walletConnected: localStorage.getItem('wallet-connected'),
        walletAddress: localStorage.getItem('wallet-address'),
        psgSimulation: localStorage.getItem('psg-simulation-addresses'),
      }
    };

    navigator.clipboard.writeText(JSON.stringify(debugInfo, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isCurrentAddressInSimulation = address ? isInSimulation(address) : false;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          🔧 Panneau de Debug Hackathon
        </CardTitle>
        <CardDescription>
          Outils de test et simulation pour l'intégration PSG Fan Tokens
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Statut actuel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-700">Connexion Wallet</span>
              </div>
              <Badge variant={isConnected ? "default" : "secondary"}>
                {isConnected ? "✅ Connecté" : "❌ Déconnecté"}
              </Badge>
              {isConnected && (
                <div className="text-xs text-blue-600 mt-1 font-mono">
                  {address?.substring(0, 10)}...{address?.substring(address.length - 4)}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-4 h-4 text-green-600" />
                <span className="font-medium text-green-700">Tokens PSG</span>
              </div>
              <Badge variant={hasEnoughPsgTokens ? "default" : "secondary"}>
                {hasEnoughPsgTokens ? `✅ -${psgDiscountPercentage}%` : "❌ Non éligible"}
              </Badge>
              {psgTokenBalance && (
                <div className="text-xs text-green-600 mt-1">
                  {Number(psgTokenBalance.balance) / 1e18} $PSG
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-purple-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-purple-600" />
                <span className="font-medium text-purple-700">Simulation</span>
              </div>
              <Badge variant="outline">
                {simulationList.length} adresses
              </Badge>
              {isConnected && (
                <div className="text-xs text-purple-600 mt-1">
                  Votre wallet: {isCurrentAddressInSimulation ? "✅ Simulé" : "❌ Non simulé"}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Actions rapides */}
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={recheckPsgBalance}
            variant="outline"
            size="sm"
            disabled={!isConnected}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Recheck PSG
          </Button>
          
          <Button
            onClick={handleEnableCurrentWallet}
            variant={isCurrentAddressInSimulation ? "destructive" : "default"}
            size="sm"
            disabled={!isConnected}
          >
            {isCurrentAddressInSimulation ? "🔴 Désactiver PSG" : "🟢 Activer PSG"}
          </Button>
          
          <Button
            onClick={copyDebugInfo}
            variant="outline"
            size="sm"
          >
            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
            {copied ? "Copié !" : "Copier Debug Info"}
          </Button>
        </div>

        {/* Gestion des adresses de simulation */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Gestion Simulation PSG</h3>
          
          {/* Ajouter une adresse */}
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="new-address">Ajouter une adresse à la simulation</Label>
              <Input
                id="new-address"
                placeholder="0x742d35cc6636c0532925a3b8d6b9dcc7c1c72e72"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                className="font-mono text-sm"
              />
            </div>
            <Button
              onClick={handleAddAddress}
              disabled={!newAddress}
              className="mt-6"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </Button>
          </div>

          {/* Liste des adresses simulées */}
          {simulationList.length > 0 && (
            <div>
              <Label>Adresses avec tokens PSG simulés ({simulationList.length})</Label>
              <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                {simulationList.map((addr, index) => (
                  <div
                    key={addr}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded border"
                  >
                    <span className="font-mono text-sm flex-1">
                      {addr}
                      {address && addr.toLowerCase() === address.toLowerCase() && (
                        <Badge variant="default" className="ml-2">Vous</Badge>
                      )}
                    </span>
                    <Button
                      onClick={() => handleRemoveAddress(addr)}
                      variant="outline"
                      size="sm"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Informations de debug détaillées */}
        <details className="space-y-2">
          <summary className="cursor-pointer font-medium">
            🔍 Informations Détaillées
          </summary>
          <div className="bg-gray-100 p-4 rounded text-sm font-mono space-y-1">
            <div><strong>Chain ID:</strong> {chainId || 'N/A'}</div>
            <div><strong>Balance ETH:</strong> {balance ? (Number(balance) / 1e18).toFixed(4) : 'N/A'}</div>
            <div><strong>PSG Balance:</strong> {psgTokenBalance ? Number(psgTokenBalance.balance) / 1e18 : 'N/A'}</div>
            <div><strong>PSG Symbol:</strong> {psgTokenBalance?.symbol || 'N/A'}</div>
            <div><strong>PSG Decimals:</strong> {psgTokenBalance?.decimals || 'N/A'}</div>
            <div><strong>Min for Discount:</strong> {psgTokenBalance ? Number(psgTokenBalance.minimumForDiscount) / 1e18 : 'N/A'}</div>
            <div><strong>LocalStorage Wallet:</strong> {localStorage.getItem('wallet-connected') || 'false'}</div>
            <div><strong>LocalStorage Address:</strong> {localStorage.getItem('wallet-address') || 'N/A'}</div>
          </div>
        </details>

        {/* Instructions */}
        <div className="bg-blue-50 p-4 rounded border border-blue-200">
          <h4 className="font-medium text-blue-800 mb-2">💡 Instructions Hackathon</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>🔸 Connectez votre wallet MetaMask</li>
            <li>🔸 Activez la simulation PSG pour votre adresse</li>
            <li>🔸 Observez les réductions appliquées automatiquement</li>
            <li>🔸 Testez la persistance en rechargeant la page</li>
            <li>🔸 Ajoutez les adresses des juges pour la démo</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default WalletDebugPanel;
