import Link from "next/link";
import Image from "next/image";
import { JerseyWalletConnector } from "@/components/JerseyWalletConnector";

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
              <div className="w-8 h-8 relative">
                <Image
                  src="/fanscan_logo.png"
                  alt="FanScan Logo"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </div>
              <span className="font-bold text-lg text-gray-800 tracking-wide">
                FanScan
              </span>
            </Link>
          </div>

          <JerseyWalletConnector variant="header" />
        </div>
      </div>
    </div>
  );
}
