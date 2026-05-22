# Déploiement Clutch (Vercel + Clerk + Neon)

Pour un **premier déploiement client** (fresh stack), commencer par [HANDOFF.md](HANDOFF.md).

## 1. Comptes à créer

1. [Vercel](https://vercel.com) — hébergement Next.js
2. [Clerk](https://clerk.com) — authentification
3. [Neon](https://neon.tech) — base Postgres
4. [Resend](https://resend.com) — e-mails (demandes de cours, optionnel)

Ou installez Clerk et Neon depuis le **Vercel Marketplace** sur le projet client (`vercel integration add clerk` / `neon`).

## 2. Clerk — configuration

1. Créez une application Clerk (ou via Marketplace Vercel).
2. **Social connections** (Dashboard → User & Authentication → Social):
   - Activez **Google** (Microsoft volontairement désactivé — consentement admin requis sur les comptes `@uclouvain.be`)
3. **Paths** :
   - Sign-in URL : `/`
   - Sign-up URL : `/sign-up`
4. Copiez les clés dans `.env.local` (voir `.env.example`).

### Webhook (sync utilisateurs → Neon)

1. Clerk → **Webhooks** → Add endpoint  
   URL : `https://VOTRE-DOMAINE/api/webhooks/clerk`
2. Événements : `user.created`, `user.updated`, `user.deleted`
3. Copiez le **Signing secret** → `CLERK_WEBHOOK_SECRET`

En local avec [ngrok](https://ngrok.com) :

```bash
ngrok http 3000
# Utilisez l'URL HTTPS dans Clerk
```

## 3. Neon — base de données

### Via Vercel Marketplace (recommandé)

1. Installez l'intégration Neon sur le projet Vercel (`vercel integration add neon`).
2. `DATABASE_URL` est provisionnée automatiquement dans les env Vercel.
3. Appliquez le schéma en local avec les variables Vercel :

```bash
vercel link
vercel env pull .env.local --yes
npm run bootstrap:check
npm run db:push
```

### Setup manuel (fallback)

1. Créez un projet Neon (région proche de vos utilisateurs).
2. Copiez `DATABASE_URL` dans `.env.local`.
3. Appliquez le schéma :

```bash
cp .env.example .env.local
# Remplissez DATABASE_URL et les clés Clerk
npm run bootstrap:check
npm run db:push
```

### Après une modification du schéma Drizzle

Même flux : `vercel env pull` puis `npm run db:push` contre la base Neon liée au projet Vercel. Le déploiement applicatif se fait séparément (git push ou `vercel deploy --prod`).

## 4. Resend — notifications par e-mail

Les demandes de cours déclenchent des e-mails transactionnels :

- **Nouvelle demande** → e-mail au tuteur
- **Acceptation / refus** → e-mail à l'étudiant

1. Créez un compte [Resend](https://resend.com) et une clé API.
2. En développement, utilisez `onboarding@resend.dev` comme expéditeur (domaine de test Resend).
3. En production, vérifiez votre domaine et mettez par ex. `Clutch <noreply@votredomaine.com>` dans `EMAIL_FROM`.
4. Ajoutez sur Vercel :

```env
RESEND_API_KEY=re_...
EMAIL_FROM=Clutch <onboarding@resend.dev>
NEXT_PUBLIC_APP_URL=https://votre-projet.vercel.app
```

Sans `RESEND_API_KEY`, l'app fonctionne normalement : les demandes sont enregistrées en base, les e-mails sont simplement ignorés (message dans les logs en dev).

## 5. Lancer en local

```bash
npm install
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

## 6. Déployer sur Vercel

Le flux habituel :

1. **Git** — push sur `main` → déploiement production automatique (si l'intégration GitHub est active)
2. **CLI** — déploiement manuel depuis le repo :

```bash
vercel link
vercel deploy --prod
```

Variables locales synchronisées depuis Vercel :

```bash
vercel env pull .env.local --yes
npm run bootstrap:check
```

Variables d'environnement à définir sur Vercel (Production + Preview) :

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `CLERK_WEBHOOK_SECRET`
- `DATABASE_URL`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL` = `/`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL` = `/sign-up`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` = `/auth/continue`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` = `/auth/continue`
- `NEXT_PUBLIC_APP_URL` = `https://votre-projet.vercel.app` (ou domaine custom)
- `RESEND_API_KEY` (optionnel)
- `EMAIL_FROM` (optionnel)

Après le premier déploiement, mettez à jour l'URL du webhook Clerk avec le domaine de production.

## 7. Transfert au client (alternative au fresh stack)

| Ressource | Action |
|-----------|--------|
| **Code** | Transférer le repo GitHub ou donner accès à l'organisation du client |
| **Vercel** | *Transfer Project* vers l'équipe du client, ou nouveau projet + même repo |
| **Clerk** | Transférer l'application ou créer une nouvelle app + nouvelles clés |
| **Neon** | Export/import SQL ou nouveau projet + `DATABASE_URL` |
| **Domaine** | DNS vers le projet Vercel du client |

Pour un **nouveau stack isolé** (recommandé pour handoff agent), suivre [HANDOFF.md](HANDOFF.md) plutôt que cette section.

## 8. Parcours utilisateur

1. Connexion (`/`) — email ou Google
2. `/auth/continue` — redirection selon profil
3. `/role-selection` — choix étudiant / tuteur
4. `/onboarding/...` — profil
5. `/dashboard/...` — utilisation

## 9. Script seed (démo uniquement)

`npm run db:seed` supprime les comptes tuteurs de démo (`seed_u*`). Ne pas exécuter en production client sauf besoin explicite de nettoyage.
