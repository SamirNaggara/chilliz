"use client";
import { useEffect, useState } from "react";

interface SmartMediaProps {
  basename: string; // ex: /jerseys/jersey-mbappe-2024
  alt?: string;
  fallbackSrc?: string;
  className?: string;
}

const EXTENSIONS = ["png", "jpg", "jpeg", "gif", "mp4"];

export function SmartMedia({
  basename,
  alt,
  fallbackSrc = "/jerseys/default-jersey.svg",
  className,
}: SmartMediaProps) {
  const [src, setSrc] = useState<string | null>(null);
  const [isVideo, setIsVideo] = useState(false);

  useEffect(() => {
    let found = false;
    let cancelled = false;

    (async () => {
      for (const ext of EXTENSIONS) {
        const url = `${basename}.${ext}`;
        try {
          const res = await fetch(url, { method: "HEAD" });
          if (res.ok && !cancelled) {
            setSrc(url);
            setIsVideo(ext === "mp4");
            found = true;
            break;
          }
        } catch {
          /* ignore */
        }
      }
      if (!found && !cancelled) {
        setSrc(fallbackSrc);
        setIsVideo(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [basename, fallbackSrc]);

  if (!src)
    return (
      <div
        className={className}
        style={{ minHeight: 200, background: "#f3f4f6" }}
      />
    );

  if (isVideo) {
    return (
      <video
        src={src}
        className={className}
        controls
        autoPlay
        loop
        muted
        playsInline
        style={{ maxHeight: 400, maxWidth: "100%", borderRadius: 16 }}
      />
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={{ maxHeight: 400, maxWidth: "100%", borderRadius: 16 }}
    />
  );
}
