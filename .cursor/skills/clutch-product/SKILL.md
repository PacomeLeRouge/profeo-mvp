---
name: clutch-product
description: >-
  Clutch product domain — user roles, onboarding steps, dashboards, lesson request
  lifecycle, tutor discovery, and off-platform email contact. Use when implementing or
  changing business logic, user flows, server actions for profiles/requests, or
  dashboard behavior in Clutch.
---

# Clutch — Produit

Read this skill for **logique métier** and user flows. For UI tokens, use `clutch-design-system`. For consent/legal copy, use `clutch-legal`.

## Rôles

- **student** — cherche de l'aide, envoie des demandes
- **tutor** — profil public, reçoit et traite des demandes

Un compte = un rôle (`users.role`). Choix sur `/role-selection` via `setUserRole`.

## Redirection post-auth

`src/lib/auth.ts` → `getOnboardingRedirectPath()` :

| État | Destination |
|------|-------------|
| Pas de rôle | `/role-selection` |
| Student sans profil | `/onboarding/student` |
| Student avec profil | `/dashboard/student` |
| Tutor sans profil | `/onboarding/tutor` |
| Tutor avec profil | `/dashboard/tutor` |

## Onboarding

### Étudiant — 5 étapes (`StudentOnboardingFlow.tsx`)

1. Prénom + disclaimer e-mail
2. Âge 16–99
3. Niveau d'études
4. Établissement
5. Matières (multi) + **consentement e-mail** (dernière étape, pas en édition)

Submit → `saveStudentProfileAction` → `/dashboard/student`. Contact = e-mail Clerk.

### Tuteur — 8 étapes (`TutorOnboardingFlow.tsx`)

1. Prénom + disclaimer
2. Âge 18–99
3. Niveau
4. Établissement
5. Matières enseignées
6. Tarif 5–200 €
7. Format (Online / In-person / Both)
8. Disponibilités + **consentement e-mail**

Bio par défaut côté serveur si absent. Submit label : « Publier mon profil ».

## Demandes de cours

### Statuts (`request_status`)

| Code | UI FR | Contact visible |
|------|-------|-----------------|
| `Pending` | En attente | Non |
| `Confirmed` | Confirmé | Oui (mailto) |
| `Declined` | Refusé | Non |

### Règles

- Création : étudiant authentifié + profil complet + matière enseignée par le tuteur
- Snapshot à la création : noms + e-mails dans `lesson_requests`
- Mise à jour statut : tuteur propriétaire uniquement
- Contact UI : `ContactEmailLink` + `lesson-request-mailto.ts`

### Server actions

- `createLessonRequestAction` — `src/app/actions/requests.ts`
- `updateLessonRequestStatusAction` — idem
- Notifications async : `src/lib/email/lesson-requests.ts` (Resend optionnel)

## Dashboards

### Étudiant (`StudentDashboardView.tsx`)

- Filtres : matière, prix max, format
- `TutorCard` + `RequestDialog` → création demande
- `RequestList` — statuts + mailto si confirmé

### Tuteur (`TutorDashboardView.tsx`)

- Profil publié résumé
- Onglets demandes Pending / History
- Accepter / Refuser → `updateLessonRequestStatusAction`

Data loading : `src/lib/data/dashboard.ts`, pages `src/app/dashboard/*/page.tsx`.

## Matières

Source unique : `src/lib/subjects.ts` — ne pas dupliquer la liste ailleurs.

## Dev previews

`/dev/*` — `isDevPreviewEnabled()` = dev only. Mock store : `src/lib/store/` (pas en prod).

## Docs humaines

- [docs/product.md](../../docs/product.md)
- [docs/architecture.md](../../docs/architecture.md)
