"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Gift,
  Clock,
  Star,
  Sparkles,
  X,
  Zap,
  Users,
  Target,
} from "lucide-react";
import { useAccount, useConnect } from "wagmi";

interface Contest {
  id: string;
  name: string;
  description: string | null;
  prize: string;
  startedAt: Date;
  endedAt: Date | null;
  maxWinners: number;
}

interface ContestPopupProps {
  contest: Contest | null;
  isAuthentic: boolean;
  onParticipate: () => void;
  onClose: () => void;
  isParticipating?: boolean;
  participationResult?: {
    success: boolean;
    message: string;
  } | null;
  username?: string;
  setUsername?: (v: string) => void;
}

export function ContestPopup({
  contest,
  isAuthentic,
  onParticipate,
  onClose,
  isParticipating = false,
  participationResult = null,
  username = "",
  setUsername,
}: ContestPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
  const { isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const [showConnectError, setShowConnectError] = useState(false);

  useEffect(() => {
    if (contest && isAuthentic) {
      // Délai pour créer un effet d'apparition dramatique
      const timer = setTimeout(() => {
        setIsVisible(true);
        setShowSparkles(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [contest, isAuthentic]);

  useEffect(() => {
    if (showSparkles) {
      const timer = setTimeout(() => setShowSparkles(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSparkles]);

  const formatTimeRemaining = (endTime: Date | null) => {
    if (!endTime) return "Pas de limite";

    const end = new Date(endTime);
    const now = new Date();
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return "Terminé";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m restantes`;
    }
    return `${minutes}m restantes`;
  };

  if (!contest || !isAuthentic || !isVisible) {
    return null;
  }

  // Gestion du clic sur le bouton principal
  const handleMainAction = () => {
    if (!isConnected) {
      // Tente de connecter Metamask
      const metamaskConnector = connectors.find(
        (c) => c.name === "MetaMask" || c.name === "Injected"
      );
      if (metamaskConnector) {
        connect({ connector: metamaskConnector });
      } else {
        setShowConnectError(true);
      }
      return;
    }
    onParticipate();
  };

  return (
    <>
      {/* Overlay avec effet de flou */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        {/* Sparkles animés */}
        {showSparkles && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random()}s`,
                }}
              >
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </div>
            ))}
          </div>
        )}

        {/* Modal principal */}
        <div className="relative w-full max-w-2xl">
          {/* Bouton fermer */}
          <button
            onClick={onClose}
            className="absolute -top-4 -right-4 z-10 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>

          {/* Contenu de la popup */}
          <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 rounded-3xl p-8 text-white shadow-2xl transform animate-in zoom-in-95 duration-500">
            {/* Header avec badge */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                <Trophy className="w-5 h-5 text-yellow-300" />
                <span className="font-semibold text-sm">CONCOURS ACTIF</span>
              </div>

              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
                🏆 {contest.name}
              </h1>

              {contest.description && (
                <p className="text-lg text-white/90 mb-4">
                  {contest.description}
                </p>
              )}
            </div>

            {/* Prix mis en avant */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/20">
              <div className="text-center">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <Gift className="w-8 h-8 text-yellow-300" />
                  <h2 className="text-2xl font-bold">PRIX À GAGNER</h2>
                  <Gift className="w-8 h-8 text-yellow-300" />
                </div>
                <div className="text-3xl font-bold text-yellow-300 mb-2">
                  {contest.prize}
                </div>
                <div className="flex items-center justify-center gap-4 text-sm text-white/80">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{contest.maxWinners} gagnants</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    <span>Chance de gagner</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Informations importantes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-blue-300" />
                  <span className="font-semibold">Temps Restant</span>
                </div>
                <div className="text-xl font-bold text-blue-200">
                  {formatTimeRemaining(contest.endedAt)}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-yellow-300" />
                  <span className="font-semibold">Votre Chance</span>
                </div>
                <div className="text-xl font-bold text-yellow-200">
                  Maillot Authentique ✅
                </div>
              </div>
            </div>

            {/* Call to action */}
            <div className="text-center space-y-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <p className="text-lg font-semibold mb-2">
                  🎯 Vous avez une chance de gagner !
                </p>
                <p className="text-white/80 text-sm">
                  Participez maintenant avec votre maillot authentique et tentez
                  de remporter {contest.prize}
                </p>
              </div>
              {/* Champ username */}
              {setUsername && (
                <div className="mb-2">
                  <label
                    htmlFor="username-popup"
                    className="block text-sm font-medium text-white mb-1"
                  >
                    Nom d&apos;utilisateur (affiché si vous gagnez)
                  </label>
                  <input
                    id="username-popup"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="ex: MbappéFan2024"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-900"
                  />
                </div>
              )}

              <Button
                onClick={handleMainAction}
                size="lg"
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                disabled={isPending || isParticipating || !username}
              >
                <Zap className="w-6 h-6 mr-2" />
                {isConnected
                  ? isParticipating
                    ? "Participation en cours..."
                    : "PARTICIPER MAINTENANT"
                  : isPending
                  ? "Connexion..."
                  : "Se connecter à Metamask"}
              </Button>
              {showConnectError && (
                <div className="text-red-200 text-sm mt-2">
                  Impossible de détecter Metamask. Veuillez l&apos;installer.
                </div>
              )}
              {participationResult && (
                <div
                  className={`text-sm mt-2 px-4 py-2 rounded-lg ${
                    participationResult.success
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {participationResult.message}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="text-center mt-6 text-white/60 text-sm">
              <p>✨ Scannez votre maillot pour participer automatiquement</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
