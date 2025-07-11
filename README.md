# 🏆 POC Chilliz - Gestion des Maillots

Un projet Next.js avec Prisma SQLite pour gérer les utilisateurs, maillots et scans.

## 🚀 Technologies utilisées

- **Next.js 15** avec App Router
- **TypeScript** pour le typage statique
- **Prisma** avec SQLite pour la base de données
- **Tailwind CSS** pour le styling
- **shadcn/ui** pour les composants UI
- **Server Actions** pour le backend

## 📋 Fonctionnalités

- ✅ Création d'utilisateurs avec adresse wallet
- ✅ Création de maillots avec ID et nom
- ✅ Enregistrement de scans (utilisateur + maillot)
- ✅ Affichage des données en temps réel
- ✅ Interface moderne avec shadcn/ui

## 🗄️ Modèle de données

### User

- `id`: Identifiant unique (cuid)
- `wallet`: Adresse wallet unique
- `scans`: Relation avec les scans
- `winners`: Relation avec les gains
- `createdAt`: Date de création

### Jersey

- `id`: Identifiant du maillot (peut être l'ID physique de la puce)
- `name`: Nom ou description du maillot
- `scans`: Relation avec les scans
- `createdAt`: Date de création

### Scan

- `id`: Identifiant unique (cuid)
- `user`: Relation avec l'utilisateur
- `jersey`: Relation avec le maillot
- `scannedAt`: Date et heure du scan

### Contest

- `id`: Identifiant unique (cuid)
- `startedAt`: Date de début
- `endedAt`: Date de fin (optionnel)
- `winners`: Relation avec les gagnants
- `createdAt`: Date de création

### Winner

- `id`: Identifiant unique (cuid)
- `contest`: Relation avec le concours
- `user`: Relation avec l'utilisateur
- `prize`: Description du prix gagné

## 🛠️ Installation

1. **Cloner le projet**

```bash
git clone <repository-url>
cd poc-chilliz
```

2. **Installer les dépendances**

```bash
npm install
```

3. **Configurer la base de données**

```bash
npx prisma generate
npx prisma migrate dev
```

4. **Lancer le serveur de développement**

```bash
npm run dev
```

5. **Ouvrir dans le navigateur**

```
http://localhost:3000
```

## 📁 Structure du projet

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/           # Composants shadcn/ui
│   ├── CreateUserForm.tsx
│   ├── CreateJerseyForm.tsx
│   └── CreateScanForm.tsx
└── lib/
    ├── actions.ts    # Server Actions
    ├── prisma.ts     # Configuration Prisma
    └── utils.ts      # Utilitaires
```

## 🔧 Commandes utiles

```bash
# Générer le client Prisma
npx prisma generate

# Créer une migration
npx prisma migrate dev --name <nom-migration>

# Voir la base de données
npx prisma studio

# Reset de la base de données
npx prisma migrate reset
```

## 🎯 Utilisation

1. **Créer un utilisateur** : Entrez une adresse wallet
2. **Créer un maillot** : Entrez l'ID et le nom du maillot
3. **Enregistrer un scan** : Sélectionnez un utilisateur et un maillot
4. **Voir les données** : Les listes se mettent à jour automatiquement

## 🔮 Prochaines étapes

- [ ] Ajouter l'authentification
- [ ] Implémenter les concours et gains
- [ ] Ajouter des statistiques
- [ ] Interface mobile responsive
- [ ] API REST pour intégration externe

## 📝 Notes

- La base de données SQLite est stockée dans `prisma/dev.db`
- Les Server Actions sont utilisées pour toutes les opérations CRUD
- L'interface utilise Tailwind CSS et shadcn/ui pour un design moderne
- Le projet est prêt pour la production avec Next.js 15
