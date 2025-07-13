import Link from "next/link";
import { Button } from "@/components/ui/button";

interface JerseyDexEntry {
  id: string;
  jerseyId: string;
  jersey: {
    id: string;
    name: string;
    createdAt: Date | string;
    assetUrl: string | null;
    assetType: string | null;
  };
  addedAt: Date | string;
}

export function JerseyCard({ entry }: { entry: JerseyDexEntry }) {
  const isVideo = entry.jersey.assetType === "video";

  return (
    <div className="text-center">
      <div className="mb-4 relative w-32 h-32 mx-auto flex items-center justify-center">
        {isVideo ? (
          <video
            src={entry.jersey.assetUrl || "/jerseys/default-jersey.svg"}
            className="w-32 h-32 object-contain mx-auto"
            controls
          />
        ) : (
          <img
            src={entry.jersey.assetUrl || "/jerseys/default-jersey.svg"}
            alt={entry.jersey.name}
            className="w-32 h-32 object-contain mx-auto"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                "/jerseys/default-jersey.svg";
            }}
          />
        )}
      </div>
      <h3 className="font-semibold text-gray-800 mb-2">{entry.jersey.name}</h3>
      <Link href={`/jersey/${entry.jersey.id}`}>
        <Button variant="outline" size="sm">
          Voir le maillot
        </Button>
      </Link>
    </div>
  );
}
