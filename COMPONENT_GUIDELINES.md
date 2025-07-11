# Guide des Bonnes Pratiques - Structure des Composants

## Règles pour les Pages (`page.tsx`)

### ✅ Ce qu'une page DOIT faire :

1. **Être légère** - Maximum 50-100 lignes
2. **Récupérer les données** - Appels API, Prisma, etc.
3. **Passer les props** - Transmettre les données aux composants
4. **Gérer les erreurs** - `notFound()`, try/catch
5. **Structurer le layout** - Organisation générale de la page

### ❌ Ce qu'une page NE DOIT PAS faire :

1. **Contenir du JSX complexe** - Pas de logique d'affichage détaillée
2. **Gérer l'état local** - Utiliser des composants clients pour cela
3. **Contenir des styles complexes** - Déléguer aux composants
4. **Être trop longue** - Si > 100 lignes, découper en composants

## Structure Recommandée

```typescript
// ✅ BON - Page légère et organisée
export default async function Page({ params, searchParams }) {
  // 1. Récupération des données
  const data = await fetchData(params);

  // 2. Gestion des erreurs
  if (!data) notFound();

  // 3. Calculs simples
  const stats = calculateStats(data);

  // 4. Rendu avec composants
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-blue-50">
      <PageHeader />
      <PageHero data={data} />
      <PageStats stats={stats} />
      <PageContent data={data} />
      <PageFooter />
    </div>
  );
}
```

## Organisation des Composants

### 1. Composants de Layout

- `PageHeader` - Header de la page
- `PageFooter` - Footer de la page
- `PageContainer` - Container principal

### 2. Composants de Section

- `HeroSection` - Section principale
- `StatsSection` - Statistiques
- `ContentSection` - Contenu principal
- `ShopSection` - Section boutique

### 3. Composants Spécialisés

- `ProductCard` - Carte de produit
- `StatsCard` - Carte de statistique
- `Button` - Boutons
- `Badge` - Badges

### 4. Composants de Logique

- `ContestParticipation` - Logique de participation
- `WalletConnection` - Connexion wallet
- `ImageGallery` - Galerie d'images

## Exemple de Découpage

### Avant (Page monolithique)

```typescript
// ❌ MAUVAIS - Page de 500+ lignes
export default function Page() {
  return (
    <div>
      {/* 200 lignes de JSX */}
      <Header />
      <Hero />
      <Stats />
      <Shop />
      <Footer />
    </div>
  );
}
```

### Après (Page découpée)

```typescript
// ✅ BON - Page légère avec composants
export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-blue-50">
      <PageHeader />
      <PageHero />
      <PageStats />
      <ShopSection />
      <PageFooter />
    </div>
  );
}
```

## Avantages du Découpage

1. **Maintenabilité** - Plus facile à modifier
2. **Réutilisabilité** - Composants réutilisables
3. **Testabilité** - Tests unitaires par composant
4. **Performance** - Re-render optimisés
5. **Lisibilité** - Code plus clair
6. **Collaboration** - Travail en équipe facilité

## Convention de Nommage

- **Pages** : `page.tsx` (Next.js)
- **Composants** : `PascalCase.tsx`
- **Sections** : `SectionName.tsx`
- **Layouts** : `LayoutName.tsx`
- **UI** : `ui/ComponentName.tsx`

## Checklist pour une Page

- [ ] Page fait moins de 100 lignes
- [ ] Logique métier dans des composants séparés
- [ ] Styles complexes dans des composants dédiés
- [ ] Gestion d'état dans des composants clients
- [ ] Props bien typées avec TypeScript
- [ ] Gestion d'erreurs appropriée
- [ ] Composants réutilisables
- [ ] Structure claire et logique
