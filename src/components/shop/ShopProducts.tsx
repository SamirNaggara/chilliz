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
    name: "Basket PSG",
    description: "Basket officielle PSG",
    emoji: "👟",
    originalPrice: 120,
    discountedPrice: 85,
    chzPrice: 68,
    discountBadge: "-30% avec Chilliz",
    discountColor: "bg-blue-500",
  },
];

export function ShopProducts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map((product, index) => (
        <ShopProduct key={index} {...product} />
      ))}
    </div>
  );
}
