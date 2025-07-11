# 🏆 POC Chilliz - Gestion des Maillots

Un projet Next.js avec Prisma SQLite et intégration Web3 pour gérer les utilisateurs, maillots et scans avec support de wallet Ethereum/Chiliz.

## 🚀 Technologies utilisées

- **Next.js 15** avec App Router
- **TypeScript** pour le typage statique
- **Prisma** avec SQLite pour la base de données
- **Tailwind CSS** pour le styling
- **shadcn/ui** pour les composants UI
- **Server Actions** pour le backend
- **Wagmi + Viem** pour l'intégration Web3
- **Ethers.js** pour les interactions blockchain
- **RainbowKit** pour la connexion wallet
- **TanStack Query** pour la gestion d'état

## 📋 Fonctionnalités

### Base de données
- ✅ Création d'utilisateurs avec adresse wallet
- ✅ Création de maillots avec ID et nom
- ✅ Enregistrement de scans (utilisateur + maillot)
- ✅ Affichage des données en temps réel
- ✅ Interface moderne avec shadcn/ui

### Web3 / Blockchain
- ✅ Connexion MetaMask et autres wallets
- ✅ Support multi-chaînes (Ethereum, Polygon, Arbitrum, Chiliz)
- ✅ Affichage du solde et informations wallet
- ✅ Gestion des erreurs Web3
- ✅ Hooks React personnalisés pour Web3
- ✅ Utilitaires Chiliz Chain

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

### Prérequis
- Node.js 18+ 
- npm ou yarn
- MetaMask ou autre wallet compatible

### 1. Cloner le projet

```bash
git clone <repository-url>
cd poc-chilliz
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

```bash
cp .env.example .env.local
```

Éditez `.env.local` et ajoutez votre Project ID WalletConnect (voir GUIDE_WEB3.md)

### 4. Initialiser la base de données

```bash
npm run db:migrate
```

### 5. Démarrer en développement

```bash
npm run dev
```

### 6. Configurer MetaMask

Suivez le guide complet dans `GUIDE_WEB3.md` pour :
- Installer MetaMask
- Ajouter les réseaux Chiliz
- Configurer les wallets de test
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
