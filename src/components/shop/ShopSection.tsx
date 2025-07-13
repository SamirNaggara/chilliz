import { ShopHeader } from "./ShopHeader";
import { ShopProducts } from "./ShopProducts";
import { ShopAdvantages } from "./ShopAdvantages";

export function ShopSection() {
  return (
    <div id="shop" className="bg-white py-16">
      <div className="container mx-auto px-4">
        <ShopHeader />
        <ShopProducts />
        <ShopAdvantages />
      </div>
    </div>
  );
}
