import { Coins, Star, Crown } from "lucide-react";

export function ShopAdvantages() {
  return (
    <div className="mt-16 bg-gradient-to-r from-blue-50 to-red-50 rounded-2xl p-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Avantages Chilliz Exclusifs
        </h3>
        <p className="text-gray-600">
          Connectez votre wallet pour débloquer des réductions et récompenses
          uniques
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
          <h4 className="font-semibold text-lg mb-2">Réductions Exclusives</h4>
          <p className="text-gray-600 text-sm">
            Jusqu&apos;à 50% de réduction avec votre wallet
          </p>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h4 className="font-semibold text-lg mb-2">Produits Collectors</h4>
          <p className="text-gray-600 text-sm">
            Accès aux éditions limitées et collectors
          </p>
        </div>
      </div>
    </div>
  );
}
