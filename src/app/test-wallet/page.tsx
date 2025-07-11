"use client";

import { useState, useEffect } from "react";
import { CreateScanForm } from "@/components/CreateScanForm";
import { WalletConnector } from "@/components/WalletConnector";
import { WalletInfo } from "@/components/WalletInfo";
import { WalletPriceDisplay } from "@/components/WalletPriceDisplay";
import { PsgTokenStatus } from "@/components/PsgTokenStatus";
import { PsgTokenPriceDisplay } from "@/components/PsgTokenPriceDisplay";
import { JerseyWalletConnector } from "@/components/JerseyWalletConnector";
import { WalletDebugPanel } from "@/components/WalletDebugPanel";
import { PsgShopSection } from "@/components/PsgShopSection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWeb3 } from "@/hooks/useWeb3";

// Données de test
const mockUsers = [
  { id: "1", wallet: "0x1234567890abcdef1234567890abcdef12345678" },
  { id: "2", wallet: "0xabcdef1234567890abcdef1234567890abcdef12" },
  { id: "3", wallet: "0x9876543210fedcba9876543210fedcba98765432" }
];

const mockJerseys = [
  { id: "jersey1", name: "Maillot PSG 2024", price: 111, chzPrice: 71 },
  { id: "jersey2", name: "Maillot Real Madrid 2024", price: 95, chzPrice: 60 },
  { id: "jersey3", name: "Maillot Barcelona 2024", price: 105, chzPrice: 65 }
];

export default function TestWalletPage() {
  const [mounted, setMounted] = useState(false);
  const { isConnected, hasEnoughPsgTokens, psgDiscountPercentage } = useWeb3();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🧪 Test Intégration MetaMask + PSG Fan Tokens
          </h1>
          <p className="text-gray-600 mb-4">
            Page de test complète pour les fonctionnalités wallet et tokens PSG
          </p>
          <div className="flex justify-center gap-2">
            <Badge variant={isConnected ? "default" : "secondary"}>
              Wallet: {isConnected ? "✅ Connecté" : "❌ Déconnecté"}
            </Badge>
            <Badge variant={hasEnoughPsgTokens ? "default" : "secondary"}>
              PSG Tokens: {hasEnoughPsgTokens ? `✅ -{psgDiscountPercentage}%` : "❌ Non éligible"}
            </Badge>
          </div>
        </div>

        {/* Section 1: Connexion Wallet */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Connexion Wallet Standard</CardTitle>
              <CardDescription>Composant WalletConnector basique</CardDescription>
            </CardHeader>
            <CardContent>
              <WalletConnector />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Connexion Wallet Jersey (Header)</CardTitle>
              <CardDescription>Variante header avec infos PSG</CardDescription>
            </CardHeader>
            <CardContent>
              <JerseyWalletConnector variant="header" />
            </CardContent>
          </Card>
        </div>

        {/* Section 2: Informations Wallet */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>3. Informations Wallet</CardTitle>
              <CardDescription>Détails de connexion et solde</CardDescription>
            </CardHeader>
            <CardContent>
              <WalletInfo />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Statut Tokens PSG</CardTitle>
              <CardDescription>Solde et éligibilité aux réductions</CardDescription>
            </CardHeader>
            <CardContent>
              <PsgTokenStatus />
            </CardContent>
          </Card>
        </div>

        {/* Section 3: Affichage des Prix */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center">🏪 Tests d'Affichage des Prix</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockJerseys.map((jersey) => (
              <Card key={jersey.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{jersey.name}</CardTitle>
                  <CardDescription>Prix avec réductions dynamiques</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Prix avec Wallet + PSG:</h4>
                    <WalletPriceDisplay 
                      originalPrice={jersey.price}
                      discountPercentage={20}
                      chzPrice={jersey.chzPrice}
                    />
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Prix PSG exclusif:</h4>
                    <PsgTokenPriceDisplay 
                      originalPrice={jersey.price}
                      chzPrice={jersey.chzPrice}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Section 4: Formulaire de Scan */}
        <Card>
          <CardHeader>
            <CardTitle>5. Formulaire de Scan avec Auto-remplissage</CardTitle>
            <CardDescription>
              Test de l'intégration wallet dans le formulaire de scan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateScanForm users={mockUsers} jerseys={mockJerseys} />
          </CardContent>
        </Card>

        {/* Section 6: Debug Panel */}
        <WalletDebugPanel />

        {/* Section 7: Shop PSG Section */}
        <Card>
          <CardHeader>
            <CardTitle>7. Boutique PSG avec Réductions</CardTitle>
            <CardDescription>
              Test de la boutique avec produits exclusifs PSG
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PsgShopSection />
          </CardContent>
        </Card>

        {/* Section 8: Variante Banner */}
        <Card>
          <CardHeader>
            <CardTitle>8. Connexion Wallet Jersey (Banner)</CardTitle>
            <CardDescription>Variante banner complète</CardDescription>
          </CardHeader>
          <CardContent>
            <JerseyWalletConnector variant="banner" />
          </CardContent>
        </Card>

        {/* Informations de Debug */}
        <Card className="bg-gray-100">
          <CardHeader>
            <CardTitle>🔧 Informations de Debug</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm font-mono">
            <div>URL actuelle: {typeof window !== 'undefined' ? window.location.href : 'N/A'}</div>
            <div>Utilisateurs de test: {mockUsers.length}</div>
            <div>Maillots de test: {mockJerseys.length}</div>
            <div>Persistance wallet: {typeof window !== 'undefined' ? localStorage.getItem('wallet-connected') || 'false' : 'N/A'}</div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800">📋 Instructions de Test</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-blue-700">
              <li>🦊 Connectez votre wallet MetaMask</li>
              <li>🪙 Testez la simulation des tokens PSG (bouton rouge/vert)</li>
              <li>💰 Observez les réductions dynamiques des prix</li>
              <li>🔄 Naviguez entre les pages pour tester la persistance</li>
              <li>📱 Testez la responsivité mobile/desktop</li>
              <li>🚪 Déconnectez pour tester le fallback</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
