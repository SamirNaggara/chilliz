# 🏆 HACKATHON CHILLIZ/PSG - OBJECTIF & PLAN

## 🎯 **CONTEXTE DU HACKATHON**

**Événement** : Hackathon Blockchain Chilliz au Parc des Princes avec le PSG
**Track** : Fan Token Utility - $50,000 USD de prix total
**Entreprise** : Safeout - Solution sécurisée d'authentification physique via puces NFC

### **Prix à Gagner**

- **Premier Prix** : $15,000 USD
- **Runner-up** : $7,500 USD
- **Milestones** : $15,000 USD supplémentaires (3 et 6 mois)

## 🚀 **CONCEPT SAFEOUT**

### **Proposition de Valeur**

Safeout garantit à 100% le lien entre un produit physique et sa version digitale via des puces NFC non-copiables. Idéal pour un club comme le PSG.

### **Triple Concept du POC**

#### **1. Scan & Collection**

- Scan d'un maillot authentique
- Connexion wallet Chilliz
- Visualisation du maillot possédé
- Ajout à l'inventaire personnel ("Pokédex")

#### **2. Shop & Réductions**

- Boutique avec produits PSG
- Réductions exclusives avec tokens Chilliz
- Gamification de l'expérience d'achat

#### **3. Loterie & Événements**

- Concours automatiques lors d'événements (buts, etc.)
- Participation automatique via scan + wallet
- Gains en Chilliz + cadeaux custom

## 🎮 **POC HACKATHON - DÉMONSTRATION**

### **Scénario de Démo**

1. **Distribution de puces** aux membres du jury
2. **Scan croisé** des maillots entre participants
3. **Collection** dans l'inventaire personnel
4. **Concours en temps réel** avec sélection de gagnants
5. **Décompte automatique** des résultats

### **Règles du Concours**

- ✅ Scan d'un maillot = 1 participation
- ✅ 1 minute de cooldown par maillot après scan
- ✅ Pas de double scan du même maillot
- ✅ Plusieurs scans = plusieurs participations
- ✅ 3 gagnants sélectionnés automatiquement

## 🛠️ **ARCHITECTURE TECHNIQUE**

### **Stack**

- **Frontend** : Next.js 15
- **Backend** : API Routes Next.js
- **Base de données** : SQLite + Prisma
- **Déploiement** : Vercel
- **Authentification** : Chilliz + MetaMask (en cours par autre dev)

### **Tables Prisma**

```sql
// Maillots
Jersey {
  id, name, image, isAuthentic, cooldownUntil
}

// Scans
Scan {
  id, jerseyId, userId, timestamp, walletAddress
}

// Concours
Contest {
  id, name, startTime, endTime, prize, winners
}

// Participations
Participation {
  id, contestId, userId, jerseyId, timestamp
}
```

## 📋 **FONCTIONNALITÉS À DÉVELOPPER**

### **1. Page Maillot (✅ DONE)**

- Affichage du maillot scanné
- Badge d'authenticité
- Lightbox pour l'image
- Section shop avec réductions Chilliz

### **2. Page Concours (🔄 À FAIRE)**

- **Création de concours** avec :
  - Nom du concours
  - Heure de début/fin
  - Prix à gagner (description)
  - Nombre de gagnants
- **Participation automatique** via scan + wallet
- **Timer de cooldown** (1 minute par maillot)
- **Prévention double scan** du même maillot

### **3. Page Résultats (🔄 À FAIRE)**

- **Affichage automatique** des gagnants
- **Tâche CRON** pour génération des résultats
- **Historique** des concours passés

### **4. Inventaire Personnel (🔄 À FAIRE)**

- **Collection de maillots** scannés
- **Interface "Pokédex"**
- **Statistiques** de collection

## 🎯 **PLAN DE DÉVELOPPEMENT RAPIDE**

### **Phase 1 : Structure Base (1 jour)**

- [ ] Modifier schéma Prisma pour concours
- [ ] Créer pages de gestion des concours
- [ ] Implémenter système de cooldown

### **Phase 2 : Logique Concours (1 jour)**

- [ ] Système de participation automatique
- [ ] Prévention double scan
- [ ] Timer de cooldown

### **Phase 3 : Résultats & Inventaire (1 jour)**

- [ ] Génération automatique des résultats
- [ ] Page inventaire personnel
- [ ] Interface "Pokédex"

### **Phase 4 : Intégration Wallet (1 jour)**

- [ ] Merge avec authentification Chilliz
- [ ] Tests complets
- [ ] Déploiement Vercel

## 🔗 **INTÉGRATION FUTURE**

### **Préparation pour Merge**

- Structure modulaire pour ajout facile de l'auth
- Props pour wallet address
- Composants réutilisables
- API routes prêtes pour wallet integration

### **Fake Data Strategy**

- Ajout manuel des maillots en BDD
- Simulation des scans pour démo
- Données de test pour jury

## 🏆 **OBJECTIF HACKATHON**

**Démontrer** que Safeout peut créer une expérience fan unique où :

1. **Authenticité garantie** via puces NFC
2. **Gamification** via collection et concours
3. **Monétisation** via shop et tokens Chilliz
4. **Engagement** via événements en temps réel

**Résultat attendu** : POC fonctionnel qui impressionne le jury et montre le potentiel business pour le PSG.
