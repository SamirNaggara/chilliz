# 🤖 Instructions pour l'IA - POC Chilliz

## 🎯 Règles Obligatoires pour le Développement

### 📏 **RÈGLE N°1 : Taille des Composants**

- **NE JAMAIS** créer un composant de plus de 200 lignes
- **SI** un composant dépasse 150 lignes → le diviser immédiatement
- **TOUJOURS** extraire la logique métier dans des hooks personnalisés
- **TOUJOURS** séparer l'UI de la logique

### 🎯 **RÈGLE N°2 : Responsabilité Unique**

- **UN SEUL** composant = **UNE SEULE** responsabilité
- **NE JAMAIS** mélanger l'affichage avec les actions
- **TOUJOURS** créer des composants atomiques réutilisables

### 🏗️ **RÈGLE N°3 : Architecture Modulaire**

```
src/components/
├── ui/           # Composants UI de base (shadcn/ui)
├── layout/       # Composants de mise en page
├── features/     # Composants spécifiques aux fonctionnalités
└── common/       # Composants communs réutilisables
```

## 📋 Checklist OBLIGATOIRE avant chaque création de composant

### ✅ Vérifications Préalables

- [ ] Le composant aura-t-il moins de 200 lignes ?
- [ ] A-t-il une responsabilité unique ?
- [ ] Peut-il être réutilisé ailleurs ?
- [ ] Les props TypeScript sont-elles bien définies ?
- [ ] Est-il testable de manière isolée ?

### ✅ Structure TypeScript

```typescript
// TOUJOURS définir une interface claire
interface ComponentNameProps {
  // Props obligatoires en premier
  requiredProp: string;
  // Props optionnelles avec ?
  optionalProp?: number;
  // Callbacks avec on
  onAction?: () => void;
}

// TOUJOURS utiliser des types stricts
export function ComponentName({
  requiredProp,
  optionalProp,
  onAction,
}: ComponentNameProps) {
  // Logique du composant
}
```

## 🔧 Règles de Refactoring IMMÉDIATES

### 🚨 **TRIGGERS de Refactoring**

- Composant > 200 lignes → **REFACTORER IMMÉDIATEMENT**
- Plus de 5 props → **GROUPER les props**
- Logique métier dans l'UI → **EXTRAIRE en hook**
- Duplication de code → **CRÉER un composant commun**

### 📦 **Comment Refactorer**

#### 1. Extraire les Sous-Composants

```typescript
// ❌ AVANT - Composant monolithique
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

// ✅ APRÈS - Composants séparés
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

#### 2. Extraire les Hooks Personnalisés

```typescript
// ✅ TOUJOURS extraire la logique
function useJerseyData(id: string) {
  const [jersey, setJersey] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Logique de récupération
  }, [id]);

  return { jersey, loading };
}

// ✅ UI seulement dans le composant
function JerseyPage({ id }: { id: string }) {
  const { jersey, loading } = useJerseyData(id);

  if (loading) return <LoadingSpinner />;
  return <JerseyDisplay jersey={jersey} />;
}
```

#### 3. Extraire les Utilitaires

```typescript
// utils/jersey.ts
export function getJerseyImage(jerseyId: string): string {
  const imageMap: Record<string, string> = {
    "jersey-mbappe-2024": "/jerseys/jersey-mbappe-2024.png",
  };
  return imageMap[jerseyId] || "/jerseys/default-jersey.svg";
}

// Composant
import { getJerseyImage } from "@/utils/jersey";
```

## 🎨 Conventions de Nommage OBLIGATOIRES

### 📝 **Composants**

```typescript
// ✅ BON
JerseyImage.tsx;
UserProfile.tsx;
ShopProductCard.tsx;

// ❌ MAUVAIS
jersey - image.tsx;
user_profile.tsx;
shop - product - card.tsx;
```

### 📝 **Props Interfaces**

```typescript
// ✅ BON
interface JerseyImageProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
}

// ❌ MAUVAIS
interface Props {
  src: string;
  alt: string;
}
```

### 📝 **Hooks Personnalisés**

```typescript
// ✅ BON - Préfixe 'use'
function useJerseyData(id: string) {}
function useUserProfile(wallet: string) {}
function useShopProducts() {}
```

## 🧪 Règles de Test

### 📋 **Structure des Tests**

```
src/components/
└── JerseyImage/
    ├── JerseyImage.tsx
    ├── JerseyImage.test.tsx
    └── index.ts
```

### ✅ **Tests Obligatoires**

- [ ] Props principales
- [ ] Cas d'erreur
- [ ] Accessibilité
- [ ] Responsive design

## 🚀 Règles de Déploiement

### 📦 **Avant chaque commit**

```bash
# TOUJOURS vérifier
npm run lint
npm run build
npm run type-check
```

### 🔍 **Métriques à Vérifier**

- Taille des composants < 200 lignes
- Nombre de props < 8
- Pas de duplication de code
- Performance des images

## 🎯 **Objectifs de Qualité OBLIGATOIRES**

### ✅ **Maintenabilité**

- Code facile à comprendre
- Documentation claire
- Structure logique

### ✅ **Réutilisabilité**

- Composants modulaires
- Props bien définies
- Pas de logique métier dans l'UI

### ✅ **Performance**

- Chargement rapide
- Optimisation des images
- Bundle size minimal

### ✅ **Accessibilité**

- Support des lecteurs d'écran
- Navigation clavier
- Contrastes appropriés

### ✅ **Responsive**

- Mobile-first design
- Breakpoints cohérents
- Test sur tous les appareils

## 🚨 **RÈGLES D'URGENCE**

### ⚠️ **NE JAMAIS FAIRE**

- Créer un composant > 300 lignes
- Mélanger logique métier et UI
- Utiliser des noms de variables vagues
- Ignorer les erreurs TypeScript
- Copier-coller du code

### ✅ **TOUJOURS FAIRE**

- Diviser les gros composants
- Extraire la logique dans des hooks
- Utiliser des types TypeScript stricts
- Tester les composants
- Documenter les props complexes

## 📞 **En cas de doute**

1. Consulter ce fichier
2. Diviser le composant en plus petits
3. Extraire la logique
4. Demander clarification si nécessaire

---

**RÈGLE D'OR : Si un composant semble trop gros, il l'est probablement. Divisez-le !**
