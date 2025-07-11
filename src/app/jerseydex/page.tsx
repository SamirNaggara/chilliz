"use client";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getJerseyImage } from "@/lib/utils";

interface JerseyDexEntry {
  id: string;
  jerseyId: string;
  jersey: {
    id: string;
    name: string;
  };
  addedAt: string;
}

export default function JerseydexPage() {
  const { address, isConnected } = useAccount();
  const [entries, setEntries] = useState<JerseyDexEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isConnected || !address) {
      setLoading(false);
      return;
    }

    fetch(`/api/jerseydex?wallet=${address}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setEntries(data.entries || []);
        } else {
          setError(data.message || "Erreur lors du chargement");
        }
      })
      .catch((err) => {
        setError("Erreur de connexion");
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [address, isConnected]);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour à l&apos;accueil
              </Link>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                🏆 Jerseydex
              </h1>
              <p className="text-gray-600 text-lg">
                Votre collection de maillots PSG
              </p>
            </div>

            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-800">
                  <Trophy className="w-6 h-6" />
                  Connexion Requise
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Connectez-vous à votre wallet pour voir votre collection de
                  maillots.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-blue-800 text-sm">
                    💡 Votre Jerseydex est lié à votre adresse wallet.
                    Connectez-vous pour y accéder.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour à l&apos;accueil
            </Link>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              🏆 Jerseydex
            </h1>
            <p className="text-gray-600 text-lg">
              Votre collection de maillots PSG
            </p>
            <div className="flex items-center justify-center gap-2 mt-2 mb-6">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-600">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
            </div>
            {/* Objectif gamifié */}
            <div className="max-w-md mx-auto bg-gradient-to-r from-yellow-100 to-orange-100 border border-orange-200 rounded-xl p-4 mb-8 shadow flex flex-col items-center">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-yellow-600" />
                <span className="font-semibold text-orange-800">
                  Prochain objectif
                </span>
              </div>
              <div className="text-gray-700 mb-2 text-sm">
                Atteignez{" "}
                <span className="font-bold text-orange-700">10 maillots</span>{" "}
                pour débloquer le rang{" "}
                <span className="font-bold text-yellow-700">Super Fan</span> !
              </div>
              <div className="w-full bg-orange-200 rounded-full h-3 mb-2">
                <div
                  className="bg-gradient-to-r from-orange-400 to-yellow-400 h-3 rounded-full transition-all"
                  style={{
                    width: `${Math.min((entries.length / 10) * 100, 100)}%`,
                  }}
                ></div>
              </div>
              <div className="text-xs text-gray-600">
                {entries.length} / 10 maillots
              </div>
            </div>
          </div>

          {loading ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">
                  Chargement de votre collection...
                </p>
              </CardContent>
            </Card>
          ) : error ? (
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-8 text-center">
                <p className="text-red-800">{error}</p>
              </CardContent>
            </Card>
          ) : entries.length === 0 ? (
            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-800">
                  <Trophy className="w-6 h-6" />
                  Collection Vide
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Vous n&apos;avez pas encore de maillots dans votre Jerseydex.
                </p>
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <p className="text-orange-800 text-sm">
                    💡 Scannez des maillots PSG authentiques pour les ajouter à
                    votre collection !
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Votre Collection ({entries.length} maillot
                    {entries.length > 1 ? "s" : ""})
                  </h2>
                  <Badge variant="default" className="bg-green-500">
                    <Trophy className="w-4 h-4 mr-1" />
                    Collectionneur
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {entries.map((entry) => (
                  <Card
                    key={entry.id}
                    className="bg-white shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {new Date(entry.addedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="mb-4">
                          <img
                            src={getJerseyImage({ id: entry.jersey.id })}
                            alt={entry.jersey.name}
                            className="w-32 h-32 object-contain mx-auto"
                            onError={(e) => {
                              e.currentTarget.src =
                                "/jerseys/default-jersey.svg";
                            }}
                          />
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-2">
                          {entry.jersey.name}
                        </h3>
                        <Link href={`/jersey/${entry.jersey.id}`}>
                          <Button variant="outline" size="sm">
                            Voir le maillot
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
