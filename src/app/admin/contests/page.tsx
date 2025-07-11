import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Trophy, Users } from "lucide-react";
import { CreateContestForm } from "@/components/contest/CreateContestForm";

export default async function AdminContestsPage() {
  const contests = await prisma.contest.findMany({
    include: {
      participations: {
        include: {
          jersey: true,
        },
      },
      winners: {
        include: {},
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-blue-600 rounded-full flex items-center justify-center">
                <Trophy className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-gray-800">
                Gestion des Concours
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Formulaire de création */}
          <CreateContestForm />

          {/* Liste des concours */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Concours Existants
            </h2>

            {contests.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-gray-500">
                  <Trophy className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Aucun concours créé pour le moment</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {contests.map((contest) => (
                  <Card
                    key={contest.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            {contest.name}
                          </CardTitle>
                          <p className="text-sm text-gray-600 mt-1">
                            {contest.description || "Aucune description"}
                          </p>
                        </div>
                        <Badge
                          variant={
                            contest.status === "ACTIVE"
                              ? "default"
                              : contest.status === "FINISHED"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {contest.status === "ACTIVE" && "En Cours"}
                          {contest.status === "FINISHED" && "Terminé"}
                          {contest.status === "CANCELLED" && "Annulé"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(contest.startedAt).toLocaleString(
                              "fr-FR"
                            )}{" "}
                            -{" "}
                            {contest.endedAt
                              ? new Date(contest.endedAt).toLocaleString(
                                  "fr-FR"
                                )
                              : "En cours"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Trophy className="w-4 h-4" />
                          <span>{contest.prize}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="w-4 h-4" />
                          <span>
                            {contest.participations.length} participations
                          </span>
                        </div>

                        {contest.winners.length > 0 && (
                          <div className="bg-green-50 p-3 rounded-lg">
                            <h4 className="font-semibold text-green-800 mb-2">
                              Gagnants
                            </h4>
                            <div className="space-y-1">
                              {contest.winners.map((winner) => (
                                <div
                                  key={winner.id}
                                  className="text-sm text-green-700"
                                >
                                  {/* Affiche le walletAddress si présent, sinon l'id */}
                                  {winner.walletAddress
                                    ? `${winner.walletAddress.slice(
                                        0,
                                        6
                                      )}...${winner.walletAddress.slice(-4)}`
                                    : winner.id}
                                  {winner.prize ? ` - ${winner.prize}` : ""}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Voir Détails
                          </Button>
                          {contest.status === "ACTIVE" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-orange-600"
                            >
                              Terminer Maintenant
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
