# Documentation Clutch

Index de la knowledge base **équipe**. Pour l'agent Cursor, voir [AGENTS.md](../AGENTS.md) à la racine.

## Guides

| Fichier | Description |
|---------|-------------|
| [product.md](product.md) | Parcours utilisateur, rôles, dashboards, demandes |
| [architecture.md](architecture.md) | Stack, auth Clerk, schéma BDD, server actions |
| [DEPLOY.md](DEPLOY.md) | Installation locale, Vercel, variables d'env |

## Légal & décisions

| Fichier | Description |
|---------|-------------|
| [legal/email-consent.md](legal/email-consent.md) | Disclaimer, consentement, contact hors plateforme |
| [/legal](../src/app/legal/page.tsx) | Page publique (route `/legal`) |
| [decisions/001-off-platform-email-contact.md](decisions/001-off-platform-email-contact.md) | ADR — choix e-mail vs messagerie in-app |

## Agent Cursor

| Emplacement | Rôle |
|-------------|------|
| [AGENTS.md](../AGENTS.md) | Point d'entrée agent |
| [../.cursor/skills/](../.cursor/skills/) | Skills thématiques |
| [../.cursor/rules/](../.cursor/rules/) | Règles automatiques |

### Skills disponibles

- `clutch-design-system` — UI, tokens, composants
- `clutch-product` — logique métier, flows
- `clutch-legal` — consentement e-mail
