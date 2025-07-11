"use client";
import { useState } from "react";

interface ShopImageProps {
  src: string;
  alt: string;
  fallbackText: string;
  className?: string;
}

export function ShopImage({
  src,
  alt,
  fallbackText,
  className = "",
}: ShopImageProps) {
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return (
      <div
        className={`w-full h-full flex items-center justify-center bg-gray-100 rounded-lg ${className}`}
      >
        <div className="text-center text-gray-500">
          <div className="text-2xl mb-2">🛍️</div>
          <div className="text-sm font-medium">{fallbackText}</div>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`object-contain h-full rounded-lg shadow-md ${className}`}
      onError={() => setImageError(true)}
    />
  );
}
