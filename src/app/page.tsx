import { getJerseys } from "@/lib/actions";
import { getContests } from "@/lib/contest-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Users,
  Eye,
  ArrowRight,
  Calendar,
  Crown,
  Medal,
  Award,
} from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const jerseysResult = await getJerseys();
  const contestsResult = await getContests();

  const jerseys = jerseysResult.success ? jerseysResult.jerseys : [];
  const contests = contestsResult.success ? contestsResult.contests : [];
  const activeContests =
    contests?.filter((contest) => contest.status === "ACTIVE") || [];

  const totalScans =
    jerseys?.reduce(
      (total, jersey) => total + (jersey.scans?.length || 0),
      0
    ) || 0;
  const uniqueWallets = new Set(
    jerseys?.flatMap(
      (jersey) => jersey.scans?.map((scan) => scan.walletAddress) || []
    ) || []
  ).size;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Scannez vos Maillots PSG Authentiques
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Participez aux concours et gagnez des récompenses exclusives avec
              votre wallet Chilliz
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/admin/contests">
                <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold">
                  <Trophy className="w-4 h-4 mr-2" />
                  Gérer les Concours
                </Button>
              </Link>
              <Link href="/jersey/jersey-mbappe-2024?isAuth=true">
                <Button variant="outline" className="border-gray-300">
                  <Eye className="w-4 h-4 mr-2" />
                  Voir un Maillot
                </Button>
              </Link>
            </div>
          </div>

          {/* Concours Actifs */}
          {activeContests.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Concours Actifs
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeContests.map((contest) => (
                  <Card
                    key={contest.id}
                    className="bg-gradient-to-br from-yellow-50 to-orange-50 border-orange-200"
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-orange-800">
                        <Trophy className="w-5 h-5" />
                        {contest.name}
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        {contest.description || "Aucune description"}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Jusqu&apos;au{" "}
                            {contest.endedAt
                              ? new Date(contest.endedAt).toLocaleString(
                                  "fr-FR"
                                )
                              : "En cours"}
                          </span>
                        </div>

                        {/* Affichage des 3 prix */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Trophy className="w-4 h-4" />
                            <span className="font-semibold">Prix :</span>
                          </div>
                          <div className="grid grid-cols-1 gap-2 text-sm">
                            <div className="flex items-center gap-2 text-yellow-700">
                              <Crown className="w-3 h-3" />
                              <span className="font-medium">1er :</span>
                              <span>{contest.firstPrize}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700">
                              <Medal className="w-3 h-3" />
                              <span className="font-medium">2ème :</span>
                              <span>{contest.secondPrize}</span>
                            </div>
                            <div className="flex items-center gap-2 text-orange-700">
                              <Award className="w-3 h-3" />
                              <span className="font-medium">3ème :</span>
                              <span>{contest.thirdPrize}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="w-4 h-4" />
                          <span>
                            {contest.participations?.length || 0} participations
                          </span>
                        </div>

                        <Link href={`/admin/contests/${contest.id}`}>
                          <Button className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white">
                            <Eye className="w-4 h-4 mr-2" />
                            Voir le Concours
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <Trophy className="w-8 h-8 text-red-600" />
                </div>
                <div className="text-3xl font-bold text-red-600">
                  {jerseys?.length || 0}
                </div>
                <div className="text-sm text-red-700 font-medium">
                  Maillots Disponibles
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-blue-600">
                  {totalScans}
                </div>
                <div className="text-sm text-blue-700 font-medium">
                  Scans Totaux
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <Eye className="w-8 h-8 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-green-600">
                  {uniqueWallets}
                </div>
                <div className="text-sm text-green-700 font-medium">
                  Wallets Uniques
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Maillots */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Maillots Disponibles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jerseys?.map((jersey) => (
                <Card
                  key={jersey.id}
                  className="group hover:shadow-lg transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-blue-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                        <Trophy className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">
                        {jersey.name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {jersey.scans?.length || 0} scan
                        {(jersey.scans?.length || 0) > 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">ID:</span>
                        <span className="font-mono text-xs">{jersey.id}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Créé:</span>
                        <span>
                          {jersey.createdAt.toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <Link href={`/jersey/${jersey.id}?isAuth=true`}>
                        <Button className="w-full bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 text-white">
                          <Eye className="w-4 h-4 mr-2" />
                          Voir Maillot
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                      <Link href={`/jersey/${jersey.id}`}>
                        <Button variant="outline" className="w-full">
                          Version Non Authentique
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <Trophy className="w-5 h-5 text-yellow-600" />
                Comment ça marche ?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold">1</span>
                    </div>
                    <h4 className="font-semibold mb-2">Scan du Maillot</h4>
                    <p className="text-sm text-gray-600">
                      Scannez la puce NFC de votre maillot PSG authentique
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold">2</span>
                    </div>
                    <h4 className="font-semibold mb-2">Connexion Wallet</h4>
                    <p className="text-sm text-gray-600">
                      Connectez votre wallet Chilliz pour participer
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold">3</span>
                    </div>
                    <h4 className="font-semibold mb-2">Participation</h4>
                    <p className="text-sm text-gray-600">
                      Participez aux concours et gagnez des récompenses
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
