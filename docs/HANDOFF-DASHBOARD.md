# Handoff client — parcours dashboards (sans MCP Vercel)

Guide pour un **client non technique** qui configure Clutch via les interfaces web uniquement.

L’agent Antigravity / Cursor n’a **pas besoin du MCP Vercel**. Le client crée les comptes et colle les clés dans Vercel ; l’agent exécute ensuite **quelques commandes terminal minimales** (schéma base de données + vérifications).

Pour le parcours agent avec CLI Vercel, voir [HANDOFF.md](HANDOFF.md).

---

## Ce que le client fait (dashboards)

### Comptes à créer

1. [Vercel](https://vercel.com)
2. [Clerk](https://dashboard.clerk.com)
3. [Neon](https://console.neon.tech)
4. [Resend](https://resend.com) — optionnel (e-mails de demandes de cours)

---

### Étape 1 — Importer le code sur Vercel

1. Vercel → **Add New…** → **Project**
2. Importer le repo GitHub Clutch
3. Créer un **nouveau projet** sur l’équipe du client (ne pas réutiliser un projet d’un autre compte)
4. Framework : **Next.js** (détecté automatiquement)
5. **Ne pas déployer tout de suite** — configurer d’abord les variables (étape 4)

---

### Étape 2 — Clerk (authentification)

1. Clerk → **Create application**
2. Noter :
   - **Publishable key** → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - **Secret key** → `CLERK_SECRET_KEY`
3. **Configure** → **Paths** :
   - Sign-in URL : `/`
   - Sign-up URL : `/sign-up`
4. **User & Authentication** → **Social** : activer **Google** si souhaité

Le webhook Clerk se configure **après** le premier déploiement (étape 6).

---

### Étape 3 — Neon (base de données)

1. Neon → **New Project**
2. Ouvrir **Connection details**
3. Copier la connection string **PostgreSQL** → `DATABASE_URL`

Conserver cette URL : elle servira aussi pour l’étape agent (schéma).

---

### Étape 4 — Variables sur Vercel

Vercel → projet → **Settings** → **Environment Variables**

Ajouter pour **Production** et **Preview** :

| Variable | Valeur |
|----------|--------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Depuis Clerk |
| `CLERK_SECRET_KEY` | Depuis Clerk |
| `DATABASE_URL` | Depuis Neon |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `/sign-up` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | `/auth/continue` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | `/auth/continue` |

**Après le premier déploiement**, ajouter aussi :

| Variable | Valeur |
|----------|--------|
| `NEXT_PUBLIC_APP_URL` | `https://votre-projet.vercel.app` (ou domaine custom) |
| `CLERK_WEBHOOK_SECRET` | Depuis Clerk (étape 6) |

**Optionnel — e-mails** :

| Variable | Valeur |
|----------|--------|
| `RESEND_API_KEY` | Depuis Resend |
| `EMAIL_FROM` | Ex. `Clutch <onboarding@resend.dev>` en test |

Référence complète : [`.env.example`](../.env.example)

---

### Étape 5 — Premier déploiement

1. Vercel → **Deployments** → **Redeploy** (ou push sur la branche `main`)
2. Noter l’URL de production : `https://<votre-projet>.vercel.app`

---

### Étape 6 — Webhook Clerk (obligatoire)

Sans webhook, les utilisateurs ne sont pas synchronisés en base après connexion.

1. Clerk → **Webhooks** → **Add Endpoint**
2. URL : `https://<votre-domaine>/api/webhooks/clerk`
3. Événements : `user.created`, `user.updated`, `user.deleted`
4. Copier le **Signing Secret** → `CLERK_WEBHOOK_SECRET` sur Vercel
5. Redéployer le projet Vercel

---

### Étape 7 — Resend (optionnel)

1. Resend → créer une clé API
2. Ajouter `RESEND_API_KEY` et `EMAIL_FROM` sur Vercel
3. Redéployer

Sans Resend, l’app fonctionne : les demandes de cours sont enregistrées, seuls les e-mails automatiques sont absents.

---

### Étape 8 — Test manuel (client)

1. Ouvrir `https://<votre-domaine>/`
2. Se connecter (e-mail ou Google)
3. Choisir **étudiant** ou **tuteur**
4. Compléter l’onboarding
5. Arriver sur le dashboard

Si la connexion fonctionne mais le profil ne se crée pas → revoir l’étape 6 (webhook).

---

## Ce que l’agent fait ensuite (terminal minimal, sans MCP)

Le client a terminé les dashboards. L’agent ouvre le repo cloné et exécute :

```bash
npm install
```

Créer `.env.local` en recopiant les mêmes variables que sur Vercel (Settings → Environment Variables).  
**Ne jamais coller les secrets dans le chat.**

Puis :

```bash
npm run bootstrap:check
npm run db:push
npm run build
npm run test:smoke
```

`db:push` applique le schéma Drizzle sur Neon — **indispensable**, non faisable depuis un dashboard seul.

---

## Prompt Antigravity (sans MCP Vercel)

Le client peut coller ceci :

```text
Bootstrap Clutch en mode dashboards uniquement (pas de MCP Vercel).

Le client a déjà :
- importé le repo sur Vercel
- configuré Clerk, Neon et les variables sur Vercel
- déployé une première fois
- (idéalement) configuré le webhook Clerk

Suis docs/HANDOFF-DASHBOARD.md :
1. Vérifie que je t’ai bien listé quelles variables sont déjà sur Vercel (sans les valeurs)
2. Aide-moi à créer .env.local localement si besoin
3. Exécute npm install, bootstrap:check, db:push, build, test:smoke
4. Dis-moi ce qui manque encore côté dashboards (webhook, NEXT_PUBLIC_APP_URL, Resend)

Ne jamais afficher les secrets. Ne pas lancer db:seed en production.
```

---

## Prompt client non technique (sans agent)

Si le client préfère déléguer à un prestataire / agent :

> « Le repo Clutch est sur GitHub. J’ai créé les comptes Vercel, Clerk et Neon. Peux-tu finir le setup en suivant `docs/HANDOFF-DASHBOARD.md` ? Les clés sont déjà dans Vercel. Il reste à appliquer le schéma base de données et vérifier que connexion + onboarding fonctionnent. »

---

## Dépannage rapide

| Problème | Où regarder |
|----------|-------------|
| Site en erreur au déploiement | Vercel → Deployments → logs |
| Connexion OK, pas de profil | Webhook Clerk + `CLERK_WEBHOOK_SECRET` |
| Pas d’e-mails | Normal sans Resend ; vérifier `RESEND_API_KEY` + `EMAIL_FROM` |
| Variables manquantes | Vercel → Settings → Environment Variables, puis redeploy |

---

## Comparaison des parcours

| | [HANDOFF.md](HANDOFF.md) | Ce guide |
|--|--------------------------|----------|
| MCP Vercel | Optionnel | Non requis |
| Vercel CLI | Recommandé | Non requis |
| Dashboards | Partiel | **Principal** |
| Commandes agent | Complètes | Minimales (`db:push` + vérifs) |
