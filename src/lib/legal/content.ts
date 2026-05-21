import { EMAIL_CONTACT_CONSENT_VERSION } from "@/lib/legal/email-contact-consent";

export const legalPageMeta = {
  title: "Informations légales",
  subtitle: "Transparence sur l'utilisation de vos données et le contact par e-mail sur Clutch.",
  version: EMAIL_CONTACT_CONSENT_VERSION,
  updatedAt: "19 mai 2026",
} as const;

export type LegalSection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export const legalSections: LegalSection[] = [
  {
    id: "presentation",
    title: "Présentation",
    paragraphs: [
      "Clutch est une plateforme de tutorat entre étudiants. Elle permet de découvrir des tuteurs, d'envoyer des demandes de cours et de convenir d'un créneau avec l'autre partie.",
      "Clutch ne propose pas de messagerie intégrée : une fois une demande acceptée, les échanges se font directement par e-mail, en dehors de la plateforme.",
    ],
  },
  {
    id: "donnees",
    title: "Données utilisées",
    paragraphs: [
      "Pour créer votre compte et votre profil, Clutch utilise notamment :",
    ],
    bullets: [
      "Votre adresse e-mail de connexion (via Clerk)",
      "Votre prénom et les informations de profil que vous renseignez (âge, établissement, matières, disponibilités, tarif le cas échéant)",
      "L'historique de vos demandes de cours et leur statut",
    ],
  },
  {
    id: "partage-email",
    title: "Partage de votre e-mail",
    paragraphs: [
      "Votre adresse e-mail de connexion sert d'e-mail de contact. Elle n'est transmise à l'autre partie que lorsqu'une demande de cours est acceptée (statut « Confirmé »).",
      "À ce moment, l'étudiant et le tuteur peuvent s'écrire directement par e-mail pour organiser leurs séances. Clutch ne lit ni n'héberge ces échanges.",
      "Les adresses et noms affichés dans une demande confirmée sont ceux enregistrés au moment de la création de la demande.",
    ],
  },
  {
    id: "consentement",
    title: "Consentement",
    paragraphs: [
      "Lors de votre première inscription sur Clutch, nous vous informons du possible partage de votre e-mail dès l'inscription et au début de l'onboarding.",
      "Avant de publier votre profil, vous devez cocher une case confirmant explicitement que vous acceptez ce partage lorsqu'une demande est acceptée.",
      "Ce consentement est enregistré avec la date et la version du texte affiché. Il n'est pas redemandé lors d'une simple modification de profil.",
    ],
  },
  {
    id: "notifications",
    title: "E-mails de notification",
    paragraphs: [
      "Clutch peut vous envoyer des e-mails transactionnels (nouvelle demande, acceptation ou refus). Ces messages sont distincts du partage de votre adresse avec l'autre partie.",
      "Si le service d'envoi n'est pas configuré, les demandes restent disponibles dans votre tableau de bord sans notification par e-mail.",
    ],
  },
  {
    id: "droits",
    title: "Vos droits",
    paragraphs: [
      "Vous pouvez modifier votre profil depuis votre tableau de bord. Pour toute question sur vos données ou pour exercer vos droits (accès, rectification, suppression), contactez l'équipe Clutch ou l'administrateur de votre établissement partenaire.",
      "Ce document est une information produit du MVP Clutch. Il ne remplace pas une politique de confidentialité complète ni un avis juridique.",
    ],
  },
];
