# Variables d'environnement

## Configuration actuelle

Le projet utilise SQLite par défaut, configuré automatiquement par Prisma.

## Variables disponibles

### Base de données

- `DATABASE_URL` : URL de la base de données (SQLite par défaut)

### Environnement

- `NODE_ENV` : Environnement (development/production)

### Futur - Authentification

- `NEXTAUTH_SECRET` : Secret pour NextAuth.js
- `NEXTAUTH_URL` : URL de l'application

## Configuration de production

Pour déployer en production, vous pouvez :

1. **Utiliser SQLite** (recommandé pour les POC)

   ```bash
   # Aucune configuration supplémentaire nécessaire
   ```

2. **Utiliser PostgreSQL** (pour la production)

   ```bash
   # Modifier prisma/schema.prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }

   # Ajouter dans .env
   DATABASE_URL="postgresql://user:password@localhost:5432/poc_chilliz"
   ```

## Commandes utiles

```bash
# Ouvrir Prisma Studio
npm run db:studio

# Générer le client Prisma
npm run db:generate

# Créer une migration
npm run db:migrate

# Reset de la base de données
npm run db:reset
```
