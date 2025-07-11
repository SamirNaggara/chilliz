import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag } from "lucide-react";

interface ShopProductProps {
  name: string;
  description: string;
  image?: string;
  emoji?: string;
  originalPrice: number;
  discountedPrice: number;
  chzPrice: number;
  discountBadge: string;
  discountColor: string;
}

export function ShopProduct({
  name,
  description,
  image,
  emoji,
  originalPrice,
  discountedPrice,
  chzPrice,
  discountBadge,
  discountColor,
}: ShopProductProps) {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer relative">
      <div className={`absolute top-2 left-2 z-10`}>
        <Badge className={`${discountColor} text-white text-xs`}>
          {discountBadge}
        </Badge>
      </div>
      <CardContent className="p-6">
        <div className="w-full h-48 flex items-center justify-center mb-4">
          {emoji ? (
            <div className="bg-gray-100 rounded-lg w-full h-full flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-2">{emoji}</div>
                <div className="text-sm font-medium">{name}</div>
              </div>
            </div>
          ) : (
            <img
              src={image}
              alt={name}
              className="object-contain h-full rounded-lg shadow-md"
            />
          )}
        </div>
        <h3 className="font-semibold text-lg mb-2">{name}</h3>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        <div className="flex items-center justify-between mb-3">
          <div>
            <span
              className={`text-2xl font-bold ${discountColor.replace(
                "bg-",
                "text-"
              )}`}
            >
              {discountedPrice}€
            </span>
            <span className="text-sm text-gray-500 line-through ml-2">
              {originalPrice}€
            </span>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-600 font-semibold">
              {chzPrice} CHZ
            </div>
            <div className="text-xs text-gray-500">avec wallet</div>
          </div>
        </div>
        <Button className="w-full bg-gradient-to-r from-red-600 to-blue-600">
          <ShoppingBag className="w-4 h-4 mr-2" />
          Acheter
        </Button>
      </CardContent>
    </Card>
  );
}
