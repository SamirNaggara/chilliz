import { Button } from "@/components/ui/button";

export function ShopFilters() {
  return (
    <div className="flex flex-wrap justify-center gap-4 mb-8">
      <Button
        variant="outline"
        className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
      >
        Tous
      </Button>
      <Button variant="outline" className="border-gray-300">
        Maillots
      </Button>
      <Button variant="outline" className="border-gray-300">
        Accessoires
      </Button>
      <Button variant="outline" className="border-gray-300">
        Équipements
      </Button>
      <Button variant="outline" className="border-gray-300">
        Collectors
      </Button>
    </div>
  );
}
