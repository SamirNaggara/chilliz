import { Button } from "@/components/ui/button";
import { Shield, Zap } from "lucide-react";

export function JerseyHeader() {
  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-blue-600 rounded-full flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-800">
              PSG Authentic
            </span>
          </div>

          <Button className="bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 text-white font-semibold">
            <Zap className="w-4 h-4 mr-2" />
            Connect with Chilliz
          </Button>
        </div>
      </div>
    </div>
  );
}
