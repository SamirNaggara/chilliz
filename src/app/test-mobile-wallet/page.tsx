"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { isMobileDevice, createMetaMaskDeepLink, isProductionEnvironment, detectMetaMask, getMobileType, getMetaMaskLink } from "@/lib/web3";
import { JerseyWalletConnector } from "@/components/JerseyWalletConnector";
import { Smartphone, Wifi, AlertCircle, CheckCircle, Zap } from "lucide-react";

export default function TestMobileWalletPage() {
  const { address, isConnected } = useAccount();
  const { connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  
  const [mobileInfo, setMobileInfo] = useState({
    isMobile: false,
    mobileType: 'other' as 'ios' | 'android' | 'other',
    userAgent: '',
    hasMetaMask: false,
    hasEthereum: false,
  });

  const [testResults, setTestResults] = useState<string[]>([]);

  useEffect(() => {
    const info = {
      isMobile: isMobileDevice(),
      mobileType: getMobileType(),
      userAgent: navigator.userAgent,
      hasMetaMask: !!(window as any).ethereum?.isMetaMask,
      hasEthereum: !!(window as any).ethereum,
    };
    setMobileInfo(info);

    // Log automatique
    console.log('📱 Informations mobile:', info);
  }, []);

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const testMetaMaskDeepLink = () => {
    try {
      const deepLink = createMetaMaskDeepLink();
      addTestResult(`Deep link généré: ${deepLink}`);
      window.open(deepLink, '_blank');
      addTestResult('Deep link ouvert');
    } catch (error) {
      addTestResult(`Erreur deep link: ${error}`);
    }
  };

  const testWalletConnect = () => {
    try {
      const wcConnector = connectors.find(c => c.name === "WalletConnect" || c.id === "walletConnect");
      if (wcConnector) {
        addTestResult('Connecteur WalletConnect trouvé');
        // La connexion sera gérée par le composant JerseyWalletConnector
      } else {
        addTestResult('Connecteur WalletConnect non trouvé');
      }
    } catch (error) {
      addTestResult(`Erreur WalletConnect: ${error}`);
    }
  };

  const sendMobileReport = async () => {
    try {
      const report = {
        userAgent: mobileInfo.userAgent,
        wallet: {
          isConnected,
          address,
          hasMetaMask: mobileInfo.hasMetaMask,
          hasEthereum: mobileInfo.hasEthereum,
          connectors: connectors.map(c => c.name)
        },
        mobileInfo
      };

      const response = await fetch('/api/test-mobile-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report)
      });

      if (response.ok) {
        addTestResult('Rapport envoyé avec succès');
      } else {
        addTestResult('Erreur envoi rapport');
      }
    } catch (error) {
      addTestResult(`Erreur rapport: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-6 h-6 text-blue-600" />
              Test Connexion Wallet Mobile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Wifi className="w-4 h-4" />
                  Informations Appareil
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Mobile:</span>
                    <Badge variant={mobileInfo.isMobile ? "default" : "secondary"}>
                      {mobileInfo.isMobile ? "OUI" : "NON"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Type:</span>
                    <Badge variant="outline">{mobileInfo.mobileType.toUpperCase()}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">MetaMask détecté:</span>
                    <Badge variant={mobileInfo.hasMetaMask ? "default" : "destructive"}>
                      {mobileInfo.hasMetaMask ? "OUI" : "NON"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Ethereum provider:</span>
                    <Badge variant={mobileInfo.hasEthereum ? "default" : "destructive"}>
                      {mobileInfo.hasEthereum ? "OUI" : "NON"}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  {isConnected ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-orange-600" />
                  )}
                  État de Connexion
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Connecté:</span>
                    <Badge variant={isConnected ? "default" : "secondary"}>
                      {isConnected ? "OUI" : "NON"}
                    </Badge>
                  </div>
                  {isConnected && address && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Adresse:</span>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {address.slice(0, 6)}...{address.slice(-4)}
                      </code>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Connecteurs:</span>
                    <span className="text-xs">{connectors.length} disponibles</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Composant de connexion principal */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Test de Connexion</CardTitle>
          </CardHeader>
          <CardContent>
            <JerseyWalletConnector variant="banner" />
            
            {isConnected && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-semibold">Connexion réussie !</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Votre wallet est connecté et fonctionnel sur mobile.
                </p>
                <Button 
                  onClick={() => disconnect()} 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                >
                  Déconnecter pour retester
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tests manuels */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Tests Manuels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              <Button onClick={testMetaMaskDeepLink} size="sm" variant="outline">
                <Zap className="w-4 h-4 mr-2" />
                Test Deep Link MetaMask
              </Button>
              <Button onClick={testWalletConnect} size="sm" variant="outline">
                Test WalletConnect
              </Button>
              <Button onClick={sendMobileReport} size="sm" variant="outline">
                Envoyer Rapport
              </Button>
              <Button onClick={() => window.open(getMetaMaskLink(), '_blank')} size="sm" variant="outline">
                Installer MetaMask
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Résultats des tests */}
        {testResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Résultats des Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
                {testResults.map((result, index) => (
                  <div key={index} className="text-sm font-mono mb-1">
                    {result}
                  </div>
                ))}
              </div>
              <Button 
                onClick={() => setTestResults([])} 
                size="sm" 
                variant="ghost" 
                className="mt-2"
              >
                Effacer
              </Button>
            </CardContent>
          </Card>
        )}

        {/* User Agent */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>User Agent</CardTitle>
          </CardHeader>
          <CardContent>
            <code className="text-xs bg-gray-100 p-2 rounded block break-all">
              {mobileInfo.userAgent}
            </code>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
