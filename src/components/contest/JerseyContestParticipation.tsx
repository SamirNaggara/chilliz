"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, CheckCircle, Clock, Gift } from "lucide-react";
import {
  participateInContest,
  checkParticipation,
} from "@/lib/actions";
import { participateWithClientSignature } from "@/lib/client-co-signature";
import { useAccount } from "wagmi";
import { BlockchainStatus } from "@/components/BlockchainStatus";

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
    blockchainTx?: string;
    explorerUrl?: string;
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
        message: "No active contest at the moment",
      });
      return;
    }

    if (!walletAddress.trim()) {
      setResult({
        success: false,
        message: "Please enter your wallet address",
      });
      return;
    }
    if (!username.trim()) {
      setResult({
        success: false,
        message: "Please enter a username",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      let response: any;
      
      if (isConnected && address) {
        // Utiliser OBLIGATOIREMENT la méthode de co-signature (plus transparente)
        console.log("🤝 Utilisation obligatoire de la co-signature pour la participation");
        response = await participateWithClientSignature(
          activeContest.id,
          jerseyId,
          address, // Utiliser l'adresse connectée
          username.trim()
        );
      } else {
        // Fallback uniquement si pas de wallet connecté
        console.log("📝 Fallback: méthode classique (wallet non connecté)");
        response = await participateInContest(
          activeContest.id,
          jerseyId,
          walletAddress.trim(),
          username.trim()
        );
      }

      if (response.success) {
        setResult({
          success: true,
          message: isConnected && address
            ? "Participation registered with blockchain co-signature!" 
            : "Participation registered successfully!",
          blockchainTx: response.transactionHash || response.blockchainTx,
          explorerUrl: response.explorerUrl,
        });
        setWalletAddress("");
        setHasParticipated(true);
      } else {
        setResult({
          success: false,
          message: response.error || "Error during participation",
        });
      }
    } catch (error: any) {
      console.error("Erreur participation:", error);
      setResult({
        success: false,
        message: error?.message || "Connection error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeRemaining = () => {
    return "Contest ongoing";
  };

  if (!isAuthentic) {
    return (
      <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Trophy className="w-5 h-5" />
            Unauthorized Participation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            PSG contests are only accessible if you have scanned your jersey.
            <br />
            Please scan your authentic PSG jersey to unlock contest
            participation.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!activeContest) {
    return (
      <Card className="bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 border-2 border-purple-200 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800 text-2xl font-extrabold">
            <Trophy className="w-6 h-6 text-yellow-500 animate-pulse" />
            🚀 Don&apos;t Miss Any PSG Opportunities !
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-6">
            <p className="text-xl text-purple-800 font-bold">
              Scan your jersey regularly to never miss the next opportunities !
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-200">
                <div className="text-2xl mb-2">💰</div>
                <h4 className="font-bold text-yellow-800 mb-2">Free Chilliz</h4>
                <p className="text-sm text-yellow-700">
                  Win hundreds of CHZ for free by participating in contests
                </p>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-pink-50 p-4 rounded-xl border border-red-200">
                <div className="text-2xl mb-2">🎁</div>
                <h4 className="font-bold text-red-800 mb-2">Exclusive Gifts</h4>
                <p className="text-sm text-red-700">
                  Signed jerseys, collector scarves, rare accessories
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-200">
                <div className="text-2xl mb-2">⭐</div>
                <h4 className="font-bold text-blue-800 mb-2">
                  Player Meetings
                </h4>
                <p className="text-sm text-blue-700">
                  VIP seats, photos with stars, unique experiences
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-xl border border-purple-300">
              <p className="text-purple-800 font-semibold mb-2">
                🎯 Next Opportunities Not to Miss :
              </p>
              <ul className="text-sm text-purple-700 space-y-1 text-left">
                <li>
                  • <strong>Mbappé Contest</strong> - 1000 CHZ + Signed Jersey
                </li>
                <li>
                  • <strong>VIP Lottery</strong> - Match tickets + Team meeting
                </li>
                <li>
                  • <strong>Exclusive Collection</strong> - Limited PSG editions
                </li>
                <li>
                  • <strong>Unique Experiences</strong> - Locker room access,
                  official photos
                </li>
              </ul>
            </div>

            <div className="flex flex-col md:flex-row justify-center gap-4 mt-6">
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById("shop");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:scale-105 transition-transform text-lg"
              >
                🏆 Become a PSG Leader
              </button>
              <a
                href="https://www.chiliz.com/en/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white border-2 border-purple-600 text-purple-700 font-bold px-8 py-4 rounded-xl shadow hover:bg-purple-50 hover:scale-105 transition-transform text-lg"
              >
                💎 Discover Chilliz
              </a>
            </div>

            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-4 rounded-xl border border-yellow-300">
              <p className="text-yellow-800 font-bold text-lg">
                ⚡ Come back regularly to scan your jersey !
              </p>
              <p className="text-yellow-700 text-sm mt-1">
                Contests are launched unexpectedly - be ready to seize the
                opportunity !
              </p>
            </div>
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
                Congrats, you are in the draw! 🎉
              </span>
            </div>
            <p className="text-green-700 mb-2">
              Your participation is registered. Good luck for the draw!
            </p>
            <p className="text-gray-700 text-sm mb-2">
              The draw will take place at the end of the contest. Here are the
              prizes you can win:
            </p>
            <ul className="space-y-1 text-base">
              <li className="flex items-center gap-2 text-yellow-700 font-semibold">
                <span className="inline-block bg-yellow-200 rounded-full px-2 py-0.5 text-xs font-bold">
                  1st
                </span>
                <span>{activeContest.firstPrize || "1st prize"}</span>
              </li>
              <li className="flex items-center gap-2 text-gray-700 font-semibold">
                <span className="inline-block bg-gray-200 rounded-full px-2 py-0.5 text-xs font-bold">
                  2nd
                </span>
                <span>{activeContest.secondPrize || "2nd prize"}</span>
              </li>
              <li className="flex items-center gap-2 text-orange-700 font-semibold">
                <span className="inline-block bg-orange-200 rounded-full px-2 py-0.5 text-xs font-bold">
                  3rd
                </span>
                <span>{activeContest.thirdPrize || "3rd prize"}</span>
              </li>
            </ul>
            <p className="text-xs text-gray-500 mt-2">
              Stay tuned, winners will be announced right here!
            </p>

            {/* Affichage blockchain pour participation confirmée */}
            {result?.blockchainTx && (
              <div className="mt-4">
                <BlockchainStatus
                  transactionHash={result.blockchainTx}
                  type="participation"
                  contestId={activeContest.id}
                  walletAddress={walletAddress}
                />
              </div>
            )}
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
          <p className="text-blue-700">Checking your participation...</p>
        </div>
      );
    } else if (hasParticipated) {
      mainContent = (
        <div className="bg-gradient-to-br from-blue-50 via-white to-red-50 border-2 border-blue-200 rounded-xl p-6 flex flex-col items-center gap-4 shadow-md mt-2">
          <div className="flex flex-col items-center w-full">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-7 h-7 text-red-600 animate-bounce" />
              <span className="text-2xl font-extrabold text-blue-900 drop-shadow">
                Bravo&nbsp;
                <span className="text-red-600">{username || "Champion"}</span>
                &nbsp;!
              </span>
            </div>
            <p className="text-lg text-blue-800 font-semibold mb-2">
              You have successfully participated in the PSG contest!
            </p>
            <p className="text-gray-700 text-base mb-2 text-center">
              Come back to scan your jersey in the next few days to discover if
              you have won an exclusive reward&nbsp;
              <span className="font-bold text-red-600">PSG</span>.<br />
              <span className="text-lg text-blue-700 font-bold">
                Victory is just around the corner…&nbsp;🔥
              </span>
            </p>
            <div className="flex items-center gap-2 mt-4">
              <Badge className="bg-gradient-to-r from-red-600 to-blue-600 text-white px-4 py-2 text-base font-bold shadow-lg">
                PSG Contest
              </Badge>
              <CheckCircle className="w-6 h-6 text-green-600 animate-pulse" />
            </div>
          </div>
        </div>
      );
    } else {
      mainContent = (
        <div className="bg-gradient-to-br from-blue-50 via-white to-red-50 border-2 border-blue-200 rounded-xl p-8 flex flex-col items-center gap-6 shadow-md mt-2">
          <div className="flex flex-col items-center w-full">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="w-8 h-8 text-red-600 animate-bounce" />
              <span className="text-2xl font-extrabold text-blue-900 drop-shadow uppercase tracking-wide">
                Join the PSG Contest!
              </span>
              <Badge className="bg-gradient-to-r from-red-600 to-blue-600 text-white px-3 py-1 text-base font-bold shadow-lg">
                Fan Challenge
              </Badge>
            </div>
            <p className="text-lg text-blue-800 font-semibold mb-2 text-center">
              Scan, play and become a PSG legend!
              <br />
              <span className="text-red-600 font-bold">
                Exclusive prizes to win every month!
              </span>
            </p>
            <div className="w-full bg-blue-100/60 rounded-xl p-4 mb-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-blue-900 mb-2"
                >
                  Your PSG nickname (displayed if you win)
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. SamPSG"
                  className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent mb-4"
                />
              </div>
              <div>
                <label
                  htmlFor="wallet"
                  className="block text-sm font-medium text-blue-900 mb-2"
                >
                  Wallet Address
                </label>
                <input
                  id="wallet"
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="0x1234...5678"
                  className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <Button
                onClick={handleParticipation}
                disabled={
                  isLoading || !walletAddress.trim() || !username.trim()
                }
                className="w-full bg-gradient-to-r from-red-600 to-blue-600 hover:from-blue-700 hover:to-red-700 text-white font-extrabold text-lg py-3 rounded-xl shadow-lg transition-all duration-200 mt-4 tracking-wide uppercase flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Participation in progress...
                  </>
                ) : (
                  <>
                    <Trophy className="w-5 h-5 mr-2" />
                    Try my luck!
                  </>
                )}
              </Button>
              {result && (
                <div
                  className={`p-3 rounded-lg text-sm mt-3 ${
                    result.success
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {result.message}
                </div>
              )}
            </div>
            <p className="text-xs text-blue-700 text-center mt-2">
              ⚡ Winners will be announced here at the end of the contest. Good
              luck!
            </p>
          </div>
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
            Active Contest
          </CardTitle>
          <Badge variant="default" className="bg-green-500">
            Ongoing
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
            <span className="font-medium">{activeContest.firstPrize}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{formatTimeRemaining()}</span>
          </div>
        </div>
        {mainContent}
        {!isConnected && (
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <p className="text-orange-700">
              Connect your wallet to join the contest.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
