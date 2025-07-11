"use client";
import { useState } from "react";
import { X } from "lucide-react";

interface JerseyLightboxProps {
  src: string;
  alt: string;
  fallbackSrc: string;
  trigger: React.ReactNode;
}

export function JerseyLightbox({
  src,
  alt,
  fallbackSrc,
  trigger,
}: JerseyLightboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setImgSrc(fallbackSrc);
      setHasError(true);
    }
  };

  return (
    <>
      <div onClick={() => setIsOpen(true)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={imgSrc}
              alt={alt}
              className="max-w-full max-h-full object-contain rounded-lg"
              onError={handleError}
            />
          </div>
        </div>
      )}
    </>
  );
}
