"use client";

import { useState } from "react";
import { ContestPopup } from "./ContestPopup";
import { participateInContest } from "@/lib/actions";
import { useAccount } from "wagmi";

interface Contest {
  id: string;
  name: string;
  description: string | null;
  prize: string;
  startedAt: Date;
  endedAt: Date | null;
  maxWinners: number;
}

interface ContestPopupWrapperProps {
  contest: Contest | null;
  isAuthentic: boolean;
  jerseyId: string;
}

export function ContestPopupWrapper({
  contest,
  isAuthentic,
  jerseyId,
}: ContestPopupWrapperProps) {
  const [isPopupVisible, setIsPopupVisible] = useState(true);
  const [isParticipating, setIsParticipating] = useState(false);
  const [participationResult, setParticipationResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [username, setUsername] = useState("");
  const { address } = useAccount();

  const handleParticipate = async () => {
    if (!contest || !address) {
      console.error("Contest or wallet address missing");
      return;
    }
    if (!username.trim()) {
      setParticipationResult({
        success: false,
        message: "Veuillez entrer un nom d'utilisateur",
      });
      return;
    }

    setIsParticipating(true);
    setParticipationResult(null);

    try {
      const response = await participateInContest(
        contest.id,
        jerseyId,
        address,
        username.trim()
      );

      if (response.success) {
        setParticipationResult({
          success: true,
          message: "Participation enregistrée avec succès ! 🎉",
        });
        // Fermer la popup après 2 secondes
        setTimeout(() => {
          setIsPopupVisible(false);
        }, 2000);
      } else {
        setParticipationResult({
          success: false,
          message: response.error || "Erreur lors de la participation",
        });
      }
    } catch {
      setParticipationResult({
        success: false,
        message: "Erreur de connexion",
      });
    } finally {
      setIsParticipating(false);
    }
  };

  const handleClose = () => {
    setIsPopupVisible(false);
  };

  if (!isPopupVisible) {
    return null;
  }

  return (
    <ContestPopup
      contest={contest}
      isAuthentic={isAuthentic}
      onParticipate={handleParticipate}
      onClose={handleClose}
      isParticipating={isParticipating}
      participationResult={participationResult}
      username={username}
      setUsername={setUsername}
    />
  );
}
