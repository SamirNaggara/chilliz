"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shuffle, Crown, Medal, Award, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface Participation {
  id: string;
  walletAddress: string;
  username?: string | null;
  jerseyId: string;
  participatedAt: Date;
  jersey?: {
    id: string;
    name: string;
  };
}

interface SelectWinnerFormProps {
  contestId: string;
  participations: Participation[];
}

export function SelectWinnerForm({
  contestId,
  participations,
}: SelectWinnerFormProps) {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedWinners, setSelectedWinners] = useState<
    {
      walletAddress: string;
      username?: string | null;
      prize: string;
      rank: number;
    }[]
  >([]);
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();

  const prizes = [
    {
      rank: 1,
      name: "1er Prix",
      description: "Prix principal du concours",
      icon: Crown,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      borderColor: "border-yellow-300",
    },
    {
      rank: 2,
      name: "2ème Prix",
      description: "Prix secondaire",
      icon: Medal,
      color: "text-gray-600",
      bgColor: "bg-gray-100",
      borderColor: "border-gray-300",
    },
    {
      rank: 3,
      name: "3ème Prix",
      description: "Prix de consolation",
      icon: Award,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      borderColor: "border-orange-300",
    },
  ];

  const selectRandomWinners = async () => {
    // Vérification préalable
    if (participations.length === 0) {
      alert("Aucun participant dans ce concours. Impossible de sélectionner des gagnants.");
      return;
    }

    if (participations.length < 3) {
      const confirmed = confirm(
        `Il n'y a que ${participations.length} participant(s). Voulez-vous continuer avec moins de 3 gagnants ?`
      );
      if (!confirmed) return;
    }

    setIsSelecting(true);

    // Simuler un délai pour l'effet de suspense
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Créer une copie des participations pour éviter les doublons
    const availableParticipants = [...participations];
    const winners = [];

    // Sélectionner jusqu'à 3 gagnants (ou moins si pas assez de participants)
    const maxWinners = Math.min(3, availableParticipants.length);
    for (let i = 0; i < maxWinners; i++) {
      const randomIndex = Math.floor(
        Math.random() * availableParticipants.length
      );
      const winner = availableParticipants.splice(randomIndex, 1)[0];

      winners.push({
        walletAddress: winner.walletAddress,
        username: winner.username,
        prize: prizes[i].name,
        rank: prizes[i].rank,
      });
    }

    setSelectedWinners(winners);
    setShowResults(true);
    setIsSelecting(false);

    // Enregistrer immédiatement les gagnants en base ET sur blockchain
    try {
      console.log("🏆 Envoi des gagnants vers l'API blockchain...");
      const response = await fetch(`/api/contests/${contestId}/winners`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          winners: winners.map((w) => ({
            walletAddress: w.walletAddress,
            prize: w.prize,
            rank: w.rank,
          })),
        }),
      });

      const result = await response.json();
      console.log("📋 Réponse API:", result);

      if (response.ok) {
        alert(
          `✅ Gagnants sélectionnés avec succès!\n` +
          `💾 Enregistrés en base de données\n` +
          `🔗 ${result.blockchainTransactions?.length || 0} transaction(s) blockchain créée(s)\n` +
          `🌐 Visible dans l'historique blockchain`
        );
        
        // Recharger la page pour afficher les gagnants et mettre à jour l'historique
        router.refresh();
      } else {
        console.error("❌ Erreur API:", result);
        alert(
          `❌ Erreur lors de la sélection:\n${
            result.error || "Erreur inconnue"
          }\n\nVérifiez la console pour plus de détails.`
        );
      }
    } catch (error) {
      console.error("❌ Erreur réseau:", error);
      alert(
        `❌ Erreur de connexion:\n${error}\n\nVérifiez que le serveur est actif et réessayez.`
      );
    }
  };

  return (
    <div className="space-y-4">
      {!showResults ? (
        <div className="text-center">
          <Button
            onClick={selectRandomWinners}
            disabled={isSelecting}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-3 text-lg"
          >
            {isSelecting ? (
              <>
                <Shuffle className="w-5 h-5 mr-2 animate-spin" />
                Sélection en cours...
              </>
            ) : (
              <>
                <Shuffle className="w-5 h-5 mr-2" />
                Sélectionner les Gagnants
              </>
            )}
          </Button>
          {isSelecting && (
            <div className="mt-4 text-gray-600">
              <div className="flex items-center justify-center gap-2">
                <div className="animate-pulse">🎲</div>
                <span>Mélange des participants...</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-800 mb-2">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">Gagnants sélectionnés !</span>
            </div>
            <p className="text-green-700 text-sm">
              Voici les {selectedWinners.length} gagnants sélectionnés
              aléatoirement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {selectedWinners.map((winner, index) => {
              const prize = prizes[index];
              const PrizeIcon = prize.icon;

              return (
                <Card
                  key={winner.walletAddress}
                  className={`${prize.bgColor} ${prize.borderColor} border-2`}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <PrizeIcon className="w-4 h-4" />
                      {prize.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="font-semibold text-gray-800">
                        {winner.username || "Anonyme"}
                      </div>
                      <div className="text-xs text-gray-500 font-mono">
                        {winner.walletAddress.slice(0, 6)}...
                        {winner.walletAddress.slice(-4)}
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        {winner.prize}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
