---
name: clutch-legal
description: >-
  Clutch email contact compliance — disclaimers, explicit consent checkbox, off-platform
  messaging model, and where legal copy lives. Use when editing ContactEmailDisclaimer,
  ContactEmailConsent, sign-up copy, onboarding consent gates, or contact-after-match UI.
---

# Clutch — Contact e-mail & consentement

Use when touching **information utilisateur** or **consentement** around email sharing.

## Modèle produit

- Clutch **n'héberge pas** de messagerie
- L'e-mail de connexion Clerk sert de **contact**
- Partage **uniquement** quand une demande est `Confirmed`
- Échanges **hors plateforme** (mailto direct)

## Deux niveaux dans l'UI

| Niveau | Composant | Moment | Obligatoire |
|--------|-----------|--------|-------------|
| Information | `ContactEmailDisclaimer` | Sign-up, onboarding étape 1 | Non (lecture) |
| Consentement | `ContactEmailConsent` | Dernière étape onboarding | Oui (checkbox) |

**Pas de re-consentement** en édition de profil (`isEditing`).

## Variantes disclaimer

Fichier : `src/components/onboarding/ContactEmailDisclaimer.tsx`

- `signup` — `/sign-up` : mentionne confirmation à la fin de l'onboarding
- `student` — étape 1 onboarding étudiant
- `tutor` — étape 1 onboarding tuteur

## Consentement explicite

Fichier : `src/components/onboarding/ContactEmailConsent.tsx`

- Variantes `student` / `tutor` — libellés adaptés au rôle
- Rendu par `OnboardingShell` si `requireEmailConsent && isLastStep`
- `canContinue` sur dernière étape exige `emailConsentAccepted` si consentement requis
- Serveur : `saveStudentProfileAction` / `saveTutorProfileAction` enregistrent `users.emailContactConsentAt` + version à la **première** création de profil
- Constante version : `EMAIL_CONTACT_CONSENT_VERSION` dans `src/lib/legal/email-contact-consent.ts`

## Page publique `/legal`

- Route publique (middleware) — `src/app/legal/page.tsx`
- Contenu structuré : `src/lib/legal/content.ts`
- Liens depuis disclaimer, consent checkbox, `/`, `/sign-up`

## Contact après match

- `ContactEmailLink` — affiché seulement si `Confirmed`
- `lesson-request-mailto.ts` — sujet/corps pré-remplis
- E-mails snapshotés dans `lesson_requests` à la création

## Distinction Resend

Les **notifications** (nouvelle demande, changement statut) ≠ partage d'adresse entre users. Resend est optionnel ; le consentement porte sur le **partage d'e-mail avec l'autre partie**.

## Limites actuelles (MVP)

- Consentement persisté sur `users` (date + version `2026-05`)
- Page publique `/legal` — contenu dans `src/lib/legal/content.ts`
- Document interne : [docs/legal/email-consent.md](../../docs/legal/email-consent.md)

## Quand modifier quoi

| Changement | Fichiers |
|------------|----------|
| Texte informatif | `ContactEmailDisclaimer.tsx` |
| Texte consentement | `ContactEmailConsent.tsx` |
| Où / quand afficher | `OnboardingShell.tsx`, flows student/tutor, `sign-up/page.tsx` |
| Logique partage | `actions/requests.ts`, `ContactEmailLink.tsx` |

Ne pas affaiblir le gate consentement sans demande explicite produit/juridique.
