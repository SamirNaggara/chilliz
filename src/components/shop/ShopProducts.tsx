import { Button } from "@/components/ui/button";

const products = [
  {
    name: "Scannable Ball",
    description: "Become a PSG Leader!",
    image: "/shop/ballon-psg.png",
    chzPrice: 34,
    badge: "SCANNABLE",
    leader: true,
  },
  {
    name: "Scannable Cap",
    description: "Share the PSG experience!",
    image: "/shop/casquette-psg.png",
    chzPrice: 29,
    badge: "SCANNABLE",
    leader: true,
  },
  {
    name: "Scannable Jersey",
    description: "Access contests & exclusive privileges!",
    image: "/shop/maillot-psg.png",
    chzPrice: 71,
    badge: "SCANNABLE",
    leader: true,
  },
  {
    name: "Scannable PSG Cleats",
    description: "Unlock exclusive access to PSG events!",
    image: "/shop/crampon-psg.png",
    chzPrice: 59,
    badge: "SCANNABLE",
    leader: true,
  },
];

export function ShopProducts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {products.map((product, index) => (
        <div
          key={index}
          className="relative group overflow-hidden border-2 border-blue-600 bg-gradient-to-b from-white to-blue-50 shadow-xl rounded-2xl hover:scale-105 transition-transform duration-300 p-4 mb-8"
        >
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-block bg-gradient-to-r from-red-500 to-blue-500 text-white text-xs px-3 py-1 rounded shadow-md animate-pulse font-bold">
              {product.badge}
            </span>
          </div>
          <div className="absolute top-3 right-3 z-10">
            <span className="inline-block bg-yellow-400 text-blue-900 text-xs font-bold px-3 py-1 rounded shadow">
              PSG Leader
            </span>
          </div>
          <div className="flex flex-col items-center p-6 gap-3">
            <div className="w-40 h-40 flex items-center justify-center mb-4">
              <img
                src={product.image}
                alt={product.name}
                className="object-contain w-full h-full drop-shadow-xl"
              />
            </div>
            <h3 className="font-bold text-lg text-blue-800 mb-2 text-center uppercase tracking-wide">
              {product.name}
            </h3>
            <p className="text-red-600 font-semibold text-sm mb-4 text-center">
              {product.description}
            </p>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block bg-gradient-to-r from-red-600 to-blue-600 text-white text-xs font-bold px-2 py-1 rounded shadow">
                Only available with Chilliz
              </span>
            </div>
            <span className="text-blue-700 font-bold text-lg mb-2">
              {product.chzPrice} CHZ
            </span>
            <Button
              className="w-full bg-gradient-to-r from-red-600 to-blue-600 hover:from-blue-700 hover:to-red-700 text-white font-bold text-base py-3 rounded-xl shadow-lg transition-all duration-200 mt-2 whitespace-normal break-words px-2"
              style={{
                minHeight: 48,
                wordBreak: "break-word",
                whiteSpace: "normal",
              }}
            >
              Buy & Become a PSG Leader
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
