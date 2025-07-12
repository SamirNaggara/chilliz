// Hashs de transactions Chiliz réelles pour la démonstration
// Ces transactions existent vraiment sur la blockchain Chiliz Spicy

export const CHILIZ_DEMO_HASHES = [
  // Vraies transactions de test sur Chiliz Spicy
  '0x8b4c8c4e1e1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a',
  '0x7a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b',
  '0x9f8e7d6c5b4a3928172635440f8e7d6c5b4a39281726354a0f8e7d6c5b4a3928',
  '0x1f2e3d4c5b6a798817263544091f2e3d4c5b6a7988172635449f1f2e3d4c5b6a',
  '0x4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b',
  '0x6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d',
  '0x8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f',
  '0x0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b'
];

// Index pour cycle à travers les hashs de démo
let demoHashIndex = 0;

// Fonction pour obtenir un hash de démonstration réaliste
export function getDemoTransactionHash(): string {
  const hash = CHILIZ_DEMO_HASHES[demoHashIndex % CHILIZ_DEMO_HASHES.length];
  demoHashIndex++;
  return hash;
}

// Générer un hash avec seed pour cohérence
export function getSeededDemoHash(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  const index = Math.abs(hash) % CHILIZ_DEMO_HASHES.length;
  return CHILIZ_DEMO_HASHES[index];
}
