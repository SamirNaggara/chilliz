# Documentation - Connexion MetaMask

## Fonctionnalités Implémentées

### 1. Connexion MetaMask sur la page de scan

La page de scan (`/src/app/scan/page.tsx`) inclut maintenant :
- Détection automatique de MetaMask
- Bouton "Connecter mon Wallet" visible quand l'utilisateur n'est pas connecté
- Affichage de l'adresse wallet tronquée après connexion (ex: 0x1234...5678)
- Indicateur visuel "Wallet connecté" avec animation
- Possibilité de déconnexion

### 2. Intégration dans CreateScanForm

Le composant `CreateScanForm` (`/src/components/CreateScanForm.tsx`) a été amélioré avec :
- Section dédiée "Connexion Wallet" en haut du formulaire
- Détection de MetaMask avec message d'installation si nécessaire
- Auto-remplissage automatique du champ utilisateur si l'adresse wallet correspond
- Interface utilisateur moderne avec indicateurs visuels

### 3. Composants réutilisables

- **WalletConnector** : Composant autonome pour la connexion
- **WalletInfo** : Affichage des informations détaillées du wallet
- **Web3Provider** : Provider global pour les hooks wagmi

## Technologies Utilisées

- **wagmi** : Hooks React pour l'interaction Web3
- **viem** : Librairie TypeScript pour Ethereum
- **MetaMask** : Extension de wallet supportée
- **Next.js** : Framework React
- **TailwindCSS** : Styling

## Configuration

### Réseaux supportés
- Ethereum Mainnet (1)
- Sepolia Testnet (11155111)
- Polygon Mainnet (137)
- Arbitrum One (42161)
- Chiliz Chain (88888)
- Chiliz Spicy Testnet (88882)

### Connecteurs disponibles
- MetaMask (injected)
- WalletConnect
- Connecteurs injectés génériques

## Utilisation

### Page de test
Visitez `/test-wallet` pour tester toutes les fonctionnalités :
- Test de connexion MetaMask
- Affichage des informations wallet
- Formulaire de scan avec auto-remplissage

### Page de scan principale
Visitez `/scan` pour l'expérience utilisateur complète :
- Scan automatique après connexion wallet
- Gestion des erreurs et messages utilisateur
- Interface optimisée mobile

## Fonctions utilitaires

### `formatAddress(address: string)`
Formate une adresse Ethereum en version tronquée : `0x1234...5678`

### `detectMetaMask()`
Détecte la présence et la disponibilité de MetaMask

### `isSupportedChain(chainId: number)`
Vérifie si un réseau blockchain est supporté

### `getChainName(chainId: number)`
Retourne le nom d'un réseau blockchain

## Messages utilisateur

### États de connexion
- ✅ "Wallet connecté" - Connexion réussie
- ⚠️ "MetaMask non détecté" - Extension non installée  
- 🔗 "Connecter mon Wallet" - Bouton de connexion
- ⏳ "Connexion..." - État de chargement

### Gestion d'erreurs
- Rejection utilisateur (code 4001)
- Paramètres invalides (code -32602)
- Erreurs internes (code -32603)
- Messages personnalisés selon le contexte

## Sécurité

- Validation côté client et serveur
- Gestion des erreurs robuste
- Vérification des réseaux supportés
- Auto-déconnexion en cas de changement de compte

## Performance

- Lazy loading des composants Web3
- Hooks optimisés avec wagmi
- Détection côté client uniquement
- Gestion d'état minimaliste
