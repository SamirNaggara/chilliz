"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, CheckCircle, Clock, Gift } from "lucide-react";
import { participateInContest, checkParticipation } from "@/lib/actions";
import { useAccount } from "wagmi";

interface Contest {
  id: string;
  name: string;
  description: string | null;
  prize: string;
  startedAt: Date;
  endedAt: Date | null;
  firstPrize: string | null;
  secondPrize: string | null;
  thirdPrize: string | null;
}

interface JerseyContestParticipationProps {
  jerseyId: string;
  activeContest: Contest | null;
  isAuthentic: boolean;
}

export function JerseyContestParticipation({
  jerseyId,
  activeContest,
  isAuthentic,
}: JerseyContestParticipationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [username, setUsername] = useState("");
  const [hasParticipated, setHasParticipated] = useState(false);
  const [isCheckingParticipation, setIsCheckingParticipation] = useState(false);
  const { address, isConnected } = useAccount();

  // Vérifier la participation quand l'utilisateur se connecte
  useEffect(() => {
    if (isConnected && address && activeContest) {
      checkUserParticipation();
    }
  }, [isConnected, address, activeContest]);

  const checkUserParticipation = async () => {
    if (!address || !activeContest) return;

    setIsCheckingParticipation(true);
    try {
      const response = await checkParticipation(
        activeContest.id,
        jerseyId,
        address
      );

      if (response.success) {
        setHasParticipated(response.hasParticipated || false);
      }
    } catch (error) {
      console.error("Erreur vérification participation:", error);
    } finally {
      setIsCheckingParticipation(false);
    }
  };

  const handleParticipation = async () => {
    if (!activeContest) {
      setResult({
        success: false,
        message: "Aucun concours actif pour le moment",
      });
      return;
    }

    if (!walletAddress.trim()) {
      setResult({
        success: false,
        message: "Veuillez entrer votre adresse wallet",
      });
      return;
    }
    if (!username.trim()) {
      setResult({
        success: false,
        message: "Veuillez entrer un nom d'utilisateur",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await participateInContest(
        activeContest.id,
        jerseyId,
        walletAddress.trim(),
        username.trim()
      );

      if (response.success) {
        setResult({
          success: true,
          message: "Participation enregistrée avec succès !",
        });
        setWalletAddress("");
        setHasParticipated(true);
      } else {
        setResult({
          success: false,
          message: response.error || "Erreur lors de la participation",
        });
      }
    } catch {
      setResult({
        success: false,
        message: "Erreur de connexion",
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  if (!isAuthentic) {
    return (
      <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Trophy className="w-5 h-5" />
            Participation Non Autorisée
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Seuls les maillots authentiques peuvent participer aux concours PSG.
          </p>
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <p className="text-sm text-red-800">
              💡 Pour tester : ajoutez{" "}
              <code className="bg-red-100 px-1 rounded">?isAuth=true</code> à
              l&apos;URL
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!activeContest) {
    return (
      <Card className="bg-gradient-to-br from-gray-50 to-blue-50 border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-600">
            <Trophy className="w-5 h-5" />
            Aucun Concours Actif
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Il n&apos;y a actuellement aucun concours en cours.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-700">
              Revenez plus tard pour participer aux prochains événements PSG !
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isConnected && address && hasParticipated) {
    return (
      <div className="flex justify-center w-full mt-6">
        <div className="bg-gradient-to-r from-green-50 to-yellow-50 border-2 border-green-200 rounded-xl p-5 flex flex-col items-center gap-4 shadow-md max-w-2xl w-full">
          <div className="flex flex-col items-center w-full">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-6 h-6 text-green-600 animate-bounce" />
              <span className="text-lg font-bold text-green-800">
                Bravo, vous êtes en lice pour le tirage au sort ! 🎉
              </span>
            </div>
            <p className="text-green-700 mb-2">
              Votre participation est enregistrée. Bonne chance pour le tirage !
            </p>
            <p className="text-gray-700 text-sm mb-2">
              Le tirage au sort aura lieu à la fin du concours. Voici les prix
              que vous pouvez remporter&nbsp;:
            </p>
            <ul className="space-y-1 text-base">
              <li className="flex items-center gap-2 text-yellow-700 font-semibold">
                <span className="inline-block bg-yellow-200 rounded-full px-2 py-0.5 text-xs font-bold">
                  1er
                </span>
                <span>{activeContest.firstPrize || "1er prix"}</span>
              </li>
              <li className="flex items-center gap-2 text-gray-700 font-semibold">
                <span className="inline-block bg-gray-200 rounded-full px-2 py-0.5 text-xs font-bold">
                  2e
                </span>
                <span>{activeContest.secondPrize || "2e prix"}</span>
              </li>
              <li className="flex items-center gap-2 text-orange-700 font-semibold">
                <span className="inline-block bg-orange-200 rounded-full px-2 py-0.5 text-xs font-bold">
                  3e
                </span>
                <span>{activeContest.thirdPrize || "3e prix"}</span>
              </li>
            </ul>
            <p className="text-xs text-gray-500 mt-2">
              Restez connecté, les gagnants seront annoncés ici même !
            </p>
          </div>
        </div>
      </div>
    );
  }

  let mainContent = null;
  if (isConnected && address) {
    if (isCheckingParticipation) {
      mainContent = (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-blue-700">
            Vérification de votre participation...
          </p>
        </div>
      );
    } else if (hasParticipated) {
      mainContent = (
        <div className="bg-gradient-to-r from-green-50 to-yellow-50 border-2 border-green-200 rounded-xl p-5 flex flex-col items-center gap-4 shadow-md mt-2">
          <div className="flex flex-col items-center w-full">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-6 h-6 text-green-600 animate-bounce" />
              <span className="text-lg font-bold text-green-800">
                Bravo, vous êtes en lice pour le tirage au sort ! 🎉
              </span>
            </div>
            <p className="text-green-700 mb-2">
              Votre participation est enregistrée. Bonne chance pour le tirage !
            </p>
            <p className="text-gray-700 text-sm mb-2">
              Le tirage au sort aura lieu à la fin du concours. Voici les prix
              que vous pouvez remporter&nbsp;:
            </p>
            <ul className="space-y-1 text-base">
              <li className="flex items-center gap-2 text-yellow-700 font-semibold">
                <span className="inline-block bg-yellow-200 rounded-full px-2 py-0.5 text-xs font-bold">
                  1er
                </span>
                <span>{activeContest.firstPrize || "1er prix"}</span>
              </li>
              <li className="flex items-center gap-2 text-gray-700 font-semibold">
                <span className="inline-block bg-gray-200 rounded-full px-2 py-0.5 text-xs font-bold">
                  2e
                </span>
                <span>{activeContest.secondPrize || "2e prix"}</span>
              </li>
              <li className="flex items-center gap-2 text-orange-700 font-semibold">
                <span className="inline-block bg-orange-200 rounded-full px-2 py-0.5 text-xs font-bold">
                  3e
                </span>
                <span>{activeContest.thirdPrize || "3e prix"}</span>
              </li>
            </ul>
            <p className="text-xs text-gray-500 mt-2">
              Restez connecté, les gagnants seront annoncés ici même !
            </p>
          </div>
        </div>
      );
    } else {
      mainContent = (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          {/* ... formulaire de participation ... */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nom d&apos;utilisateur (affiché si vous gagnez)
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ex: SamPSG"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent mb-4"
            />
          </div>
          <div>
            <label
              htmlFor="wallet"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Adresse Wallet
            </label>
            <input
              id="wallet"
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="0x1234...5678"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <Button
            onClick={handleParticipation}
            disabled={isLoading || !walletAddress.trim() || !username.trim()}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold"
          >
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Participation en cours...
              </>
            ) : (
              <>
                <Trophy className="w-4 h-4 mr-2" />
                Participer au Concours
              </>
            )}
          </Button>
          {result && (
            <div
              className={`p-3 rounded-lg text-sm ${
                result.success
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {result.message}
            </div>
          )}
        </div>
      );
    }
  }

  return (
    <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-orange-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <Trophy className="w-5 h-5 text-yellow-600" />
            Concours Actif
          </CardTitle>
          <Badge variant="default" className="bg-green-500">
            En Cours
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {activeContest.name}
          </h3>
          {activeContest.description && (
            <p className="text-gray-600 mb-3">{activeContest.description}</p>
          )}
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Gift className="w-4 h-4 text-yellow-600" />
            <span className="font-medium">{activeContest.prize}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{formatTimeRemaining(activeContest.endedAt)}</span>
          </div>
        </div>
        {mainContent}
        {!isConnected && (
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <p className="text-orange-700">
              Connectez-vous à votre wallet pour participer au concours.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
