# Chilliz : scanner NFC de maillots PSG

> **1re place du main track, Hacking Paris Contest 2025** (Chiliz, Parc des Princes, 13 au 17 juillet 2025, 90 projets).
> Démo : https://chilliz.vercel.app

**À lire avant le code.** Ce projet a été vibe-codé à l'arrache en cinq jours pendant le hackathon, avec beaucoup d'IA et très peu de sommeil. Il a gagné, il tourne, mais ce n'est pas du code de production : peu de tests, des fichiers de notes à la racine, des raccourcis partout. Je le laisse tel quel parce que c'est ce que c'était. Ce qui compte ici, c'est l'idée et le temps de réalisation.

## L'idée

Engagement des fans par NFC. Le supporter scanne la puce de son maillot avec son téléphone pendant le match, aux moments clés (un but, une mi-temps), et ça lui ouvre une interaction avec le club : participation à un tirage au sort, points, historique de ses scans. Chaque maillot a une identité, chaque scan est horodaté, et les récompenses passent par la Chiliz Chain.

Ce qui a été montré au jury :

- Scan d'un maillot, page dynamique par maillot, historique des scans
- Événements « moment clé » déclenchés côté admin, avec tirage au sort parmi les scanneurs
- Écriture et vérification des scans sur la Chiliz Chain, avec la timeline des transactions
- Une interface qui reste utilisable à une main, dans un stade, avec du réseau moyen

## Stack

Next.js 15 (App Router), TypeScript, Prisma sur PostgreSQL, shadcn/ui, ethers vers la Chiliz Chain. Déployé sur Vercel.

## Lancer en local

```bash
npm install
cp .env.example .env      # DATABASE_URL et clés
npx prisma db push        # crée le schéma
npm run dev
```

Le déploiement de démo n'a plus de base de données derrière lui depuis la fin du hackathon : certaines pages dynamiques ne répondent plus, c'est attendu.

## Ce qu'il y a dans le dépôt

```text
src/app/            pages Next.js, dont jersey/[id]
src/components/     composants (ui, layout, features)
prisma/             schéma et migrations
docs/               les notes et guides écrits pendant le contest, gardés bruts
test-*.js, *.sh     scripts de test à la main de la partie blockchain
```
