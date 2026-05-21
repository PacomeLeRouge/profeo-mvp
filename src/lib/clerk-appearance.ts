const lime = "#CCFF00";
const sand = "#E8E2D6";

/** Clerk appearance — dark surfaces + lime CTA */
export const clerkAppearanceDark = {
  variables: {
    colorBackground: "transparent",
    colorForeground: sand,
    colorMutedForeground: "rgba(232, 226, 214, 0.55)",
    colorPrimary: lime,
    colorPrimaryForeground: "#000000",
    colorInput: "transparent",
    colorInputForeground: sand,
    colorBorder: "rgba(255, 255, 255, 0.12)",
    colorRing: "rgba(204, 255, 0, 0.45)",
    colorDanger: "#ff4d4d",
    borderRadius: "0",
    fontFamily: "inherit",
    fontFamilyButtons: "inherit",
  },
  elements: {
    rootBox: "w-full max-w-full mx-auto",
    cardBox: "w-full max-w-full mx-auto shadow-none",
    card: "bg-transparent shadow-none p-0 gap-6 w-full max-w-full mx-auto",
    header: "hidden",
    headerTitle: "hidden",
    headerSubtitle: "hidden",
    logoBox: "hidden",
    main: "gap-5 w-full max-w-full mx-auto flex flex-col items-stretch",
    socialButtons: "flex flex-col gap-2.5 w-full",
    socialButtonsIconButton:
      "flex! h-12! w-full! justify-center! gap-3! rounded-full! border! border-white/12! bg-white/[0.04]! text-white! shadow-none! hover:bg-white/[0.08]! hover:border-white/20!",
    socialButtonsBlockButton:
      "h-12! w-full! justify-center! gap-3! rounded-full! border! border-white/12! bg-white/[0.04]! text-white! shadow-none! hover:bg-white/[0.08]! hover:border-white/20!",
    socialButtonsBlockButtonText: "text-sm! font-medium! text-white!",
    socialButtonsProviderIcon: "size-5! opacity-90!",
    dividerRow: "my-0 gap-3",
    dividerLine: "bg-white/12 flex-1",
    dividerText: "text-white/35 text-[11px] tracking-wider",
    form: "gap-4 w-full max-w-full items-stretch text-center",
    formField: "gap-1 w-full max-w-full items-stretch text-center",
    formFieldRow: "w-full max-w-full items-stretch text-center",
    formFieldLabel: "text-[13px] font-medium text-white/50 text-center w-full",
    formFieldInput:
      "w-full border-0 border-b-2 border-white/15 bg-transparent shadow-none rounded-none px-0 py-0 focus:border-[#CCFF00] focus:ring-0",
    formFieldInput__input:
      "h-14! w-full! bg-transparent! border-0! rounded-none! px-0! text-center! text-lg! font-medium! text-[#E8E2D6]! shadow-none! placeholder:text-white/22! focus:ring-0! focus:outline-none!",
    formButtonPrimary:
      "mt-1! h-12! w-full! rounded-full! bg-[#CCFF00]! text-[15px]! font-semibold! text-black! shadow-none! hover:bg-[#CCFF00]/90!",
    formButtonReset: "text-white/60 hover:text-white",
    footer: "hidden",
    footerAction: "hidden",
    footerActionLink: "text-white/60 hover:text-[#CCFF00]",
    identityPreview: "border-white/15 bg-white/5 text-white",
    identityPreviewText: "text-white",
    identityPreviewEditButton: "text-white/70 hover:text-[#CCFF00]",
    formFieldInputShowPasswordButton: "text-white/50 hover:text-white",
    alert: "border-white/15 bg-white/5 text-white",
    otpCodeFieldInput:
      "border-white/15 bg-transparent text-white focus:border-[#CCFF00]",
    formResendCodeLink: "text-white/70 hover:text-[#CCFF00]",
    backLink: "text-white/60 hover:text-white",
    backRow: "text-white/60",
  },
};

/** Clerk appearance — bright sable panels (default app theme) */
export const clerkAppearanceLight = {
  variables: {
    colorBackground: "transparent",
    colorForeground: "#1a1a1a",
    colorMutedForeground: "#5c564e",
    colorPrimary: lime,
    colorPrimaryForeground: "#000000",
    colorInput: "transparent",
    colorInputForeground: "#1a1a1a",
    colorBorder: "#cfc6b8",
    colorRing: "rgba(158, 184, 0, 0.55)",
    colorDanger: "#dc2626",
    borderRadius: "0",
    fontFamily: "inherit",
    fontFamilyButtons: "inherit",
  },
  elements: {
    ...clerkAppearanceDark.elements,
    socialButtonsIconButton:
      "flex! h-12! w-full! justify-center! gap-3! rounded-full! border! border-border! bg-muted! text-foreground! shadow-none! hover:bg-accent!",
    socialButtonsBlockButton:
      "h-12! w-full! justify-center! gap-3! rounded-full! border! border-border! bg-muted! text-foreground! shadow-none! hover:bg-accent!",
    socialButtonsBlockButtonText: "text-sm! font-medium! text-foreground!",
    dividerLine: "bg-border flex-1",
    dividerText: "text-muted-foreground text-[11px] tracking-wider",
    formFieldLabel: "text-[13px] font-medium text-muted-foreground text-center w-full",
    formFieldInput:
      "w-full border-0 border-b-2 border-border bg-transparent shadow-none rounded-none px-0 py-0 focus:border-primary focus:ring-0",
    formFieldInput__input:
      "h-14! w-full! bg-transparent! border-0! rounded-none! px-0! text-center! text-lg! font-medium! text-foreground! shadow-none! placeholder:text-muted-foreground/50! focus:ring-0! focus:outline-none!",
    formButtonPrimary:
      "mt-1! h-12! w-full! rounded-full! bg-primary! text-[15px]! font-semibold! text-primary-foreground! shadow-none! hover:bg-primary/90!",
    formButtonReset: "text-muted-foreground hover:text-foreground",
    footerActionLink: "text-muted-foreground hover:text-[#4A5A00]",
    identityPreview: "border-border bg-muted text-foreground",
    identityPreviewText: "text-foreground",
    identityPreviewEditButton: "text-muted-foreground hover:text-[#4A5A00]",
    formFieldInputShowPasswordButton: "text-muted-foreground hover:text-foreground",
    alert: "border-border bg-muted text-foreground",
    otpCodeFieldInput: "border-border bg-transparent text-foreground focus:border-primary",
    formResendCodeLink: "text-muted-foreground hover:text-[#4A5A00]",
    backLink: "text-muted-foreground hover:text-foreground",
    backRow: "text-muted-foreground",
  },
};

/** @deprecated Use clerkAppearanceDark or clerkAppearanceLight */
export const clerkAppearance = clerkAppearanceDark;
