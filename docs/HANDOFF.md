# Handoff client — Clutch (fresh stack)

Guide exécutable pour un **nouveau déploiement** : le client clone le repo GitHub, ouvre le projet dans **Antigravity / Cursor**, et laisse un agent suivre cette checklist.

**Sans MCP Vercel ou sans CLI** → parcours dashboards : [HANDOFF-DASHBOARD.md](HANDOFF-DASHBOARD.md)

Pour les détails Clerk, Neon et Resend, voir [DEPLOY.md](DEPLOY.md).

## Prérequis

- Node.js 20+
- Compte [Vercel](https://vercel.com) avec accès au **Marketplace** (Clerk + Neon)
- Plugin **Vercel** dans Cursor (MCP) — optionnel ; voir [HANDOFF-DASHBOARD.md](HANDOFF-DASHBOARD.md) sans MCP
- Vercel CLI installée et authentifiée (recommandé pour ce guide) :

```bash
npm i -g vercel
vercel whoami
```

## Checklist agent (ordre strict)

### 1. Installation locale

```bash
git clone <url-du-repo> clutch
cd clutch
npm install
```

### 2. Lier un **nouveau** projet Vercel

Ne pas réutiliser un projet existant d’un autre compte.

```bash
vercel link
# Choisir l’équipe du client
# Créer un nouveau projet (ex. clutch-mvp)
```

Vérifier que `.vercel/project.json` existe (fichier gitignoré, local uniquement).

### 3. Intégrations Marketplace

Depuis le CLI ou le dashboard Vercel :

```bash
vercel integration add clerk --scope <team-du-client>
vercel integration add neon --scope <team-du-client>
```

Cela provisionne automatiquement `NEXT_PUBLIC_CLERK_*`, `CLERK_SECRET_KEY` et `DATABASE_URL` sur le projet Vercel.

### 4. Variables d’environnement

```bash
vercel env pull .env.local --yes
```

Comparer avec le template :

```bash
npm run bootstrap:check
```

Si des clés manquent, les ajouter sur Vercel (Settings → Environment Variables) puis relancer `vercel env pull`.

| Clé | Statut |
|-----|--------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Requis |
| `CLERK_SECRET_KEY` | Requis |
| `CLERK_WEBHOOK_SECRET` | Requis (après création webhook Clerk, étape 7) |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Requis (`/`) |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Requis (`/sign-up`) |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | Requis (`/auth/continue`) |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | Requis (`/auth/continue`) |
| `DATABASE_URL` | Requis |
| `NEXT_PUBLIC_APP_URL` | Recommandé en prod |
| `RESEND_API_KEY`, `EMAIL_FROM` | Optionnel |

Référence complète : [`.env.example`](../.env.example)

### 5. Base de données

```bash
npm run db:push
```

Applique le schéma Drizzle sur Neon. Ne pas exécuter `npm run db:seed` en production (script de nettoyage démo uniquement).

### 6. Premier déploiement

**Option A — Git (recommandé)** : connecter le repo GitHub au projet Vercel, push sur `main`.

**Option B — CLI** :

```bash
vercel deploy --prod
```

Noter l’URL de production : `https://<votre-projet>.vercel.app`

### 7. Post-déploiement (obligatoire)

1. **Clerk — Webhook**  
   - URL : `https://<votre-domaine>/api/webhooks/clerk`  
   - Événements : `user.created`, `user.updated`, `user.deleted`  
   - Copier le signing secret → `CLERK_WEBHOOK_SECRET` sur Vercel  
   - `vercel env pull .env.local --yes` puis redéployer si besoin

2. **URL publique**  
   - Définir `NEXT_PUBLIC_APP_URL=https://<votre-domaine>` sur Vercel (Production)

3. **Clerk — Paths** (Dashboard → Paths)  
   - Sign-in : `/`  
   - Sign-up : `/sign-up`

4. **Resend** (optionnel)  
   - Clé API + `EMAIL_FROM` sur Vercel pour les notifications de demandes de cours

### 8. Vérification

```bash
npm run bootstrap:check
npm run build
npm run test:smoke
```

Parcours manuel en production :

1. `/` — connexion (email ou Google)
2. `/auth/continue` — redirection
3. `/role-selection` — choix étudiant ou tuteur
4. `/onboarding/...` — profil
5. `/dashboard/...` — dashboard

## Résultat attendu

- Application accessible sur l’URL Vercel du client
- Utilisateurs synchronisés Clerk → Neon (webhook + `ensureDbUser`)
- Demandes de cours persistées en base
- E-mails transactionnels actifs si Resend configuré

## Dépannage

| Symptôme | Action |
|----------|--------|
| Erreur CSS `package.json Unexpected end of JSON` en dev | `pkill -f "next dev"` puis `rm -rf .next` et relancer `npm run dev` |
| `bootstrap:check` échoue | `vercel env pull .env.local --yes`, compléter les clés sur Vercel |
| Connexion OK mais pas de ligne `users` en BDD | Vérifier webhook Clerk + `CLERK_WEBHOOK_SECRET` |
| E-mails absents | Normal sans Resend ; vérifier `RESEND_API_KEY` et `EMAIL_FROM` |

## Transfert vs fresh stack

Ce guide décrit un **fresh stack** (nouveau Vercel + Clerk + Neon). Pour transférer un projet existant, voir la section 7 de [DEPLOY.md](DEPLOY.md).

## Pour les agents Antigravity / Cursor

- Lire ce fichier en premier pour tout setup / handoff / déploiement
- Suivre le skill `.cursor/skills/clutch-bootstrap/SKILL.md`
- Ne jamais afficher les valeurs des secrets en terminal ou dans le chat
