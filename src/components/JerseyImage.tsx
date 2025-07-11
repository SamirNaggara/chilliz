"use client";
import { useState } from "react";
import Image from "next/image";

interface JerseyImageProps {
  src: string;
  alt: string;
  fallbackSrc: string;
  className?: string;
}

export function JerseyImage({
  src,
  alt,
  fallbackSrc,
  className = "",
}: JerseyImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setImgSrc(fallbackSrc);
      setHasError(true);
    }
  };

  return (
    <div className={`relative w-full h-full ${className}`}>
      <Image
        src={imgSrc}
        alt={alt}
        fill
        className="object-contain rounded-2xl"
        onError={handleError}
        priority
      />
    </div>
  );
}
