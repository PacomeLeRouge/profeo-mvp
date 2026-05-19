# Déploiement Clutch (Vercel + Clerk + Neon)

## 1. Comptes à créer (votre compte pour le MVP)

1. [Vercel](https://vercel.com) — hébergement Next.js
2. [Clerk](https://clerk.com) — authentification
3. [Neon](https://neon.tech) — base Postgres

Ou installez Clerk et Neon depuis le **Vercel Marketplace** sur votre projet (`vercel integration add clerk` / `neon`).

## 2. Clerk — configuration

1. Créez une application Clerk.
2. **Social connections** (Dashboard → User & Authentication → Social):
   - Activez **Google**
   - Activez **Microsoft**
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

1. Créez un projet Neon (région proche de vos utilisateurs).
2. Copiez `DATABASE_URL` dans `.env.local`.
3. Appliquez le schéma :

```bash
cp .env.example .env.local
# Remplissez DATABASE_URL
npm run db:push
npm run db:seed   # tuteurs de démo (optionnel)
```

## 4. Lancer en local

```bash
npm install
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

## 5. Déployer sur Vercel

```bash
vercel link
vercel env pull .env.local   # après avoir ajouté les variables sur Vercel
git push
```

Ou connectez le dépôt GitHub dans le dashboard Vercel.

Variables d'environnement à définir sur Vercel (Production + Preview) :

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `CLERK_WEBHOOK_SECRET`
- `DATABASE_URL`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL` = `/`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL` = `/sign-up`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` = `/auth/continue`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` = `/auth/continue`

Après le premier déploiement, mettez à jour l’URL du webhook Clerk avec le domaine de production.

## 6. Transfert au client (handoff)

| Ressource | Action |
|-----------|--------|
| **Code** | Transférer le repo GitHub ou donner accès à l’organisation du client |
| **Vercel** | *Transfer Project* vers l’équipe du client, ou nouveau projet + même repo |
| **Clerk** | Transférer l’application ou créer une nouvelle app + nouvelles clés |
| **Neon** | Export/import SQL ou nouveau projet + `DATABASE_URL` |
| **Domaine** | DNS vers le projet Vercel du client |

Le client recrée les intégrations Marketplace, copie `.env.example`, exécute `vercel env pull` et `npm run db:push`.

## 7. Parcours utilisateur

1. Connexion (`/`) — email, Google ou Microsoft
2. `/auth/continue` — redirection selon profil
3. `/role-selection` — choix étudiant / tuteur
4. `/onboarding/...` — profil
5. `/dashboard/...` — utilisation
