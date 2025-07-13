"use client";

import { useAccount } from "wagmi";
import { JerseyWalletConnector } from "@/components/JerseyWalletConnector";

export function ShopHeader() {
  const { isConnected } = useAccount();

  return (
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">
        Become a PSG Leader
      </h2>
      <p className="text-gray-600 text-lg mb-2">
        Buy a scannable product, unlock exclusive PSG experiences and rewards
        with Chilliz.
      </p>
      <p className="text-blue-700 font-semibold text-base mb-6">
        Scan, share, and access unique benefits all year long as a PSG Leader!
      </p>

      {/* Only show wallet connection banner when not connected */}
      {!isConnected && <JerseyWalletConnector variant="banner" />}
    </div>
  );
}
