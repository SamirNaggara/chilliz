import Link from "next/link";
import { JerseyWalletConnector } from "@/components/JerseyWalletConnector";
import { Trophy, Shield } from "lucide-react";

export function GlobalHeader() {
  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/jerseydex"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-blue-600 rounded-full flex items-center justify-center">
                <Trophy className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-gray-800 tracking-wide">
                FanScan
              </span>
            </Link>

            <Link
              href="/blockchain-verification"
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 hover:from-green-100 hover:to-emerald-100 transition-all duration-200"
            >
              <Shield className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                Vérification Blockchain
              </span>
            </Link>
          </div>

          <JerseyWalletConnector variant="header" />
        </div>
      </div>
    </div>
  );
}
