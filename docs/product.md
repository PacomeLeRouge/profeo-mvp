# Produit Clutch

## Vision

Clutch met en relation des **étudiants** qui cherchent de l'aide et des **tuteurs** de leur établissement. La plateforme gère la découverte, les demandes et les notifications — pas la messagerie intégrée.

## Rôles

| Rôle | Objectif | Dashboard |
|------|----------|-----------|
| **Étudiant** | Trouver un tuteur, envoyer une demande de cours | `/dashboard/student` |
| **Tuteur** | Publier un profil, accepter ou refuser des demandes | `/dashboard/tutor` |

Un compte Clerk = un rôle (`users.role`). Le choix se fait sur `/role-selection` après la première connexion.

## Parcours complet

1. **Connexion** — `/` (email ou Google via Clerk)
2. **Inscription** — `/sign-up` + disclaimer informatif sur le partage d'e-mail
3. **Redirection** — `/auth/continue` selon l'état du profil
4. **Choix du rôle** — `/role-selection` si pas encore défini
5. **Onboarding** — profil étudiant (5 étapes) ou tuteur (8 étapes)
6. **Dashboard** — utilisation quotidienne

### Onboarding étudiant (5 étapes)

| # | Contenu |
|---|---------|
| 1 | Prénom + disclaimer e-mail |
| 2 | Âge (16–99) |
| 3 | Niveau d'études |
| 4 | Établissement (autocomplete universités européennes) |
| 5 | Matières recherchées + **consentement e-mail obligatoire** |

### Onboarding tuteur (8 étapes)

| # | Contenu |
|---|---------|
| 1 | Prénom + disclaimer e-mail |
| 2 | Âge (18–99) |
| 3 | Niveau d'études |
| 4 | Établissement |
| 5 | Matières enseignées |
| 6 | Tarif horaire (5–200 €) |
| 7 | Format (en ligne / présentiel / les deux) |
| 8 | Disponibilités (grille) + **consentement e-mail obligatoire** |

L'e-mail de contact = adresse Clerk du compte. Modification de profil : même parcours sans re-consentement.

## Dashboard étudiant

- **Stats** : nombre de tuteurs disponibles, demandes en attente
- **Découverte** : filtres matière, prix max, format
- **Cartes tuteurs** : prénom, matières, tarif, format, établissement
- **Demande de cours** : dialogue choix de matière → création en base
- **Mes demandes** : liste avec statut ; lien de contact si confirmé

## Dashboard tuteur

- **Stats** : demandes en attente, matières, tarif
- **Profil publié** : résumé visible aux étudiants
- **Demandes entrantes** : onglets En attente / Historique
  - En attente : Accepter / Refuser
  - Confirmé : lien mailto vers l'étudiant

## Demandes de cours

### Statuts

| Statut | Code | Étudiant | Tuteur |
|--------|------|----------|--------|
| En attente | `Pending` | Pas de contact | Boutons Accepter / Refuser |
| Confirmé | `Confirmed` | Mailto vers tuteur | Mailto vers étudiant |
| Refusé | `Declined` | Badge statut | Historique |

### Règles métier

- Seul un **étudiant avec profil complet** peut créer une demande
- La matière choisie doit être enseignée par le tuteur ciblé
- Les e-mails et noms sont **figés à la création** dans `lesson_requests`
- Le contact n'apparaît qu'après **acceptation** (`Confirmed`)

### Notifications (optionnelles)

Si `RESEND_API_KEY` est configuré :

- Nouvelle demande → e-mail au tuteur
- Acceptation / refus → e-mail à l'étudiant

Sans Resend, l'app fonctionne : demandes en base, pas d'e-mail transactionnel.

## Matières

Liste fixe dans `src/lib/subjects.ts` (10 matières, libellés FR via `subjectTranslations`).

## Contact hors plateforme

Clutch **ne héberge pas** de chat. Les parties s'échangent par e-mail via des liens `mailto:` pré-remplis (`ContactEmailLink`, `lesson-request-mailto.ts`).

Voir [legal/email-consent.md](legal/email-consent.md) pour le cadre consentement / information.

Page publique : [/legal](/legal) (`src/app/legal/page.tsx`, contenu `src/lib/legal/content.ts`).

## Previews développement

`/dev` et sous-routes : onboarding et dashboards sans auth ni BDD. Uniquement en `npm run dev`.
