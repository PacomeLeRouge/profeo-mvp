# Architecture Clutch

## Stack

| Couche | Technologie |
|--------|-------------|
| Frontend | Next.js 16 App Router, React 19, TypeScript |
| Style | Tailwind CSS 4, shadcn/ui, tokens dans `globals.css` |
| Auth | Clerk (middleware + webhooks) |
| BDD | Neon Postgres + Drizzle ORM |
| E-mails | Resend (optionnel) |
| Hébergement | Vercel |

## Structure du dépôt

```
src/
  app/                 # Routes, layouts, API, server actions
    actions/           # Mutations serveur (profiles, requests, user, dashboard)
    api/webhooks/      # Clerk → sync users
    auth/continue/     # Router post-connexion
    dashboard/         # Dashboards étudiant / tuteur
    onboarding/        # Wizards profil
    dev/                 # Previews (dev only)
  components/          # UI React (onboarding, dashboard, theme, ui/)
  db/                  # schema.ts, client Drizzle
  lib/                 # Logique partagée, types, email, auth, mappers
  hooks/               # use-app-data.ts (client → server actions)
  data/                # Données statiques (universités EU)
drizzle/               # Migrations SQL
scripts/               # seed, smoke test, email test
docs/                  # Documentation humaine
.cursor/               # Skills + rules pour l'agent
```

## Authentification

### Middleware

`src/middleware.ts` — `clerkMiddleware` + protection des routes non publiques.

Routes publiques : `/`, `/sign-up`, `/legal`, `/api/webhooks`, `/dev` (dev only).

### Sync utilisateur

Deux mécanismes complémentaires :

1. **Lazy** — `ensureDbUser()` crée la ligne `users` au premier accès authentifié
2. **Webhook** — `POST /api/webhooks/clerk` sur `user.created` / `updated` / `deleted`

L'ID Clerk = clé primaire `users.id`.

### Redirection post-auth

`getOnboardingRedirectPath()` dans `src/lib/auth.ts` :

```
pas de user DB     → /
pas de role        → /role-selection
student sans profil → /onboarding/student
student avec profil → /dashboard/student
tutor sans profil   → /onboarding/tutor
tutor avec profil   → /dashboard/tutor
```

Le rôle est aussi synchronisé dans Clerk `publicMetadata.role` via `syncClerkRole()`.

## Modèle de données

Schéma : `src/db/schema.ts`

| Table | Rôle |
|-------|------|
| `users` | Compte (id Clerk, email, name, role, consentement e-mail) |
| `student_profiles` | Profil étudiant (1:1 user) |
| `tutor_profiles` | Profil tuteur publié (1:1 user) |
| `lesson_requests` | Demandes étudiant → tuteur |

Enums : `user_role`, `subject`, `lesson_format`, `request_status`.

Types applicatifs : `src/lib/types.ts`. Mapping DB → app : `src/lib/mappers.ts`.

## Couche données

### Chargement serveur

- Dashboards : `src/lib/data/dashboard.ts` (`loadStudentDashboard`, `loadTutorDashboard`)
- Pages dashboard : Server Components qui chargent puis passent props aux clients

### Server actions

| Fichier | Responsabilité |
|---------|----------------|
| `actions/user.ts` | Rôle, utilisateur courant |
| `actions/profiles.ts` | CRUD profils, liste tuteurs |
| `actions/requests.ts` | CRUD demandes de cours |
| `actions/dashboard.ts` | Refresh dashboard |

Toutes les mutations appellent `revalidatePath` sur les routes concernées.

### Client

`use-app-data.ts` agrège les server actions pour les composants client qui en ont besoin.

## Flux demande de cours

```
StudentDashboard → createLessonRequestAction
  → insert lesson_requests (Pending)
  → notifyTutorOfNewLessonRequest (async, Resend)

TutorDashboard → updateLessonRequestStatusAction (Confirmed | Declined)
  → notifyStudentOfLessonRequestStatus (async)
  → UI mailto si Confirmed
```

E-mails de contact snapshotés : `studentContactEmail`, `tutorContactEmail`, noms.

## Thème et UI

- Tokens CSS : `src/app/globals.css` (`:root` light, `.dark` Neon Noir)
- Skill agent : `.cursor/skills/clutch-design-system/`
- Clerk theming : `src/lib/clerk-appearance.ts`, `src/styles/clerk-auth.css`
- Animations onboarding : GSAP (`src/lib/gsap-config.ts`)

## Variables d'environnement

Voir `.env.example` et [DEPLOY.md](DEPLOY.md). Handoff client : [HANDOFF.md](HANDOFF.md).

| Variable | Requis | Notes |
|----------|--------|-------|
| `NEXT_PUBLIC_CLERK_*`, `CLERK_SECRET_KEY` | Oui | Auth |
| `CLERK_WEBHOOK_SECRET` | Prod | Sync users |
| `DATABASE_URL` | Oui | Neon |
| `RESEND_API_KEY`, `EMAIL_FROM` | Non | Notifications |
| `NEXT_PUBLIC_APP_URL` | Non | Liens dans e-mails |

## Legacy / dev only

- `src/lib/store/` — Zustand + mock data pour previews `/dev/preview/dashboard/*`
- `src/lib/demo-seed.ts` — préfixe utilisateurs seed

Ne pas utiliser le store Zustand pour les parcours production.
