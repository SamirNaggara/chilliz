import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Fonction pour déterminer l'image du maillot selon l'id
export function getJerseyImage(jersey: { id: string; image?: string }): string {
  // Si un champ image existe en BDD, on l'utilise
  if (jersey.image) return jersey.image;

  // Retourner l'image correspondant à l'id
  return `/jerseys/${jersey.id}.png`;
}
