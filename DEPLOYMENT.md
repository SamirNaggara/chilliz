# 🚀 Guide de Déploiement Vercel - SQLite

## Configuration SQLite (Tout sur place)

Le projet utilise **SQLite** avec la base de données stockée localement dans `prisma/dev.db`.

### ✅ Avantages SQLite pour ce POC :

- **Aucune base externe** nécessaire
- **Base de données incluse** dans le déploiement
- **Configuration simple** - tout fonctionne immédiatement
- **Parfait pour les POC** et démonstrations

## Configuration requise

### Variables d'environnement Vercel

Dans les paramètres de votre projet Vercel, ajoutez :

```
DATABASE_URL=file:./dev.db
```

**Note :** Cette variable est déjà configurée dans `vercel.json`

## Déploiement

1. **Connecter le repository GitHub** à Vercel
2. **Aucune configuration supplémentaire** nécessaire
3. **Déployer automatiquement** - tout fonctionne !

## Fonctionnalités incluses

### ✅ Base de données SQLite

- Stockée dans `prisma/dev.db`
- Incluse dans le déploiement
- Données persistantes entre les déploiements

### ✅ Scripts automatisés

- `postinstall`: Génère le client Prisma
- `build`: Génère Prisma + pousse le schéma + build Next.js
- `db:seed`: Initialise avec des données d'exemple

### ✅ Données d'exemple

- 2 utilisateurs avec wallets
- 2 maillots (Mbappé, Messi)
- 2 scans d'exemple

## Commandes utiles

```bash
# Test local du build
npm run build

# Initialiser la base avec des données d'exemple
npm run db:seed

# Ouvrir Prisma Studio (local)
npm run db:studio

# Vérifier les variables d'environnement
vercel env ls
```

## Migration vers PostgreSQL (optionnel)

Si vous voulez passer à PostgreSQL plus tard :

1. **Modifier prisma/schema.prisma** :

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. **Ajouter l'URL PostgreSQL** dans Vercel
3. **Redeployer** le projet

## Résolution des erreurs

### ✅ Erreur Prisma Client

- Résolue avec `prisma generate` dans le build
- Script `postinstall` inclus

### ✅ Erreur React versions

- Versions React 19 configurées
- Compatible avec Vercel

### ✅ Base de données SQLite

- Fichier `dev.db` inclus dans le déploiement
- Pas de base externe nécessaire
