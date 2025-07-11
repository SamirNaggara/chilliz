import { Button } from "@/components/ui/button";
import { Coins, Zap } from "lucide-react";

export function ShopHeader() {
  return (
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">
        Boutique Officielle PSG
      </h2>
      <p className="text-gray-600 text-lg mb-6">
        Découvrez notre collection exclusive avec des avantages Chilliz
      </p>

      {/* Bannière de connexion wallet */}
      <div className="bg-gradient-to-r from-red-600 to-blue-600 rounded-2xl p-6 mb-8 text-white">
        <div className="flex items-center justify-center gap-4 mb-4">
          <Coins className="w-8 h-8" />
          <div>
            <h3 className="text-xl font-bold">
              Connectez votre Wallet Chilliz
            </h3>
            <p className="text-sm opacity-90">
              Débloquez des réductions exclusives et des récompenses
            </p>
          </div>
        </div>
        <Button className="bg-white text-red-600 hover:bg-gray-100 font-semibold">
          <Zap className="w-4 h-4 mr-2" />
          Connecter Wallet
        </Button>
      </div>
    </div>
  );
}
