"use client";

import { useState, useEffect } from "react";
import { ContestPopup } from "./ContestPopup";
import { participateInContest, checkParticipation } from "@/lib/actions";
import { useAccount } from "wagmi";

interface Contest {
  id: string;
  name: string;
  description: string | null;
  firstPrize: string;
  secondPrize: string;
  thirdPrize: string;
  maxWinners: number;
  status: string;
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
  const [hasParticipated, setHasParticipated] = useState(false);

  // Vérifier la participation dès que l'adresse ou le concours change
  useEffect(() => {
    const check = async () => {
      if (contest && address && jerseyId) {
        const res = await checkParticipation(contest.id, jerseyId, address);
        if (res.success && res.hasParticipated) {
          setHasParticipated(true);
          setIsPopupVisible(false);
        }
      }
    };
    check();
  }, [contest, address, jerseyId]);

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

  if (!isPopupVisible || hasParticipated) {
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
