import { frFR } from "@clerk/localizations";

/** Français Clutch — libellés alignés sur le tutorat entre étudiants */
export const clutchFrFR = {
  ...frFR,
  formButtonPrimary: "Se connecter",
  formFieldLabel__emailAddress: "Adresse e-mail",
  formFieldLabel__password: "Mot de passe",
  formFieldInputPlaceholder__emailAddress: "nom@universite.be",
  formFieldInputPlaceholder__password: "Votre mot de passe",
  dividerText: "ou",
  socialButtonsBlockButton: "Continuer avec {{provider|titleize}}",
} as typeof frFR;
