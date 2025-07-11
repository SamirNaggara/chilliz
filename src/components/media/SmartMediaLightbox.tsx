"use client";
import { useState } from "react";
import { SmartMedia } from "./SmartMedia";

interface SmartMediaLightboxProps {
  basename: string;
  alt?: string;
  fallbackSrc?: string;
  className?: string;
}

export function SmartMediaLightbox({
  basename,
  alt,
  fallbackSrc,
  className,
}: SmartMediaLightboxProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className={className + " cursor-pointer"}
        onClick={() => setOpen(true)}
        tabIndex={0}
        role="button"
        aria-label="Voir en plein écran"
      >
        <SmartMedia
          basename={basename}
          alt={alt}
          fallbackSrc={fallbackSrc}
          className={className}
        />
      </div>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 animate-fade-in"
          onClick={() => setOpen(false)}
          tabIndex={-1}
        >
          <div
            className="relative max-w-3xl w-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-white text-3xl font-bold bg-black/60 rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/80 transition"
              onClick={() => setOpen(false)}
              aria-label="Fermer"
            >
              ×
            </button>
            <SmartMedia
              basename={basename}
              alt={alt}
              fallbackSrc={fallbackSrc}
              className="w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl bg-black"
            />
          </div>
        </div>
      )}
    </>
  );
}
