import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { JerseyImage } from "@/components/JerseyImage";

interface JerseyPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Fonction pour déterminer l'image du maillot selon le slug
function getJerseyImage(jerseyId: string): string {
  // Mapping des IDs vers les images spécifiques
  const imageMap: Record<string, string> = {
    "jersey-mbappe-2024": "/jerseys/jersey-mbappe-2024.png",
    "jersey-messi-2024": "/jerseys/jersey-messi-2024.png",
    // Ajoutez d'autres mappings ici
  };

  // Vérifier d'abord si on a une image spécifique pour cet ID
  if (imageMap[jerseyId]) {
    return imageMap[jerseyId];
  }

  // Sinon, essayer de construire le nom de fichier basé sur l'ID
  const possibleExtensions = [".png", ".jpg", ".jpeg", ".webp"];

  for (const ext of possibleExtensions) {
    const imagePath = `/jerseys/${jerseyId}${ext}`;
    // En production, on pourrait vérifier si le fichier existe
    // Pour l'instant, on retourne le chemin le plus probable
    if (ext === ".png") {
      return imagePath;
    }
  }

  // Fallback vers l'image par défaut
  return "/jerseys/default-jersey.svg";
}

export default async function JerseyPage({ params }: JerseyPageProps) {
  const { id } = await params;

  const jersey = await prisma.jersey.findUnique({
    where: { id },
    include: {
      scans: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!jersey) {
    notFound();
  }

  const jerseyImage = getJerseyImage(jersey.id);

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/">
          <Button variant="outline">← Retour à l&apos;accueil</Button>
        </Link>
        <h1 className="text-3xl font-bold">Maillot {jersey.name}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image du maillot */}
        <Card>
          <CardHeader>
            <CardTitle>Image du Maillot</CardTitle>
          </CardHeader>
          <CardContent>
            <JerseyImage
              src={jerseyImage}
              alt={jersey.name}
              fallbackSrc="/jerseys/default-jersey.svg"
            />
            <p className="text-center mt-4 text-sm text-gray-600">
              ID: {jersey.id}
            </p>
            <p className="text-center text-xs text-gray-500">
              Image: {jerseyImage.replace("/jerseys/", "")}
            </p>
          </CardContent>
        </Card>

        {/* Informations du maillot */}
        <Card>
          <CardHeader>
            <CardTitle>Informations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{jersey.name}</h3>
              <p className="text-sm text-gray-600">
                Créé le {jersey.createdAt.toLocaleDateString("fr-FR")}
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Statistiques</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {jersey.scans.length}
                  </div>
                  <div className="text-sm text-blue-600">Scans</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {new Set(jersey.scans.map((scan) => scan.userId)).size}
                  </div>
                  <div className="text-sm text-green-600">
                    Utilisateurs uniques
                  </div>
                </div>
              </div>
            </div>

            {jersey.scans.length > 0 ? (
              <div>
                <h4 className="font-medium mb-2">Derniers scans</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {jersey.scans
                    .sort(
                      (a, b) =>
                        new Date(b.scannedAt).getTime() -
                        new Date(a.scannedAt).getTime()
                    )
                    .slice(0, 5)
                    .map((scan) => (
                      <div
                        key={scan.id}
                        className="flex justify-between items-center p-2 bg-gray-50 rounded"
                      >
                        <span className="text-sm font-medium">
                          {scan.user.wallet.slice(0, 8)}...
                          {scan.user.wallet.slice(-6)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(scan.scannedAt).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-500">
                  Aucun scan enregistré pour ce maillot
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
