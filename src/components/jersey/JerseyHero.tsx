import { Badge } from "@/components/ui/badge";
import { SmartMediaLightbox } from "@/components/media/SmartMediaLightbox";
import { Shield } from "lucide-react";

interface JerseyHeroProps {
  jerseyName: string;
  jerseyImage: string;
  isAuthentic: boolean;
}

export function JerseyHero({
  jerseyName,
  jerseyImage,
  isAuthentic,
}: JerseyHeroProps) {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Image principale avec effet et badge d'authenticité en absolute */}
      <div className="relative group cursor-pointer mb-8">
        {/* Badge d'authenticité en absolute */}
        <div className="absolute top-4 left-4 z-20">
          {isAuthentic ? (
            <Badge className="bg-green-500 text-white px-3 py-1 text-xs font-semibold rounded-lg shadow-lg flex items-center gap-1">
              <Shield className="w-4 h-4 mr-1" />
              Authentique
            </Badge>
          ) : (
            <Badge className="bg-orange-400 text-white px-3 py-1 text-xs font-semibold rounded-lg shadow-lg flex items-center gap-1">
              <Shield className="w-4 h-4 mr-1" />
              Non authentifié
            </Badge>
          )}
        </div>
        <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-white p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-blue-500/10 rounded-2xl"></div>
          <div className="relative z-10">
            <SmartMediaLightbox
              basename={jerseyImage.replace(/\.(png|jpg|jpeg|gif|mp4)$/i, "")}
              alt={jerseyName}
              fallbackSrc="/jerseys/default-jersey.svg"
              className="mx-auto"
            />
          </div>
        </div>
      </div>

      {/* Informations du maillot */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">{jerseyName}</h1>
        <p className="text-gray-600 text-lg">Collection Officielle PSG</p>
      </div>
    </div>
  );
}
