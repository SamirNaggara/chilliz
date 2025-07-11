import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Fonction pour déterminer l'image du maillot selon l'id
export function getJerseyImage(jersey: { id: string; image?: string }): string {
  // Si un champ image existe en BDD, on l'utilise
  if (jersey.image) return jersey.image;

  // Mapping des IDs vers les images disponibles
  const jerseyImageMap: Record<string, string> = {
    // Maillots Mbappé
    "jersey-mbappe-2024": "/jerseys/jersey-mbappe-2024.png", // Maillot Mbappé Home 2024
    "jersey-mbappe-home-2024": "/jerseys/jersey-mbappe-2024.png", // Maillot Mbappé Home 2024
    "jersey-mbappe-away-2024": "/jerseys/jersey-mbappe-2024.png", // Maillot Mbappé Away 2024

    // Maillots Messi
    "jersey-messi-2024": "/jerseys/jersey-messi-2024.png", // Maillot Messi Home 2024
    "jersey-messi-home-2024": "/jerseys/jersey-messi-2024.png", // Maillot Messi Home 2024
    "jersey-messi-away-2024": "/jerseys/jersey-messi-2024.png", // Maillot Messi Away 2024

    // Autres maillots (utilisent l'image par défaut)
    "jersey-neymar-2024": "/jerseys/default-jersey.svg", // Maillot Neymar Home 2024
    "jersey-hakimi-2024": "/jerseys/default-jersey.svg", // Maillot Hakimi Home 2024
    "jersey-marquinhos-2024": "/jerseys/default-jersey.svg", // Maillot Marquinhos Home 2024
  };

  // Retourner l'image correspondante ou l'image par défaut
  return jerseyImageMap[jersey.id] || "/jerseys/default-jersey.svg";
}
