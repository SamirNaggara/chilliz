import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { JerseyImage } from "@/components/JerseyImage";
import { JerseyLightbox } from "@/components/JerseyLightbox";
import { ShopImage } from "@/components/ShopImage";
import { JerseyWalletConnector } from "@/components/JerseyWalletConnector";
import { WalletPriceDisplay } from "@/components/WalletPriceDisplay";
import { PsgTokenDisplay } from "@/components/PsgTokenDisplay";
import {
  Shield,
  Zap,
  Star,
  ShoppingBag,
  Users,
  Eye,
  Coins,
  Crown,
} from "lucide-react";

interface JerseyPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Fonction pour déterminer l'image du maillot selon le slug
function getJerseyImage(jerseyId: string): string {
  const imageMap: Record<string, string> = {
    "jersey-mbappe-2024": "/jerseys/jersey-mbappe-2024.png",
    "jersey-messi-2024": "/jerseys/jersey-messi-2024.png",
  };

  if (imageMap[jerseyId]) {
    return imageMap[jerseyId];
  }

  const possibleExtensions = [".png", ".jpg", ".jpeg", ".webp"];
  for (const ext of possibleExtensions) {
    const imagePath = `/jerseys/${jerseyId}${ext}`;
    if (ext === ".png") {
      return imagePath;
    }
  }

  return "/jerseys/default-jersey.svg";
}

export default async function JerseyPage({
  params,
  searchParams,
}: JerseyPageProps) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const isAuth = resolvedSearchParams?.isAuth === "true";

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
  const uniqueUsers = new Set(jersey.scans.map((scan) => scan.userId)).size;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50">
      {/* Header avec authentification et infos PSG */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-blue-600 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-lg text-gray-800">
                  PSG Authentic
                </span>
              </div>
              
              {/* Séparateur vertical */}
              <div className="hidden md:block w-px h-6 bg-gray-300"></div>
              
              {/* Nom du jersey dans la barre sticky */}
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">
                  {jersey.name}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Composant PSG tokens compact pour la barre sticky */}
              <div className="hidden lg:block">
                <JerseyWalletConnector variant="compact" />
              </div>
              <JerseyWalletConnector variant="header" />
            </div>
          </div>
        </div>
      </div>

      {/* Section principale - Image du maillot */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Image principale avec effet et badge d'authenticité en absolute */}
          <div className="relative group cursor-pointer mb-8">
            {/* Badge d'authenticité en absolute */}
            <div className="absolute top-4 left-4 z-20">
              {isAuth ? (
                <Badge className="bg-green-500 text-white px-3 py-1 text-xs font-semibold rounded-lg shadow-lg flex items-center gap-1">
                  <Shield className="w-4 h-4 mr-1" />
                  Authentique
                </Badge>
              ) : (
                <Badge className="bg-orange-400 text-white px-3 py-1 text-xs font-semibold rounded-lg shadow-lg flex items-center gap-1">
                  <Shield className="w-4 h-4 mr-1" />
                  Non authentifié
                </Badge>
              )}
            </div>
            <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-white p-8">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-blue-500/10 rounded-2xl"></div>
              <div className="relative z-10">
                <JerseyLightbox
                  src={jerseyImage}
                  alt={jersey.name}
                  fallbackSrc="/jerseys/default-jersey.svg"
                  trigger={
                    <div className="group">
                      <JerseyImage
                        src={jerseyImage}
                        alt={jersey.name}
                        fallbackSrc="/jerseys/default-jersey.svg"
                      />
                      {/* Overlay pour plein écran */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-2xl flex items-center justify-center pointer-events-none">
                        <Eye className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </div>
                  }
                />
              </div>
            </div>
          </div>

          {/* Informations du maillot */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              {jersey.name}
            </h1>
            <p className="text-gray-600 text-lg mb-6">Collection Officielle PSG</p>
          </div>

          {/* Affichage des tokens PSG */}
          <div className="mb-12">
            <PsgTokenDisplay />
          </div>

          {/* Stats gamifiées */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <Users className="w-8 h-8 text-red-600" />
                </div>
                <div className="text-3xl font-bold text-red-600">
                  {jersey.scans.length}
                </div>
                <div className="text-sm text-red-700 font-medium">
                  Scans Totaux
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <Crown className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-blue-600">
                  {uniqueUsers}
                </div>
                <div className="text-sm text-blue-700 font-medium">
                  Utilisateurs Uniques
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <Star className="w-8 h-8 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-green-600">
                  {jersey.scans.length > 0
                    ? Math.round((uniqueUsers / jersey.scans.length) * 100)
                    : 0}
                  %
                </div>
                <div className="text-sm text-green-700 font-medium">
                  Taux d&apos;Engagement
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Section Shop */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          {/* Header du shop avec intégration Chilliz */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Boutique Officielle PSG
            </h2>
            <p className="text-gray-600 text-lg mb-6">
              Découvrez notre collection exclusive avec des avantages Chilliz
            </p>

            {/* Bannière de connexion wallet */}
            <JerseyWalletConnector variant="banner" />
          </div>

          {/* Filtres de catégories */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Button
              variant="outline"
              className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
            >
              Tous
            </Button>
            <Button variant="outline" className="border-gray-300">
              Maillots
            </Button>
            <Button variant="outline" className="border-gray-300">
              Accessoires
            </Button>
            <Button variant="outline" className="border-gray-300">
              Équipements
            </Button>
            <Button variant="outline" className="border-gray-300">
              Collectors
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Produit 1 : Maillot Domicile */}
            <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer relative">
              <div className="absolute top-2 left-2 z-10">
                <Badge className="bg-green-500 text-white text-xs">
                  -20% avec Chilliz
                </Badge>
              </div>
              <CardContent className="p-6">
                <div className="w-full h-48 flex items-center justify-center mb-4">
                  <img
                    src="https://www.footballkitarchive.com/static/img/kits/2025-26/paris-saint-germain-2025-26-home-kit-1.jpg"
                    alt="Maillot Domicile PSG 2024-2025"
                    className="object-contain h-full rounded-lg shadow-md"
                  />
                </div>
                <h3 className="font-semibold text-lg mb-2">
                  Maillot Domicile 2024
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Maillot officiel du PSG
                </p>
                <WalletPriceDisplay 
                  originalPrice={111}
                  discountPercentage={20}
                  chzPrice={71}
                />
                <Button className="w-full bg-gradient-to-r from-red-600 to-blue-600">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Acheter
                </Button>
              </CardContent>
            </Card>

            {/* Produit 2 : Écharpe Officielle */}
            <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer relative">
              <div className="absolute top-2 left-2 z-10">
                <Badge className="bg-blue-500 text-white text-xs">
                  -15% avec Chilliz
                </Badge>
              </div>
              <CardContent className="p-6">
                <div className="w-full h-48 flex items-center justify-center mb-4">
                  <ShopImage
                    src="/shop/scarf-psg.jpg"
                    alt="Écharpe PSG officielle"
                    fallbackText="Écharpe PSG"
                  />
                </div>
                <h3 className="font-semibold text-lg mb-2">
                  Écharpe Officielle
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Écharpe PSG authentique
                </p>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-2xl font-bold text-gray-600">
                      25€
                    </span>
                    <span className="text-sm text-gray-500 line-through ml-2">
                      29€
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-blue-600 font-semibold">
                      21 CHZ
                    </div>
                    <div className="text-xs text-gray-500">avec wallet</div>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-red-600 to-blue-600">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Acheter
                </Button>
              </CardContent>
            </Card>

            {/* Produit 3 : Ballon Officiel */}
            <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer relative">
              <div className="absolute top-2 left-2 z-10">
                <Badge className="bg-purple-500 text-white text-xs">
                  -25% avec Chilliz
                </Badge>
              </div>
              <CardContent className="p-6">
                <div className="w-full h-48 flex items-center justify-center mb-4">
                  <ShopImage
                    src="/shop/ball-psg.jpg"
                    alt="Ballon officiel PSG"
                    fallbackText="Ballon PSG"
                  />
                </div>
                <h3 className="font-semibold text-lg mb-2">Ballon Officiel</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Ballon de match officiel
                </p>
                <WalletPriceDisplay 
                  originalPrice={60}
                  discountPercentage={25}
                  chzPrice={34}
                />
                <Button className="w-full bg-gradient-to-r from-red-600 to-blue-600">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Acheter
                </Button>
              </CardContent>
            </Card>

            {/* Produit 4 : Casquette Collector */}
            <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer relative">
              <div className="absolute top-2 left-2 z-10">
                <Badge className="bg-yellow-500 text-white text-xs">
                  -30% avec Chilliz
                </Badge>
              </div>
              <CardContent className="p-6">
                <div className="w-full h-48 flex items-center justify-center mb-4">
                  <ShopImage
                    src="/shop/cap-psg.jpg"
                    alt="Casquette collector PSG"
                    fallbackText="Casquette PSG"
                  />
                </div>
                <h3 className="font-semibold text-lg mb-2">
                  Casquette Collector
                </h3>
                <p className="text-gray-600 text-sm mb-4">Édition limitée</p>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-2xl font-bold text-yellow-600">
                      35€
                    </span>
                    <span className="text-sm text-gray-500 line-through ml-2">
                      50€
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-blue-600 font-semibold">
                      25 CHZ
                    </div>
                    <div className="text-xs text-gray-500">avec wallet</div>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-red-600 to-blue-600">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Acheter
                </Button>
              </CardContent>
            </Card>

            {/* Produit 5 : Gants de Gardien */}
            <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer relative">
              <div className="absolute top-2 left-2 z-10">
                <Badge className="bg-green-500 text-white text-xs">
                  -40% avec Chilliz
                </Badge>
              </div>
              <CardContent className="p-6">
                <div className="w-full h-48 flex items-center justify-center mb-4">
                  <ShopImage
                    src="/shop/gloves-psg.jpg"
                    alt="Gants de gardien PSG"
                    fallbackText="Gants PSG"
                  />
                </div>
                <h3 className="font-semibold text-lg mb-2">Gants de Gardien</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Gants officiels PSG
                </p>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-2xl font-bold text-green-600">
                      75€
                    </span>
                    <span className="text-sm text-gray-500 line-through ml-2">
                      125€
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-blue-600 font-semibold">
                      45 CHZ
                    </div>
                    <div className="text-xs text-gray-500">avec wallet</div>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-red-600 to-blue-600">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Acheter
                </Button>
              </CardContent>
            </Card>

            {/* Produit 6 : Poster Géant */}
            <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer relative">
              <div className="absolute top-2 left-2 z-10">
                <Badge className="bg-orange-500 text-white text-xs">
                  -50% avec Chilliz
                </Badge>
              </div>
              <CardContent className="p-6">
                <div className="w-full h-48 flex items-center justify-center mb-4">
                  <ShopImage
                    src="/shop/poster-psg.jpg"
                    alt="Poster géant PSG"
                    fallbackText="Poster PSG"
                  />
                </div>
                <h3 className="font-semibold text-lg mb-2">Poster Géant</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Poster collector 120x80cm
                </p>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-2xl font-bold text-orange-600">
                      20€
                    </span>
                    <span className="text-sm text-gray-500 line-through ml-2">
                      40€
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-blue-600 font-semibold">
                      15 CHZ
                    </div>
                    <div className="text-xs text-gray-500">avec wallet</div>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-red-600 to-blue-600">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Acheter
                </Button>
              </CardContent>
            </Card>

            {/* Produit 7 : Maillot Extérieur */}
            <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer relative">
              <div className="absolute top-2 left-2 z-10">
                <Badge className="bg-blue-500 text-white text-xs">
                  -20% avec Chilliz
                </Badge>
              </div>
              <CardContent className="p-6">
                <div className="w-full h-48 flex items-center justify-center mb-4">
                  <img
                    src="https://www.footballkitarchive.com/static/img/kits/2025-26/paris-saint-germain-2025-26-away-kit-1.jpg"
                    alt="Maillot Extérieur PSG 2024-2025"
                    className="object-contain h-full rounded-lg shadow-md"
                  />
                </div>
                <h3 className="font-semibold text-lg mb-2">
                  Maillot Extérieur 2024
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Maillot extérieur officiel
                </p>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-2xl font-bold text-blue-600">
                      89€
                    </span>
                    <span className="text-sm text-gray-500 line-through ml-2">
                      111€
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-blue-600 font-semibold">
                      71 CHZ
                    </div>
                    <div className="text-xs text-gray-500">avec wallet</div>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-red-600 to-blue-600">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Acheter
                </Button>
              </CardContent>
            </Card>

            {/* Produit 8 : Mug Collector */}
            <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer relative">
              <div className="absolute top-2 left-2 z-10">
                <Badge className="bg-red-500 text-white text-xs">
                  -35% avec Chilliz
                </Badge>
              </div>
              <CardContent className="p-6">
                <div className="w-full h-48 flex items-center justify-center mb-4">
                  <ShopImage
                    src="/shop/mug-psg.jpg"
                    alt="Mug collector PSG"
                    fallbackText="Mug PSG"
                  />
                </div>
                <h3 className="font-semibold text-lg mb-2">Mug Collector</h3>
                <p className="text-gray-600 text-sm mb-4">Mug officiel PSG</p>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-2xl font-bold text-red-600">15€</span>
                    <span className="text-sm text-gray-500 line-through ml-2">
                      23€
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-blue-600 font-semibold">
                      10 CHZ
                    </div>
                    <div className="text-xs text-gray-500">avec wallet</div>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-red-600 to-blue-600">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Acheter
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Section avantages Chilliz */}
          <div className="mt-16 bg-gradient-to-r from-blue-50 to-red-50 rounded-2xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Avantages Chilliz Exclusifs
              </h3>
              <p className="text-gray-600">
                Connectez votre wallet pour débloquer des réductions et
                récompenses uniques
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Coins className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-lg mb-2">Paiement en CHZ</h4>
                <p className="text-gray-600 text-sm">
                  Payez directement avec vos tokens Chilliz
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-lg mb-2">
                  Réductions Exclusives
                </h4>
                <p className="text-gray-600 text-sm">
                  Jusqu&apos;à 50% de réduction avec votre wallet
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-lg mb-2">
                  Produits Collectors
                </h4>
                <p className="text-gray-600 text-sm">
                  Accès aux éditions limitées et collectors
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer avec Chilliz */}
      <div className="bg-gradient-to-r from-red-600 to-blue-600 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Coins className="w-6 h-6" />
            <span className="font-bold text-lg">Powered by Chilliz</span>
          </div>
          <p className="text-sm opacity-90">
            Découvrez l&apos;écosystème blockchain du PSG
          </p>
        </div>
      </div>
    </div>
  );
}
