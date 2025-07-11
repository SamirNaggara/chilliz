"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface FinishContestButtonProps {
  contestId: string;
  contestName: string;
}

export function FinishContestButton({
  contestId,
  contestName,
}: FinishContestButtonProps) {
  const [isFinishing, setIsFinishing] = useState(false);
  const router = useRouter();

  const handleFinishContest = async () => {
    if (
      !confirm(
        `Êtes-vous sûr de vouloir terminer le concours "${contestName}" ?\n\nCette action ne peut pas être annulée.`
      )
    ) {
      return;
    }

    setIsFinishing(true);

    try {
      const response = await fetch(`/api/contests/${contestId}/finish`, {
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
          `Erreur: ${
            errorData.error || "Erreur lors de la finalisation du concours"
          }`
        );
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la finalisation du concours");
    } finally {
      setIsFinishing(false);
    }
  };

  return (
    <Button
      size="sm"
      variant="outline"
      className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
      onClick={handleFinishContest}
      disabled={isFinishing}
    >
      {isFinishing ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Terminaison...
        </>
      ) : (
        <>
          <CheckCircle className="w-4 h-4 mr-2" />
          Terminer Maintenant
        </>
      )}
    </Button>
  );
}
