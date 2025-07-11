"use client";
import { useState } from "react";
import Image from "next/image";

interface ShopImageProps {
  src: string;
  alt: string;
  fallbackText: string;
}

export function ShopImage({ src, alt, fallbackText }: ShopImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setImgSrc("/shop/placeholder.jpg");
      setHasError(true);
    }
  };

  if (hasError) {
    return (
      <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
        <span className="text-gray-500 font-medium">{fallbackText}</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <Image
        src={imgSrc}
        alt={alt}
        fill
        className="object-contain rounded-lg"
        onError={handleError}
      />
    </div>
  );
}
