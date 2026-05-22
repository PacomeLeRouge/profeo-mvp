# Clutch — handoff rapide (Antigravity / Cursor)

**Objectif** : déployer un stack neuf (Vercel + Clerk + Neon) après clone GitHub.

## Ordre

1. `npm install`
2. `vercel link` → **nouveau** projet client
3. `vercel integration add clerk` + `vercel integration add neon`
4. `vercel env pull .env.local --yes`
5. `npm run bootstrap:check`
6. `npm run db:push`
7. `vercel deploy --prod` ou push `main`
8. Webhook Clerk → `https://<domaine>/api/webhooks/clerk` + `CLERK_WEBHOOK_SECRET`
9. `NEXT_PUBLIC_APP_URL` sur Vercel
10. `npm run build` + `npm run test:smoke`

## Docs complètes

- [docs/HANDOFF.md](../docs/HANDOFF.md)
- [.cursor/skills/clutch-bootstrap/SKILL.md](../.cursor/skills/clutch-bootstrap/SKILL.md)
- [docs/DEPLOY.md](../docs/DEPLOY.md)

## Interdit

- Lier un projet Vercel d'un autre compte
- Afficher les secrets
- `db:seed` en production client
