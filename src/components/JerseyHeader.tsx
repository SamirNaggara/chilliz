"use client";

import { JerseyWalletConnector } from "@/components/JerseyWalletConnector";
import { useWeb3 } from "@/hooks/useWeb3";
import { Badge } from "@/components/ui/badge";
import { Coins, Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface JerseyHeaderProps {
  jerseyName: string;
}

export function JerseyHeader({ jerseyName }: JerseyHeaderProps) {
  const {
    isConnected,
    hasEnoughPsgTokens,
    psgDiscountPercentage,
    psgTokenBalance,
  } = useWeb3();

  const tokenAmount = Number(psgTokenBalance?.balance || 0) / 1e18;

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo et nom du jersey */}
          <div className="flex items-center gap-4">
            <Link
              href="/jerseydex"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-6 h-6 relative">
                <Image
                  src="/fanscan_logo.png"
                  alt="FanScan Logo"
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              </div>
            </Link>
            <h2 className="text-xl font-bold text-gray-800">{jerseyName}</h2>
            {isConnected && hasEnoughPsgTokens && (
              <Badge className="bg-gradient-to-r from-blue-500 to-red-500 text-white">
                <Trophy className="w-3 h-3 mr-1" />
                VIP Fan -{psgDiscountPercentage}%
              </Badge>
            )}
          </div>

          {/* Section wallet et PSG */}
          <div className="flex items-center gap-4">
            {/* Solde PSG compact */}
            {isConnected && (
              <div className="hidden md:flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-lg">
                <Coins className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">
                  {tokenAmount.toLocaleString()} $PSG
                </span>
                {hasEnoughPsgTokens && (
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-700 text-xs"
                  >
                    VIP
                  </Badge>
                )}
              </div>
            )}

            {/* Wallet connector */}
            <JerseyWalletConnector variant="header" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default JerseyHeader;
