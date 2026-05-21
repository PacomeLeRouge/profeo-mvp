# ADR 001 — Contact e-mail hors plateforme

**Date** : 2026-05  
**Statut** : accepté

## Contexte

Le MVP doit permettre à un étudiant et un tuteur de convenir d'un créneau après un match, sans construire une messagerie intégrée.

## Décision

- Pas de chat in-app au MVP
- Partage de l'e-mail de connexion Clerk **uniquement** après acceptation d'une demande (`Confirmed`)
- Liens `mailto:` pré-remplis dans l'UI
- Notifications transactionnelles optionnelles via Resend (distinctes du contact direct)
- Information à l'inscription + consentement explicite (checkbox) à la fin de l'onboarding

## Conséquences

**Positives**

- Scope réduit, livraison plus rapide
- Les utilisateurs gardent leurs outils e-mail habituels

**Négatives**

- Pas de traçabilité des échanges dans Clutch
- Consentement non persisté en BDD (à date)
- Dépendance à la qualité des e-mails Clerk comme contact

## Alternatives envisagées

| Option | Rejet |
|--------|-------|
| Messagerie in-app | Trop lourd pour le MVP |
| Numéro de téléphone | Donnée plus sensible, pas demandée |
| E-mail masqué / relais | Complexité infra (alias, expiration) |
