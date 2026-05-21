# Contact e-mail — information et consentement

Document interne décrivant le comportement actuel du MVP. **Ne remplace pas un avis juridique.**

## Principe produit

Clutch ne fournit pas de messagerie in-app. Quand une demande de cours est **acceptée**, les deux parties peuvent se contacter **directement par e-mail**, en dehors de la plateforme.

## Données concernées

| Donnée | Source | Quand partagée |
|--------|--------|----------------|
| E-mail de connexion Clerk | Compte utilisateur | Après acceptation d'une demande (`Confirmed`) |
| Prénom | Profil / Clerk | Visible sur profils et demandes |
| E-mail snapshot | `lesson_requests` | Figé à la création de la demande |

Champs BDD : `users.emailContactConsentAt`, `users.emailContactConsentVersion`, plus les e-mails snapshot dans `lesson_requests`.

Résolution : `src/lib/contact-email.ts` — fallback sur l'e-mail Clerk si non renseigné.

## Parcours utilisateur (implémentation)

### 1. Inscription (`/sign-up`)

Composant : `ContactEmailDisclaimer` (variante `signup`).

- **Type** : information uniquement
- **Contenu** : explique le partage possible après acceptation ; précise que la confirmation interviendra à la fin de l'onboarding

### 2. Onboarding — étape 1

Composant : `ContactEmailDisclaimer` (variante `student` ou `tutor`).

- **Type** : information
- **Non affiché** en mode édition de profil (`isEditing`)

### 3. Onboarding — dernière étape

Composant : `ContactEmailConsent` (case à cocher obligatoire).

- **Type** : consentement explicite
- **Bloquant** : le bouton « Terminer » / « Publier mon profil » reste désactivé sans coche
- **Persisté** : `users.email_contact_consent_at` + `users.email_contact_consent_version` (`2026-05`) à la première création de profil
- **Non requis** en modification de profil, ni si le consentement est déjà enregistré (retry onboarding)

Fichiers : `ContactEmailConsent.tsx`, intégration dans `OnboardingShell.tsx`, logique dans `StudentOnboardingFlow.tsx` / `TutorOnboardingFlow.tsx`.

## Contact après match

- UI : `ContactEmailLink` → liens `mailto:` avec sujet/corps pré-remplis
- Helpers : `src/lib/lesson-request-mailto.ts`
- Visible uniquement si statut `Confirmed`

## E-mails transactionnels (Resend)

Notifications **distinctes** du partage d'adresse entre utilisateurs :

- Nouvelle demande → tuteur
- Changement de statut → étudiant

Config : `src/lib/email/`. Optionnel — l'app fonctionne sans.

## Page publique

- URL : `/legal` (accessible sans connexion)
- Contenu : `src/lib/legal/content.ts`
- Liens depuis sign-up, connexion, disclaimer et checkbox de consentement

## Évolutions possibles

| Amélioration | Intérêt |
|--------------|---------|
| ~~Horodatage du consentement en BDD~~ | ✅ Fait (`users.emailContactConsentAt`) |
| Politique de confidentialité / CGU dédiées | Cadre légal complet |
| Retrait du consentement | Droit de l'utilisateur |
| ~~Page `/legal` publique~~ | ✅ Fait |

## Fichiers de référence

```
src/components/onboarding/ContactEmailDisclaimer.tsx
src/components/onboarding/ContactEmailConsent.tsx
src/components/onboarding/OnboardingShell.tsx
src/components/dashboard/ContactEmailLink.tsx
src/lib/contact-email.ts
src/lib/legal/content.ts
src/lib/legal/email-contact-consent.ts
src/app/legal/page.tsx
src/app/actions/profiles.ts
src/lib/lesson-request-mailto.ts
src/app/actions/requests.ts
```
