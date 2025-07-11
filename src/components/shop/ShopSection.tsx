import { ShopHeader } from "./ShopHeader";
import { ShopFilters } from "./ShopFilters";
import { ShopProducts } from "./ShopProducts";
import { ShopAdvantages } from "./ShopAdvantages";

export function ShopSection() {
  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <ShopHeader />
        <ShopFilters />
        <ShopProducts />
        <ShopAdvantages />
      </div>
    </div>
  );
}
