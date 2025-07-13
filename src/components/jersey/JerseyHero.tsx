import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";
import Link from "next/link";

interface JerseyHeroProps {
  jerseyName: string;
  assetUrl?: string | null;
  assetType?: string | null;
  isAuthentic: boolean;
}

export function JerseyHero({
  jerseyName,
  assetUrl,
  assetType,
  isAuthentic,
}: JerseyHeroProps) {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Titre du maillot au-dessus de l'image */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">{jerseyName}</h1>
        <p className="text-gray-600 text-lg">Official PSG Collection</p>
      </div>

      {/* Image principale avec effet et badge d'authenticité en absolute */}
      <div className="relative group cursor-pointer mb-8">
        {/* Badge d'authenticité en absolute */}
        <div className="absolute top-4 left-4 z-20">
          {isAuthentic ? (
            <Link href="/jerseydex">
              <Badge className="bg-green-500 text-white px-3 py-1 text-xs font-semibold rounded-lg shadow-lg flex items-center gap-1 hover:bg-green-600 transition-colors cursor-pointer">
                <Shield className="w-4 h-4 mr-1" />
                Authentic
              </Badge>
            </Link>
          ) : (
            <Badge className="bg-orange-400 text-white px-3 py-1 text-xs font-semibold rounded-lg shadow-lg flex items-center gap-1">
              <Shield className="w-4 h-4 mr-1" />
              Not authenticated
            </Badge>
          )}
        </div>
        <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-white p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-blue-500/10 rounded-2xl"></div>
          <div className="relative z-10">
            {assetType === "video" ? (
              <video
                src={assetUrl || "/jerseys/default-jersey.svg"}
                className="mx-auto max-h-96 rounded-xl shadow-lg"
              />
            ) : (
              <img
                src={assetUrl || "/jerseys/default-jersey.svg"}
                alt={jerseyName}
                className="mx-auto max-h-96 rounded-xl shadow-lg"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
