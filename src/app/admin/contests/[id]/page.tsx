import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Gift, Users, Calendar, CheckCircle } from "lucide-react";
import Link from "next/link";

interface ContestDetailPageProps {
  params: { id: string };
}

export default async function ContestDetailPage({
  params,
}: ContestDetailPageProps) {
  const contest = await prisma.contest.findUnique({
    where: { id: params.id },
    include: {
      participations: {
        include: {
          jersey: true,
        },
      },
      winners: true,
    },
  });

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
                <Gift className="w-4 h-4" />
                <span>{contest.prize}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{contest.participations.length} participations</span>
              </div>
            </div>
            {contest.description && (
              <div className="mt-2 text-gray-600">{contest.description}</div>
            )}
          </CardContent>
        </Card>

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
              <ul className="space-y-2">
                {contest.winners.map((w) => {
                  const username = getWinnerUsername(w.walletAddress);
                  return (
                    <li key={w.id} className="flex items-center gap-2">
                      {username ? (
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-green-700 bg-green-50 px-2 py-1 rounded">
                            {username}
                          </span>
                          <span className="text-xs text-gray-500 font-mono">
                            {w.walletAddress.slice(0, 6)}...
                            {w.walletAddress.slice(-4)}
                          </span>
                        </div>
                      ) : (
                        <span className="font-mono bg-green-50 px-2 py-1 rounded">
                          {w.walletAddress.slice(0, 6)}...
                          {w.walletAddress.slice(-4)}
                        </span>
                      )}
                      <span className="text-green-700 font-semibold">
                        {w.prize}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
