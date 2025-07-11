"use client";

import { useAccount } from "wagmi";
import { JerseyWalletConnector } from "@/components/JerseyWalletConnector";

export function ShopHeader() {
  const { isConnected } = useAccount();

  return (
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">
        PSG Official Store
      </h2>
      <p className="text-gray-600 text-lg mb-6">
        Discover our exclusive collection with Chilliz benefits
      </p>

      {/* Only show wallet connection banner when not connected */}
      {!isConnected && <JerseyWalletConnector variant="banner" />}
    </div>
  );
}
