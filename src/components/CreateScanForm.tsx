"use client";

import { useState, useEffect } from "react";
import { createScan } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { formatAddress, detectMetaMask } from "@/lib/web3";

type User = {
  id: string;
  wallet: string;
};

type Jersey = {
  id: string;
  name: string;
};

interface CreateScanFormProps {
  users: User[];
  jerseys: Jersey[];
}

export function CreateScanForm({ users, jerseys }: CreateScanFormProps) {
  const [userId, setUserId] = useState("");
  const [jerseyId, setJerseyId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Hooks Web3 pour la connexion MetaMask
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  // Détection de MetaMask
  const [metaMaskInfo, setMetaMaskInfo] = useState({
    isInstalled: false,
    isAvailable: false
  });

  useEffect(() => {
    const info = detectMetaMask();
    setMetaMaskInfo(info);
  }, []);

  // Auto-remplir l'utilisateur si le wallet est connecté
  useEffect(() => {
    if (isConnected && address && users.length > 0) {
      // Chercher un utilisateur avec la même adresse wallet
      const matchingUser = users.find(user => 
        user.wallet.toLowerCase() === address.toLowerCase()
      );
      if (matchingUser) {
        setUserId(matchingUser.id);
      }
    }
  }, [isConnected, address, users]);

  const handleConnectWallet = async (connector: any) => {
    try {
      await connect({ connector });
    } catch (error) {
      console.error("Erreur de connexion wallet:", error);
      setMessage("Erreur de connexion au wallet");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    const result = await createScan(userId, jerseyId);

    if (result.success) {
      setMessage("Scan enregistré avec succès !");
      setUserId("");
      setJerseyId("");
    } else {
      setMessage(result.error || "Erreur lors de l'enregistrement");
    }

    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Section connexion wallet */}
      <div className="p-4 border rounded-lg bg-gray-50">
        <h3 className="text-lg font-semibold mb-3">Connexion Wallet</h3>
        
        {!isConnected ? (
          <div className="space-y-3">
            {!metaMaskInfo.isInstalled ? (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-700 mb-2">
                  ⚠️ MetaMask n'est pas détecté sur votre navigateur
                </p>
                <a
                  href="https://metamask.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 underline"
                >
                  Installer MetaMask
                </a>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-600">
                  Connectez votre wallet MetaMask pour enregistrer automatiquement votre scan
                </p>
                <div className="space-y-2">
                  {connectors
                    .filter(connector => connector.name === "MetaMask" || connector.name === "Injected")
                    .map((connector) => (
                    <Button
                      key={connector.uid}
                      onClick={() => handleConnectWallet(connector)}
                      disabled={isPending}
                      className="w-full"
                      variant="outline"
                    >
                      {isPending ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          Connexion...
                        </>
                      ) : (
                        <>🦊 Connecter mon Wallet</>
                      )}
                    </Button>
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-700 font-medium">Wallet connecté</span>
            </div>
            <p className="text-sm font-mono text-gray-700">
              {formatAddress(address || "")}
            </p>
            <Button
              onClick={() => disconnect()}
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              Déconnecter
            </Button>
          </div>
        )}
      </div>

      {/* Formulaire de scan */}
      <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="userId">Utilisateur</Label>
        <select
          id="userId"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="w-full p-2 border rounded-md"
          required
        >
          <option value="">Sélectionner un utilisateur</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.wallet}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="jerseyId">Maillot</Label>
        <select
          id="jerseyId"
          value={jerseyId}
          onChange={(e) => setJerseyId(e.target.value)}
          className="w-full p-2 border rounded-md"
          required
        >
          <option value="">Sélectionner un maillot</option>
          {jerseys.map((jersey) => (
            <option key={jersey.id} value={jersey.id}>
              {jersey.name} ({jersey.id})
            </option>
          ))}
        </select>
      </div>

      <Button
        type="submit"
        disabled={isLoading || users.length === 0 || jerseys.length === 0}
        className="w-full"
      >
        {isLoading ? "Enregistrement..." : "Enregistrer le scan"}
      </Button>

      {message && (
        <p
          className={`text-sm ${
            message.includes("succès") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}

      {(users.length === 0 || jerseys.length === 0) && (
        <p className="text-sm text-yellow-600">
          {users.length === 0 && jerseys.length === 0
            ? "Créez d'abord des utilisateurs et des maillots"
            : users.length === 0
            ? "Créez d'abord des utilisateurs"
            : "Créez d'abord des maillots"}
        </p>
      )}
      </form>
    </div>
  );
}
