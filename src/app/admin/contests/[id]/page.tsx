import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  Gift,
  Users,
  Calendar,
  Shuffle,
  Crown,
  Medal,
  Award,
} from "lucide-react";
import Link from "next/link";
import { FinishContestButton } from "@/components/contest/FinishContestButton";
import { StartContestButton } from "@/components/contest/StartContestButton";
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
  firstPrize: string;
  secondPrize: string;
  thirdPrize: string;
  maxWinners: number;
  status: string;
  participations: Array<{
    id: string;
    walletAddress: string;
    username?: string;
    jerseyId: string;
    participatedAt: Date;
    jersey: {
      id: string;
      name: string;
    };
  }>;
  winners: Array<{
    id: string;
    walletAddress: string;
    prize: string;
  }>;
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
                    : contest.status === "PENDING"
                    ? "bg-blue-500"
                    : "bg-red-400"
                }
              >
                {contest.status === "ACTIVE" && "En Cours"}
                {contest.status === "FINISHED" && "Terminé"}
                {contest.status === "PENDING" && "En Attente"}
                {contest.status === "CANCELLED" && "Annulé"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Description */}
              {contest.description && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Description
                  </h3>
                  <p className="text-gray-600">{contest.description}</p>
                </div>
              )}

              {/* Informations de base */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Créé le{" "}
                      {new Date(contest.createdAt).toLocaleString("fr-FR")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{contest.participations.length} participants</span>
                  </div>
                </div>
              </div>

              {/* Prix */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Gift className="w-5 h-5 text-yellow-500" />
                  Prix à Gagner
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Crown className="w-5 h-5 text-yellow-500" />
                      <span className="font-semibold text-green-800">
                        1er Prix
                      </span>
                    </div>
                    <p className="text-green-700">{contest.firstPrize}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Medal className="w-5 h-5 text-gray-500" />
                      <span className="font-semibold text-blue-800">
                        2ème Prix
                      </span>
                    </div>
                    <p className="text-blue-700">{contest.secondPrize}</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-5 h-5 text-orange-500" />
                      <span className="font-semibold text-orange-800">
                        3ème Prix
                      </span>
                    </div>
                    <p className="text-orange-700">{contest.thirdPrize}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {contest.status === "PENDING" && (
                  <StartContestButton
                    contestId={contest.id}
                    contestName={contest.name}
                  />
                )}
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
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sélection des gagnants */}
        {canSelectWinners && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Shuffle className="w-5 h-5" />
                Sélection des Gagnants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SelectWinnerForm
                contestId={contest.id}
                participations={contest.participations}
              />
            </CardContent>
          </Card>
        )}

        {/* Historique blockchain */}
        <BlockchainHistory contestId={contest.id} />
      </div>
    </div>
  );
}
