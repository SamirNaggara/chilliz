"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WalletPriceDisplay } from "@/components/WalletPriceDisplay";
import { PsgTokenPriceDisplay } from "@/components/PsgTokenPriceDisplay";
import { ShopImage } from "@/components/ShopImage";
import { useWeb3 } from "@/hooks/useWeb3";
import { ShoppingBag, Trophy, Star, Crown } from "lucide-react";

interface ShopProduct {
  id: string;
  name: string;
  description: string;
  originalPrice: number;
  chzPrice: number;
  imageUrl: string;
  walletDiscount: number;
  isPsgExclusive?: boolean;
  rarity?: "common" | "rare" | "legendary";
}

const shopProducts: ShopProduct[] = [
  {
    id: "jersey-home-2024",
    name: "Maillot Domicile 2024",
    description: "Maillot officiel du PSG",
    originalPrice: 111,
    chzPrice: 71,
    imageUrl: "/shop/jersey-home-psg.jpg",
    walletDiscount: 20,
    rarity: "common",
  },
  {
    id: "scarf-official",
    name: "Écharpe Officielle",
    description: "Écharpe PSG authentique",
    originalPrice: 25,
    chzPrice: 16,
    imageUrl: "/shop/scarf-psg.jpg",
    walletDiscount: 15,
    rarity: "common",
  },
  {
    id: "cap-collector",
    name: "Casquette Collector",
    description: "Édition limitée",
    originalPrice: 35,
    chzPrice: 25,
    imageUrl: "/shop/cap-psg.jpg",
    walletDiscount: 30,
    rarity: "rare",
  },
  {
    id: "jersey-psg-x-jordan",
    name: "Maillot PSG x Jordan",
    description: "Collection exclusive limitée",
    originalPrice: 199,
    chzPrice: 125,
    imageUrl: "/shop/jersey-jordan-psg.jpg",
    walletDiscount: 25,
    isPsgExclusive: true,
    rarity: "legendary",
  },
  {
    id: "training-kit-psg",
    name: "Kit d'Entraînement Complet",
    description: "Réservé aux détenteurs $PSG",
    originalPrice: 150,
    chzPrice: 95,
    imageUrl: "/shop/training-kit-psg.jpg",
    walletDiscount: 20,
    isPsgExclusive: true,
    rarity: "legendary",
  },
];

function getRarityBadge(rarity: string) {
  switch (rarity) {
    case "legendary":
      return (
        <Badge className="bg-yellow-500 text-white text-xs">
          <Crown className="w-3 h-3 mr-1" />
          Légendaire
        </Badge>
      );
    case "rare":
      return (
        <Badge className="bg-purple-500 text-white text-xs">
          <Star className="w-3 h-3 mr-1" />
          Rare
        </Badge>
      );
    default:
      return <Badge className="bg-blue-500 text-white text-xs">Commun</Badge>;
  }
}

export function PsgShopSection() {
  const { isConnected, hasEnoughPsgTokens } = useWeb3();

  // --- SECTION PSG LEADERS ---
  const leaders = [
    {
      id: "ballon-psg",
      name: "Ballon Scannable",
      image: "/shop/balon-psg.png",
      slogan: "Deviens PSG Leader !",
    },
    {
      id: "casquette-psg",
      name: "Casquette Scannable",
      image: "/shop/casquette-psg.png",
      slogan: "Partage l'expérience PSG !",
    },
    {
      id: "maillot-psg",
      name: "Maillot Scannable",
      image: "/shop/maillot-psg.png",
      slogan: "Accès concours & privilèges !",
    },
  ];

  // --- FIN SECTION PSG LEADERS ---

  return (
    <div className="space-y-12">
      {/* SECTION PSG LEADERS */}
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-center mb-6 bg-gradient-to-r from-red-600 via-white to-blue-600 bg-clip-text text-transparent uppercase tracking-widest drop-shadow-lg">
          PSG Leaders
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {leaders.map((item) => (
            <Card
              key={item.id}
              className="relative group overflow-hidden border-2 border-blue-600 bg-gradient-to-b from-white to-blue-50 shadow-xl rounded-2xl hover:scale-105 transition-transform duration-300"
            >
              <div className="absolute top-3 left-3 z-10">
                <Badge className="bg-gradient-to-r from-red-500 to-blue-500 text-white text-xs shadow-md animate-pulse">
                  SCANNABLE
                </Badge>
              </div>
              <div className="absolute top-3 right-3 z-10">
                <Badge className="bg-yellow-400 text-blue-900 text-xs font-bold shadow">
                  PSG Leader
                </Badge>
              </div>
              <CardContent className="flex flex-col items-center p-6">
                <div className="w-40 h-40 flex items-center justify-center mb-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="object-contain w-full h-full drop-shadow-xl"
                  />
                </div>
                <h3 className="font-bold text-lg text-blue-800 mb-2 text-center uppercase tracking-wide">
                  {item.name}
                </h3>
                <p className="text-red-600 font-semibold text-sm mb-4 text-center">
                  {item.slogan.replace("'", "&apos;")}
                </p>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-gradient-to-r from-red-600 to-blue-600 text-white text-xs font-bold shadow">
                    Achat uniquement en Chilliz
                  </Badge>
                </div>
                <Button className="w-full bg-gradient-to-r from-red-600 to-blue-600 hover:from-blue-700 hover:to-red-700 text-white font-bold text-lg py-2 rounded-xl shadow-lg transition-all duration-200">
                  <Crown className="w-5 h-5 mr-2" />
                  Acheter & devenir PSG Leader
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-6 text-blue-700 font-medium text-lg">
          <span className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-red-100 px-4 py-2 rounded-lg border border-blue-200 shadow">
            <Star className="w-5 h-5 text-yellow-400" />
            Deviens l&apos;attraction des événements PSG, partage
            l&apos;expérience et tente de gagner des prix exclusifs !
          </span>
        </div>
      </div>
      {/* FIN SECTION PSG LEADERS */}

      {/* Header de section avec statut PSG */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">🏪 Boutique Officielle PSG</h2>
        <p className="text-gray-600">
          Produits authentiques avec réductions exclusives
        </p>

        {hasEnoughPsgTokens && (
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-red-100 px-4 py-2 rounded-lg border border-blue-200">
            <Trophy className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-blue-700">
              🎉 Statut Fan PSG VIP Actif - Articles exclusifs débloqués !
            </span>
          </div>
        )}

        {isConnected && !hasEnoughPsgTokens && (
          <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
            <Trophy className="w-5 h-5 text-gray-500" />
            <span className="text-gray-600">
              Obtenez des $PSG tokens pour débloquer les articles exclusifs
            </span>
          </div>
        )}
      </div>

      {/* Produits exclusifs PSG (si éligible) */}
      {hasEnoughPsgTokens && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-blue-700">
              👑 Collection Exclusive PSG
            </h3>
            <Badge className="bg-gradient-to-r from-blue-500 to-red-500 text-white">
              Réservé aux détenteurs $PSG
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shopProducts
              .filter((p) => p.isPsgExclusive)
              .map((product) => (
                <Card
                  key={product.id}
                  className="group hover:shadow-xl transition-all duration-300 cursor-pointer relative border-2 border-yellow-200 bg-gradient-to-b from-yellow-50 to-white"
                >
                  <div className="absolute top-2 left-2 z-10">
                    {getRarityBadge(product.rarity || "common")}
                  </div>
                  <div className="absolute top-2 right-2 z-10">
                    <Badge className="bg-gradient-to-r from-blue-500 to-red-500 text-white text-xs">
                      PSG Exclusif
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <div className="w-full h-48 flex items-center justify-center mb-4">
                      <ShopImage
                        src={product.imageUrl}
                        alt={product.name}
                        fallbackText={product.name}
                      />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {product.description}
                    </p>

                    <PsgTokenPriceDisplay
                      originalPrice={product.originalPrice}
                      chzPrice={product.chzPrice}
                    />

                    <Button className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white mt-3">
                      <Crown className="w-4 h-4 mr-2" />
                      Acheter (VIP)
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}

      {/* Produits standards */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold">🛍️ Collection Standard</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shopProducts
            .filter((p) => !p.isPsgExclusive)
            .map((product) => (
              <Card
                key={product.id}
                className="group hover:shadow-xl transition-all duration-300 cursor-pointer relative"
              >
                <div className="absolute top-2 left-2 z-10">
                  {getRarityBadge(product.rarity || "common")}
                </div>
                <div className="absolute top-2 right-2 z-10">
                  <Badge className="bg-blue-500 text-white text-xs">
                    -{product.walletDiscount}% avec wallet
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <div className="w-full h-48 flex items-center justify-center mb-4">
                    <ShopImage
                      src={product.imageUrl}
                      alt={product.name}
                      fallbackText={product.name}
                    />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {product.description.replace(/'/g, "&apos;")}
                  </p>

                  <WalletPriceDisplay
                    originalPrice={product.originalPrice}
                    discountPercentage={product.walletDiscount}
                    chzPrice={product.chzPrice}
                  />

                  <Button className="w-full bg-gradient-to-r from-red-600 to-blue-600 mt-3">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Acheter
                  </Button>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>

      {/* Call to action pour non-connectés */}
      {!isConnected && (
        <div className="text-center p-8 bg-gradient-to-r from-blue-50 to-red-50 rounded-lg border border-blue-200">
          <Trophy className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-blue-700 mb-2">
            Connectez votre wallet pour plus d'avantages !
          </h3>
          <p className="text-blue-600 mb-4">
            Obtenez des réductions exclusives et débloquez les collections PSG
            VIP
          </p>
          <ul className="text-sm text-blue-600 space-y-1 max-w-md mx-auto">
            <li>🔸 Réductions automatiques sur tous les produits</li>
            <li>🔸 Accès prioritaire aux nouvelles collections</li>
            <li>🔸 Articles exclusifs réservés aux fans $PSG</li>
            <li>🔸 Paiements simplifiés en CHZ</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default PsgShopSection;
