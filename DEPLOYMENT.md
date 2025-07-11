# 🚀 Guide de Déploiement Vercel

## Configuration requise

### Variables d'environnement

Dans les paramètres de votre projet Vercel, ajoutez :

```
DATABASE_URL=file:./dev.db
```

### Base de données

Pour la production, il est recommandé d'utiliser PostgreSQL :

1. **Créer une base PostgreSQL** (Vercel Postgres, Supabase, etc.)
2. **Modifier le schéma Prisma** :

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

3. **Ajouter l'URL PostgreSQL** dans les variables d'environnement Vercel

## Déploiement

1. **Connecter le repository GitHub** à Vercel
2. **Configurer les variables d'environnement**
3. **Déployer automatiquement**

## Résolution des erreurs

### Erreur Prisma Client

Le build inclut maintenant `prisma generate` pour résoudre ce problème.

### Erreur React versions

Les versions React ont été mises à jour vers React 19.

## Commandes utiles

```bash
# Test local du build
npm run build

# Vérifier les variables d'environnement
vercel env ls

# Déployer manuellement
vercel --prod
```
