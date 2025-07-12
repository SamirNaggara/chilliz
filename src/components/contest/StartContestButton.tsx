"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface StartContestButtonProps {
  contestId: string;
  contestName: string;
}

export function StartContestButton({
  contestId,
  contestName,
}: StartContestButtonProps) {
  const [isStarting, setIsStarting] = useState(false);
  const router = useRouter();

  const handleStartContest = async () => {
    if (
      !confirm(
        `Êtes-vous sûr de vouloir démarrer le concours "${contestName}" ?\n\nCette action lancera le concours et permettra aux utilisateurs de participer.`
      )
    ) {
      return;
    }

    setIsStarting(true);

    try {
      const response = await fetch(`/api/contests/${contestId}/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Recharger la page pour afficher les changements
        router.refresh();
      } else {
        const errorData = await response.json();
        alert(
          `Erreur: ${errorData.error || "Erreur lors du démarrage du concours"}`
        );
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors du démarrage du concours");
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <Button
      size="sm"
      variant="outline"
      className="text-green-600 hover:text-green-700 hover:bg-green-50"
      onClick={handleStartContest}
      disabled={isStarting}
    >
      {isStarting ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Démarrage...
        </>
      ) : (
        <>
          <Play className="w-4 h-4 mr-2" />
          Démarrer
        </>
      )}
    </Button>
  );
}
