---
name: clutch-bootstrap
description: Bootstrap a fresh Clutch deployment on Vercel with Clerk and Neon. Use when setting up the project for a new client, handoff, first deploy, vercel link, env pull, or "mettre en place le projet".
---

# Clutch Bootstrap

Orchestrates a **fresh stack** deployment for the Clutch MVP. Read [docs/HANDOFF.md](../../docs/HANDOFF.md) first.

Also follow the Vercel **bootstrap** skill patterns (link → env → db → dev). Do not run `db:push` or `dev` until Vercel linking and required env keys are verified.

## Rules

- Never link to or reference the original developer project (`profeo-mvp` or similar).
- Never echo secret values in terminal output, logs, or chat summaries.
- Use `npm run db:push` (not `db:migrate`) unless migrations are explicitly required.
- Do not run `npm run db:seed` for client production — seed removes demo tutors only.
- Prefer Vercel Marketplace integrations over manual provider setup.

## Preflight

```bash
vercel --version
vercel whoami
node -v   # expect 20+
npm install
```

Confirm `.env.example` exists at repo root. If `.env.local` is missing, pull from Vercel after linking.

## Bootstrap order (strict)

### 1. Link Vercel project

```bash
vercel link
# Team: client's team
# Project: create NEW project (e.g. clutch-mvp)
```

Verify `.vercel/project.json` exists locally.

### 2. Marketplace integrations

```bash
vercel integration add clerk --scope <team>
vercel integration add neon --scope <team>
```

Fallback: provision Clerk + Neon manually, add env vars on Vercel dashboard.

### 3. Pull environment

```bash
vercel env pull .env.local --yes
npm run bootstrap:check
```

Fix missing keys on Vercel, re-pull, re-check until required keys pass.

### Required keys

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `CLERK_WEBHOOK_SECRET` (after Clerk webhook created — can bootstrap DB first, webhook before prod go-live)
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL` = `/`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL` = `/sign-up`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` = `/auth/continue`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` = `/auth/continue`
- `DATABASE_URL`

### Recommended (production)

- `NEXT_PUBLIC_APP_URL` = `https://<production-domain>`

### Optional

- `RESEND_API_KEY`, `EMAIL_FROM` — app works without e-mail notifications

### 4. Database schema

```bash
npm run db:push
```

### 5. Deploy

```bash
vercel deploy --prod
# or: git push main (if Git integration connected)
```

Note production URL: `https://<project>.vercel.app`

### 6. Post-deploy (mandatory)

1. Clerk webhook → `https://<domain>/api/webhooks/clerk`  
   Events: `user.created`, `user.updated`, `user.deleted`
2. Set `CLERK_WEBHOOK_SECRET` on Vercel → `vercel env pull` → redeploy if needed
3. Set `NEXT_PUBLIC_APP_URL` on Vercel (Production)
4. Clerk paths: sign-in `/`, sign-up `/sign-up`
5. Optional: Resend keys for transactional e-mails

### 7. Verify

```bash
npm run bootstrap:check
npm run build
npm run test:smoke
```

Manual smoke: `/` → sign-in → `/auth/continue` → role selection → onboarding → dashboard.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| CSS build error mentioning `package.json` JSON parse | Kill dev server, `rm -rf .next`, restart `npm run dev` |
| `bootstrap:check` fails | `vercel env pull .env.local --yes`, add missing keys on Vercel |
| Users not in Neon after sign-up | Clerk webhook URL + `CLERK_WEBHOOK_SECRET` |

## Bootstrap Result (report format)

```md
## Bootstrap Result
- **Linked Project**: <team>/<project>
- **Resource Path**: vercel-integration | manual
- **Env Keys**: <required present>/<required total> required, <recommended present>/<recommended total> recommended
- **Migration Status**: success | failed (<step>)
- **Deploy URL**: https://<domain>
- **Webhook Clerk**: configured | pending
- **Dev Result**: not-run | started | failed
```

## Related docs

- [docs/HANDOFF.md](../../docs/HANDOFF.md) — client checklist (French)
- [docs/DEPLOY.md](../../docs/DEPLOY.md) — detailed Clerk / Neon / Resend setup
- [.env.example](../../.env.example) — env template
