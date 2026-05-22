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
- **Auth** : Clerk (email, Google)
- **Base de données** : Neon Postgres + Drizzle ORM
- **Déploiement** : Vercel (frontend + API)
- **E-mails** : Resend (notifications de demandes de cours)
- **Icons** : Lucide React

## Installation (client / fresh stack)

```bash
npm install
vercel link
vercel integration add clerk
vercel integration add neon
vercel env pull .env.local --yes
npm run bootstrap:check
npm run db:push
npm run dev
```

Guide handoff agent : [docs/HANDOFF.md](docs/HANDOFF.md) · sans MCP : [docs/HANDOFF-DASHBOARD.md](docs/HANDOFF-DASHBOARD.md) · détails : [docs/DEPLOY.md](docs/DEPLOY.md)

## Développement

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## Documentation

| Document | Contenu |
|----------|---------|
| [docs/HANDOFF.md](docs/HANDOFF.md) | Checklist plug-and-play client (Antigravity + Vercel) |
| [docs/HANDOFF-DASHBOARD.md](docs/HANDOFF-DASHBOARD.md) | Parcours dashboards sans MCP Vercel |
| [AGENTS.md](AGENTS.md) | Index pour l'agent Cursor |
| [docs/product.md](docs/product.md) | Parcours, rôles, demandes de cours |
| [docs/architecture.md](docs/architecture.md) | Stack, auth, BDD, server actions |
| [docs/DEPLOY.md](docs/DEPLOY.md) | Vercel, Clerk, Neon, Resend |
| [docs/legal/email-consent.md](docs/legal/email-consent.md) | Consentement e-mail |
| [/legal](/legal) | Page publique informations légales |
| `.cursor/skills/` | Skills agent (bootstrap, design, produit, légal) |
| `.cursor/rules/` | Règles Cursor persistantes |
| `.context/handoff.md` | Résumé handoff pour Antigravity |

## Build production

```bash
npm run build
```

## Structure du projet

```
src/
  app/                    # Routes Next.js App Router
    page.tsx              # Connexion
    sign-up/              # Inscription Clerk
    auth/continue/        # Redirection post-auth
    role-selection/       # Choix étudiant/tuteur
    onboarding/           # Profils étudiant / tuteur
    dashboard/            # Dashboards
    actions/              # Server actions
  components/             # UI (onboarding, dashboard, theme, ui/)
  lib/                    # Auth, types, email, validation
  db/                     # Schéma Drizzle + client Neon
docs/                     # Documentation équipe
.context/                 # Contexte agent Antigravity
.cursor/skills/           # Connaissances agent
.cursor/rules/            # Règles Cursor
AGENTS.md                 # Index agent
```

## Flow utilisateur

1. **Accueil** → Connexion (email ou Google via Clerk)
2. **Sélection de rôle** → Choix entre "Étudiant" ou "Tuteur"
3. **Onboarding** → Configuration du profil (enregistré en base)
4. **Dashboard** → Recherche/gestion des cours

---

Projet développé dans le cadre du MVP Clutch.
