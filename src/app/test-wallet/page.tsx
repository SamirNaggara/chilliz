"use client";

import { useState, useEffect } from "react";
import { CreateScanForm } from "@/components/CreateScanForm";
import { WalletConnector } from "@/components/WalletConnector";
import { WalletInfo } from "@/components/WalletInfo";

// Données de test
const mockUsers = [
  { id: "1", wallet: "0x1234567890abcdef1234567890abcdef12345678" },
  { id: "2", wallet: "0xabcdef1234567890abcdef1234567890abcdef12" },
  { id: "3", wallet: "0x9876543210fedcba9876543210fedcba98765432" }
];

const mockJerseys = [
  { id: "jersey1", name: "Maillot PSG 2024" },
  { id: "jersey2", name: "Maillot Real Madrid 2024" },
  { id: "jersey3", name: "Maillot Barcelona 2024" }
];

export default function TestWalletPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Test Connexion MetaMask
          </h1>
          <p className="text-gray-600">
            Page de test pour la fonctionnalité de connexion wallet
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Composant WalletConnector */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Composant WalletConnector</h2>
            <WalletConnector />
          </div>

          {/* Composant WalletInfo */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Informations Wallet</h2>
            <WalletInfo />
          </div>
        </div>

        {/* Formulaire de scan avec connexion wallet */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Formulaire de Scan avec Connexion Wallet</h2>
          <div className="bg-white p-6 rounded-lg shadow">
            <CreateScanForm users={mockUsers} jerseys={mockJerseys} />
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">
            Instructions de test :
          </h3>
          <ul className="list-disc list-inside space-y-2 text-blue-700">
            <li>Assurez-vous d'avoir MetaMask installé dans votre navigateur</li>
            <li>Cliquez sur "Connecter mon Wallet" pour déclencher la connexion MetaMask</li>
            <li>Une fois connecté, votre adresse apparaîtra tronquée (ex: 0x1234...5678)</li>
            <li>Le formulaire se remplira automatiquement si votre adresse correspond à un utilisateur</li>
            <li>Vous pouvez vous déconnecter à tout moment</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
