import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  Gift,
  Users,
  Calendar,
  CheckCircle,
  Shuffle,
  Crown,
  Medal,
  Award,
} from "lucide-react";
import Link from "next/link";
import { FinishContestButton } from "@/components/contest/FinishContestButton";
import { SelectWinnerForm } from "./SelectWinnerForm";
import { BlockchainHistory } from "@/components/admin/BlockchainHistory";

interface ContestDetailPageProps {
  params: Promise<{ id: string }>;
}

// Ajout du typage explicite pour le modèle contest
interface ContestWithPrizes {
  id: string;
  name: string;
  description: string | null;
  startedAt: Date;
  endedAt: Date | null;
  firstPrize: string;
  secondPrize: string;
  thirdPrize: string;
  maxWinners: number;
  status: string;
  participations: any[];
  winners: any[];
  createdAt: Date;
  updatedAt: Date;
}

export default async function ContestDetailPage({
  params,
}: ContestDetailPageProps) {
  const { id } = await params;

  const contest = (await prisma.contest.findUnique({
    where: { id },
    include: {
      participations: {
        include: {
          jersey: true,
        },
      },
      winners: true,
    },
  })) as ContestWithPrizes | null;

  if (!contest) {
    notFound();
  }

  // Fonction pour trouver le username d'un gagnant
  const getWinnerUsername = (winnerWalletAddress: string) => {
    const participation = contest.participations.find(
      (p) => p.walletAddress === winnerWalletAddress
    );
    return participation?.username;
  };

  // Nouvelle logique : tirage uniquement si le concours est terminé et sans gagnant
  const canSelectWinners =
    contest.status === "FINISHED" &&
    contest.participations.length > 0 &&
    contest.winners.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50">
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            href="/admin/contests"
            className="text-blue-600 hover:underline"
          >
            ← Retour
          </Link>
          <span className="font-bold text-lg text-gray-800 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Détail du Concours
          </span>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <Trophy className="w-6 h-6 text-yellow-500" />
              {contest.name}
              <Badge
                className={
                  contest.status === "ACTIVE"
                    ? "bg-green-500"
                    : contest.status === "FINISHED"
                    ? "bg-gray-400"
                    : "bg-red-400"
                }
              >
                {contest.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-wrap gap-4 items-center text-gray-700">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(contest.startedAt).toLocaleString("fr-FR")} -{" "}
                  {contest.endedAt
                    ? new Date(contest.endedAt).toLocaleString("fr-FR")
                    : "En cours"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{contest.participations.length} participations</span>
              </div>
            </div>
            {contest.description && (
              <div className="mt-2 text-gray-600">{contest.description}</div>
            )}

            {/* Affichage des 3 prix */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-gray-700">
                <Gift className="w-4 h-4" />
                <span className="font-semibold">Prix à gagner :</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Crown className="w-4 h-4 text-yellow-600" />
                    <span className="font-semibold text-yellow-800">
                      1er Prix
                    </span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    {contest.firstPrize}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Medal className="w-4 h-4 text-gray-600" />
                    <span className="font-semibold text-gray-800">
                      2ème Prix
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{contest.secondPrize}</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Award className="w-4 h-4 text-orange-600" />
                    <span className="font-semibold text-orange-800">
                      3ème Prix
                    </span>
                  </div>
                  <p className="text-sm text-orange-700">
                    {contest.thirdPrize}
                  </p>
                </div>
              </div>
            </div>

            {/* Bouton Terminer pour les concours actifs */}
            {contest.status === "ACTIVE" && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    <p>Ce concours est actuellement en cours.</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Vous pouvez le terminer manuellement à tout moment.
                    </p>
                  </div>
                  <FinishContestButton
                    contestId={contest.id}
                    contestName={contest.name}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sélection des gagnants */}
        {canSelectWinners && (
          <Card className="mb-8 border-2 border-yellow-200 bg-yellow-50/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-800">
                <Shuffle className="w-5 h-5" />
                Sélection des Gagnants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 text-gray-700">
                <p className="mb-2">
                  <strong>{contest.participations.length}</strong> participants
                  éligibles pour
                  <strong> {contest.maxWinners}</strong> prix distincts.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="bg-yellow-100 p-3 rounded-lg border border-yellow-300">
                    <div className="flex items-center gap-2 mb-2">
                      <Crown className="w-5 h-5 text-yellow-600" />
                      <span className="font-semibold text-yellow-800">
                        1er Prix
                      </span>
                    </div>
                    <p className="text-sm text-yellow-700">
                      {contest.firstPrize}
                    </p>
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg border border-gray-300">
                    <div className="flex items-center gap-2 mb-2">
                      <Medal className="w-5 h-5 text-gray-600" />
                      <span className="font-semibold text-gray-800">
                        2ème Prix
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">
                      {contest.secondPrize}
                    </p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-lg border border-orange-300">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-5 h-5 text-orange-600" />
                      <span className="font-semibold text-orange-800">
                        3ème Prix
                      </span>
                    </div>
                    <p className="text-sm text-orange-700">
                      {contest.thirdPrize}
                    </p>
                  </div>
                </div>
              </div>
              <SelectWinnerForm
                contestId={contest.id}
                participations={contest.participations}
              />
            </CardContent>
          </Card>
        )}

        {/* Liste des participations */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Users className="w-5 h-5" />
              Participations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {contest.participations.length === 0 ? (
              <div className="text-gray-500">
                Aucune participation pour ce concours.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-3 py-2 border">Participant</th>
                      <th className="px-3 py-2 border">Maillot</th>
                      <th className="px-3 py-2 border">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contest.participations.map((p) => (
                      <tr key={p.id} className="even:bg-gray-50">
                        <td className="px-3 py-2 border">
                          {p.username ? (
                            <div>
                              <div className="font-semibold text-blue-600">
                                {p.username}
                              </div>
                              <div className="text-xs text-gray-500 font-mono">
                                {p.walletAddress.slice(0, 6)}...
                                {p.walletAddress.slice(-4)}
                              </div>
                            </div>
                          ) : (
                            <div className="font-mono">
                              {p.walletAddress.slice(0, 6)}...
                              {p.walletAddress.slice(-4)}
                            </div>
                          )}
                        </td>
                        <td className="px-3 py-2 border">
                          {p.jersey?.name || p.jerseyId}
                        </td>
                        <td className="px-3 py-2 border">
                          {new Date(p.participatedAt).toLocaleString("fr-FR")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Gagnants */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle className="w-5 h-5" />
              Gagnants
            </CardTitle>
          </CardHeader>
          <CardContent>
            {contest.winners.length === 0 ? (
              <div className="text-gray-500">
                Aucun gagnant pour ce concours.
              </div>
            ) : (
              <div className="space-y-4">
                {contest.winners.map((w, index) => {
                  const username = getWinnerUsername(w.walletAddress);
                  const prizeRank =
                    index === 0
                      ? "1er Prix"
                      : index === 1
                      ? "2ème Prix"
                      : "3ème Prix";
                  const prizeColor =
                    index === 0
                      ? "bg-yellow-100 border-yellow-300"
                      : index === 1
                      ? "bg-gray-100 border-gray-300"
                      : "bg-orange-100 border-orange-300";
                  const PrizeIcon =
                    index === 0 ? Crown : index === 1 ? Medal : Award;

                  return (
                    <div
                      key={w.id}
                      className={`p-4 rounded-lg border ${prizeColor}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <PrizeIcon className="w-6 h-6 text-gray-600" />
                          <div>
                            <div className="font-semibold text-gray-800">
                              {prizeRank}
                            </div>
                            {username ? (
                              <div className="text-blue-600 font-medium">
                                {username}
                              </div>
                            ) : (
                              <div className="font-mono text-sm text-gray-600">
                                {w.walletAddress.slice(0, 6)}...
                                {w.walletAddress.slice(-4)}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-green-700">
                            {w.prize}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(w.wonAt).toLocaleString("fr-FR")}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Historique Blockchain */}
        <div className="mb-8">
          <BlockchainHistory contestId={id} />
        </div>
      </div>
    </div>
  );
}
