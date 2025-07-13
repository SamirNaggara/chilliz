import { Coins } from "lucide-react";

export function JerseyFooter() {
  return (
    <div className="bg-gradient-to-r from-red-600 to-blue-600 text-white py-8">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Coins className="w-6 h-6" />
          <span className="font-bold text-lg">Powered by Chilliz</span>
        </div>
        <p className="text-sm opacity-90">
          Discover the PSG blockchain ecosystem
        </p>
      </div>
    </div>
  );
}
