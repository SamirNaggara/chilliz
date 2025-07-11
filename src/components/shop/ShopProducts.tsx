import { ShopProduct } from "./ShopProduct";

const products = [
  {
    name: "Maillot Domicile 2024",
    description: "Maillot officiel du PSG",
    image:
      "https://www.footballkitarchive.com/static/img/kits/2025-26/paris-saint-germain-2025-26-home-kit-1.jpg",
    originalPrice: 111,
    discountedPrice: 89,
    chzPrice: 71,
    discountBadge: "-20% avec Chilliz",
    discountColor: "bg-green-500",
  },
  {
    name: "Écharpe Officielle",
    description: "Écharpe PSG authentique",
    emoji: "🧣",
    originalPrice: 29,
    discountedPrice: 25,
    chzPrice: 21,
    discountBadge: "-15% avec Chilliz",
    discountColor: "bg-blue-500",
  },
  {
    name: "Ballon Officiel",
    description: "Ballon de match officiel",
    emoji: "⚽",
    originalPrice: 60,
    discountedPrice: 45,
    chzPrice: 34,
    discountBadge: "-25% avec Chilliz",
    discountColor: "bg-purple-500",
  },
  {
    name: "Casquette Collector",
    description: "Édition limitée",
    emoji: "🧢",
    originalPrice: 50,
    discountedPrice: 35,
    chzPrice: 25,
    discountBadge: "-30% avec Chilliz",
    discountColor: "bg-yellow-500",
  },
  {
    name: "Gants de Gardien",
    description: "Gants officiels PSG",
    emoji: "🧤",
    originalPrice: 125,
    discountedPrice: 75,
    chzPrice: 45,
    discountBadge: "-40% avec Chilliz",
    discountColor: "bg-green-500",
  },
  {
    name: "Poster Géant",
    description: "Poster collector 120x80cm",
    emoji: "🖼️",
    originalPrice: 40,
    discountedPrice: 20,
    chzPrice: 15,
    discountBadge: "-50% avec Chilliz",
    discountColor: "bg-orange-500",
  },
  {
    name: "Maillot Extérieur 2024",
    description: "Maillot extérieur officiel",
    image:
      "https://www.footballkitarchive.com/static/img/kits/2025-26/paris-saint-germain-2025-26-away-kit-1.jpg",
    originalPrice: 111,
    discountedPrice: 89,
    chzPrice: 71,
    discountBadge: "-20% avec Chilliz",
    discountColor: "bg-blue-500",
  },
  {
    name: "Mug Collector",
    description: "Mug officiel PSG",
    emoji: "☕",
    originalPrice: 23,
    discountedPrice: 15,
    chzPrice: 10,
    discountBadge: "-35% avec Chilliz",
    discountColor: "bg-red-500",
  },
];

export function ShopProducts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <ShopProduct key={index} {...product} />
      ))}
    </div>
  );
}
