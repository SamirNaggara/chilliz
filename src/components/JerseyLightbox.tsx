"use client";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { JerseyImage } from "@/components/JerseyImage";
import { useState } from "react";

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
  const [open, setOpen] = useState(false);

  return (
    <>
      <div onClick={() => setOpen(true)} className="cursor-zoom-in">
        {trigger}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl bg-black/90 p-0 flex flex-col items-center justify-center">
          <DialogClose className="absolute top-4 right-4 text-white hover:text-red-500">
            <X className="w-8 h-8" />
          </DialogClose>
          <div className="w-full h-full flex items-center justify-center p-4">
            <JerseyImage src={src} alt={alt} fallbackSrc={fallbackSrc} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
