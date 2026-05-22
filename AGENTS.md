# Clutch — guide agent

Index pour travailler sur **Clutch** (repo Next.js). Lire ce fichier en premier, puis les skills et règles selon la tâche.

## Quoi / pour qui

Plateforme de tutorat entre étudiants d'une même université. Deux rôles : **étudiant** (cherche de l'aide) et **tuteur** (propose des cours). Le matching passe par des **demandes de cours** avec statuts ; le contact se fait **par e-mail hors plateforme** une fois une demande acceptée.

## Premier setup client (handoff)

Pour un **nouveau déploiement** (clone GitHub → Vercel + Clerk + Neon) :

1. Lire [docs/HANDOFF.md](docs/HANDOFF.md)
2. Suivre le skill `.cursor/skills/clutch-bootstrap/`
3. Règle `.cursor/rules/client-bootstrap.mdc` si setup / déploiement demandé

```bash
npm install
vercel link                    # nouveau projet client
vercel integration add clerk
vercel integration add neon
vercel env pull .env.local --yes
npm run bootstrap:check
npm run db:push
vercel deploy --prod
```

## Où chercher quoi

| Besoin | Emplacement |
|--------|-------------|
| Handoff client (fresh stack) | [docs/HANDOFF.md](docs/HANDOFF.md) · skill `clutch-bootstrap` |
| Handoff sans MCP / dashboards | [docs/HANDOFF-DASHBOARD.md](docs/HANDOFF-DASHBOARD.md) |
| Parcours produit, statuts, UX | [docs/product.md](docs/product.md) · skill `.cursor/skills/clutch-product/` |
| Architecture, auth, données | [docs/architecture.md](docs/architecture.md) |
| Déploiement Vercel / Clerk / Neon | [docs/DEPLOY.md](docs/DEPLOY.md) |
| Consentement e-mail, disclaimers | [docs/legal/email-consent.md](docs/legal/email-consent.md) · skill `.cursor/skills/clutch-legal/` · page `/legal` |
| Design system UI | `.cursor/skills/clutch-design-system/` · `src/app/globals.css` |
| Schéma BDD | `src/db/schema.ts` |
| Types app | `src/lib/types.ts` |
| Server actions | `src/app/actions/` |
| Pages / routes | `src/app/` |
| Composants UI | `src/components/` |

## Commandes utiles

```bash
npm run dev              # http://localhost:3000 — previews /dev en dev only
npm run build
npm run bootstrap:check  # vérifie les clés requises dans .env.local
npm run db:push          # appliquer le schéma Drizzle sur Neon
npm run test:smoke       # smoke test onboarding
```

Copier `.env.example` → `.env.local`, ou préférer `vercel env pull .env.local --yes` si le projet est lié à Vercel. Variables obligatoires : Clerk + `DATABASE_URL`. Resend optionnel.

**Ops Vercel** : schéma BDD → `vercel env pull` + `npm run db:push` · app → git push ou `vercel deploy --prod`

## Parcours utilisateur (résumé)

```
/ ou /sign-up → /auth/continue → /role-selection? → /onboarding/{role}? → /dashboard/{role}
```

Logique de redirection : `src/lib/auth.ts` → `getOnboardingRedirectPath()`.

## Règles Cursor (`.cursor/rules/`)

- `clutch-conventions.mdc` — conventions code, stack, patterns
- `onboarding-flows.mdc` — étapes onboarding, consentement, édition profil
- `client-bootstrap.mdc` — setup / handoff / déploiement client

## Skills projet (`.cursor/skills/`)

| Skill | Quand l'utiliser |
|-------|------------------|
| `clutch-bootstrap` | Setup client, handoff, premier déploiement Vercel |
| `clutch-design-system` | Toute UI / CSS / composant |
| `clutch-product` | Logique métier, dashboards, demandes |
| `clutch-legal` | Disclaimer, consentement, contact e-mail |

## Conventions rapides

- **Langue UI** : français
- **Auth** : Clerk ; ID utilisateur = PK `users.id`
- **Données** : server components + server actions ; pas de fetch client direct vers la BDD
- **UI** : tokens sémantiques (`text-foreground`, `bg-primary`, …) — jamais de lime avec `text-white`
- **Scope** : changements minimaux, réutiliser composants existants

## Dev previews

Routes `/dev/*` accessibles uniquement si `NODE_ENV === "development"` (`src/lib/dev-preview.ts`). Ne pas exposer en production.

## Fichiers sensibles au produit

- Consentement : `ContactEmailDisclaimer.tsx`, `ContactEmailConsentStep.tsx`, `OnboardingShell.tsx`
- Contact après match : `ContactEmailLink.tsx`, `lesson-request-mailto.ts`
- E-mails transactionnels : `src/lib/email/` (Resend, optionnel)
