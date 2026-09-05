# POC Chilliz - PSG Jersey Scanner

> **1re place du main track, Hacking Paris Contest 2025** (Chiliz, Parc des Princes, 90 projets).
> Démo : https://chilliz.vercel.app
>
> Le sujet : engagement des fans par NFC. Le supporter scanne son maillot pendant le match, aux moments clés (buts), pour interagir avec le club et participer à des tirages au sort.
> Réalisé en cinq jours pendant le contest. Stack : Next.js 15, Prisma, PostgreSQL, shadcn/ui, Chiliz Chain.

## 🎯 Objectif du Projet

Application Next.js 15 pour scanner des puces sécurisées sur des maillots PSG et offrir une expérience utilisateur gamifiée avec intégration Chilliz.

## 🏗️ Architecture et Bonnes Pratiques

### 📁 Structure des Dossiers

```
src/
├── app/                    # Pages Next.js (App Router)
│   ├── jersey/[id]/       # Page dynamique des maillots
│   └── page.tsx           # Page d'accueil
├── components/            # Composants réutilisables
│   ├── ui/               # Composants UI de base (shadcn/ui)
│   ├── layout/           # Composants de mise en page
│   ├── features/         # Composants spécifiques aux fonctionnalités
│   └── common/           # Composants communs réutilisables
├── lib/                  # Utilitaires et configurations
├── types/                # Types TypeScript
└── styles/               # Styles globaux
```

### 🧩 Règles de Création des Composants

#### 1. **Taille Maximum des Composants**

- **Maximum 200 lignes** par composant
- Si un composant dépasse 150 lignes, le diviser en sous-composants
- Un fichier de composant ne doit jamais dépasser 300 lignes

#### 2. **Responsabilité Unique**

- Un composant = une responsabilité
- Exemple : `JerseyCard` pour l'affichage, `JerseyActions` pour les actions

#### 3. **Composants Atomiques**

```typescript
// ✅ Bon - Composant simple et réutilisable
export function JerseyImage({ src, alt, fallbackSrc }: JerseyImageProps) {
  return <img src={src} alt={alt} onError={handleError} />;
}

// ❌ Mauvais - Composant trop complexe
export function JerseyPage() {
  // 300+ lignes de logique mélangée
}
```

#### 4. **Composition plutôt qu'Héritage**

```typescript
// ✅ Bon - Composition
<Card>
  <CardHeader>
    <CardTitle>Maillot PSG</CardTitle>
  </CardHeader>
  <CardContent>
    <JerseyImage />
  </CardContent>
</Card>

// ❌ Mauvais - Composant monolithique
<JerseyCardWithImageAndActions />
```

### 📋 Checklist de Création de Composant

Avant de créer un composant, vérifiez :

- [ ] Le composant a-t-il une responsabilité unique ?
- [ ] Fera-t-il moins de 200 lignes ?
- [ ] Peut-il être réutilisé ailleurs ?
- [ ] A-t-il des props TypeScript bien définies ?
- [ ] Est-il testable de manière isolée ?

### 🎨 Conventions de Nommage

#### Composants

```typescript
// ✅ Bon
JerseyImage.tsx;
UserProfile.tsx;
ShopProductCard.tsx;

// ❌ Mauvais
jersey - image.tsx;
user_profile.tsx;
shop - product - card.tsx;
```

#### Props Interfaces

```typescript
// ✅ Bon
interface JerseyImageProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
}

// ❌ Mauvais
interface Props {
  src: string;
  alt: string;
}
```

### 🔧 Refactoring Guidelines

#### Quand Refactorer

- Composant > 200 lignes
- Plus de 5 props
- Logique métier mélangée avec UI
- Duplication de code

#### Comment Refactorer

1. **Extraire les sous-composants**

```typescript
// Avant
function JerseyPage() {
  return (
    <div>
      <Header />
      <JerseyImage />
      <JerseyStats />
      <ShopSection />
    </div>
  );
}

// Après
function JerseyPage() {
  return (
    <div>
      <JerseyHeader />
      <JerseyDisplay />
      <JerseyMetrics />
      <JerseyShop />
    </div>
  );
}
```

2. **Extraire les hooks personnalisés**

```typescript
// ✅ Bon
function useJerseyData(id: string) {
  // Logique de récupération des données
}

function JerseyPage({ id }: { id: string }) {
  const { jersey, loading, error } = useJerseyData(id);
  // UI seulement
}
```

3. **Extraire les utilitaires**

```typescript
// utils/jersey.ts
export function getJerseyImage(jerseyId: string): string {
  // Logique de mapping des images
}

// Composant
import { getJerseyImage } from "@/utils/jersey";
```

### 🧪 Tests et Qualité

#### Structure des Tests

```
src/
├── components/
│   └── JerseyImage/
│       ├── JerseyImage.tsx
│       ├── JerseyImage.test.tsx
│       └── index.ts
```

#### Règles de Test

- Un test par composant
- Tester les props principales
- Tester les cas d'erreur
- Tester l'accessibilité

### 📦 Gestion des Dépendances

#### Installation

```bash
# Composants UI
npx shadcn@latest add [component-name]

# Dépendances métier
npm install [package-name]
```

#### Vérification

```bash
# Vérifier les dépendances inutilisées
npm run lint

# Vérifier la taille du bundle
npm run build
```

### 🚀 Déploiement

#### Préparation

```bash
# Générer le client Prisma
npx prisma generate

# Build de production
npm run build

# Test local
npm run start
```

#### Vercel

- Build command : `npm run build`
- Output directory : `.next`
- Install command : `npm install`

### 🔍 Monitoring et Maintenance

#### Métriques à Surveiller

- Taille des composants (< 200 lignes)
- Nombre de props par composant (< 8)
- Duplication de code
- Performance des images

#### Outils Recommandés

- ESLint pour la qualité du code
- Prettier pour le formatage
- TypeScript pour la sécurité des types
- Lighthouse pour les performances

### 📝 Exemples de Refactoring

#### Exemple 1 : Composant Trop Gros

```typescript
// ❌ Avant - 300+ lignes
function JerseyPage() {
  // Logique de récupération
  // Logique de formatage
  // Logique d'affichage
  // Logique d'actions
  return <div>...</div>;
}

// ✅ Après - Composants séparés
function JerseyPage() {
  return (
    <div>
      <JerseyHeader />
      <JerseyContent />
      <JerseyActions />
    </div>
  );
}
```

#### Exemple 2 : Props Trop Nombreuses

```typescript
// ❌ Avant - Trop de props
function JerseyCard({
  id, name, image, price, description,
  onBuy, onFavorite, onShare, ...
}: JerseyCardProps) {
  // ...
}

// ✅ Après - Props groupées
function JerseyCard({
  jersey,
  actions
}: {
  jersey: Jersey;
  actions: JerseyActions;
}) {
  // ...
}
```

## 🎯 Objectifs de Qualité

- **Maintenabilité** : Code facile à comprendre et modifier
- **Réutilisabilité** : Composants modulaires et réutilisables
- **Performance** : Chargement rapide et optimisation des images
- **Accessibilité** : Support des lecteurs d'écran et navigation clavier
- **Responsive** : Fonctionne sur tous les appareils

## 📞 Support

Pour toute question sur l'architecture ou les bonnes pratiques, consulter ce README en premier.
