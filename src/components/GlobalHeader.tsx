import Link from "next/link";
import { JerseyWalletConnector } from "@/components/JerseyWalletConnector";
import { Trophy } from "lucide-react";

export function GlobalHeader() {
  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
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

          <JerseyWalletConnector variant="header" />
        </div>
      </div>
    </div>
  );
}
