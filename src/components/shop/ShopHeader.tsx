import { JerseyWalletConnector } from "@/components/JerseyWalletConnector";

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
      <JerseyWalletConnector variant="banner" />
    </div>
  );
}
