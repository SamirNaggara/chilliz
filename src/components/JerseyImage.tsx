"use client";

import Image from "next/image";
import { useState } from "react";

interface JerseyImageProps {
  src: string;
  alt: string;
  fallbackSrc: string;
}

export function JerseyImage({ src, alt, fallbackSrc }: JerseyImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setImgSrc(fallbackSrc);
      setHasError(true);
    }
  };

  return (
    <div className="relative aspect-square w-full max-w-md mx-auto">
      <Image
        src={imgSrc}
        alt={alt}
        fill
        className="object-contain rounded-lg"
        priority
        onError={handleError}
      />
    </div>
  );
}
