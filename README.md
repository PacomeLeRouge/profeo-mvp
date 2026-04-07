# Clutch MVP

Plateforme de mise en relation entre étudiants et tuteurs pour des cours particuliers.

## Fonctionnalités

- **Parcours étudiant** : recherche de tuteurs par matière, prix et format, envoi de demandes de cours
- **Parcours tuteur** : création de profil avec tarifs, matières, disponibilités, gestion des demandes reçues
- **Matching** : système de demandes avec statuts (en attente, confirmé, refusé)

## Stack technique

- **Framework** : Next.js 16 + React 19
- **Langage** : TypeScript
- **Styling** : Tailwind CSS
- **UI** : shadcn/ui
- **State** : Zustand
- **Icons** : Lucide React

## Installation

```bash
npm install
```

## Développement

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## Build production

```bash
npm run build
```

## Structure du projet

```
src/
  app/                    # Routes Next.js App Router
    page.tsx              # Page de connexion
    signup/name/          # Inscription (nom)
    role-selection/       # Choix étudiant/tuteur
    onboarding/student/   # Onboarding étudiant
    onboarding/tutor/     # Onboarding tuteur
    dashboard/student/    # Dashboard étudiant
    dashboard/tutor/      # Dashboard tuteur
  components/
    Navbar.tsx            # Navigation principale
    ui/                   # Composants shadcn/ui
  lib/
    store/                # State management Zustand
    types.ts              # Types TypeScript
```

## Flow utilisateur

1. **Accueil** → Connexion rapide avec prénom
2. **Sélection de rôle** → Choix entre "Étudiant" ou "Tuteur"
3. **Onboarding** → Configuration du profil selon le rôle
4. **Dashboard** → Recherche/gestion des cours

---

Projet développé dans le cadre du MVP Clutch.
