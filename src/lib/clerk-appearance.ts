/** Clerk appearance — dark variant for landing page */
export const clerkAppearanceDark = {
  variables: {
    colorBackground: "transparent",
    colorForeground: "#ffffff",
    colorMutedForeground: "rgba(255, 255, 255, 0.68)",
    colorPrimary: "#ffffff",
    colorPrimaryForeground: "#000000",
    colorInput: "transparent",
    colorInputForeground: "#ffffff",
    colorBorder: "rgba(255, 255, 255, 0.15)",
    colorRing: "rgba(255, 255, 255, 0.35)",
    colorDanger: "#f87171",
    borderRadius: "0",
    fontFamily: "inherit",
    fontFamilyButtons: "inherit",
  },
  elements: {
    rootBox: "w-full",
    cardBox: "w-full shadow-none",
    card: "bg-transparent shadow-none p-0 gap-6 w-full",
    header: "hidden",
    headerTitle: "hidden",
    headerSubtitle: "hidden",
    logoBox: "hidden",
    main: "gap-5",
    socialButtons: "flex flex-col gap-2.5 w-full",
    socialButtonsIconButton:
      "flex! h-12! w-full! justify-center! gap-3! rounded-full! border! border-white/15! bg-white/5! text-white! shadow-none! hover:bg-white/10!",
    socialButtonsBlockButton:
      "h-12! w-full! justify-center! gap-3! rounded-full! border! border-white/15! bg-white/5! text-white! shadow-none! hover:bg-white/10!",
    socialButtonsBlockButtonText: "text-sm! font-medium! text-white!",
    socialButtonsProviderIcon: "size-5! opacity-90!",
    dividerRow: "my-0 gap-3",
    dividerLine: "bg-white/12 flex-1",
    dividerText: "text-white/35 text-[11px] tracking-wider",
    form: "gap-4",
    formField: "gap-1",
    formFieldLabel: "text-[13px] font-medium text-white/50",
    formFieldInput:
      "border-0 border-b-2 border-white/15 bg-transparent shadow-none rounded-none px-0 py-0 focus:border-white focus:ring-0",
    formFieldInput__input:
      "h-14! bg-transparent! border-0! rounded-none! px-0! text-left! text-lg! font-medium! text-white! shadow-none! placeholder:text-white/22! focus:ring-0! focus:outline-none!",
    formButtonPrimary:
      "mt-1! h-12! w-full! rounded-full! bg-white! text-[15px]! font-semibold! text-black! shadow-none! hover:bg-white/90!",
    formButtonReset: "text-white/60 hover:text-white",
    footer: "hidden",
    footerAction: "hidden",
    footerActionLink: "text-white/60 hover:text-white",
    identityPreview: "border-white/15 bg-white/5 text-white",
    identityPreviewText: "text-white",
    identityPreviewEditButton: "text-white/70 hover:text-white",
    formFieldInputShowPasswordButton: "text-white/50 hover:text-white",
    alert: "border-white/15 bg-white/5 text-white",
    otpCodeFieldInput:
      "border-white/15 bg-transparent text-white focus:border-white",
    formResendCodeLink: "text-white/70 hover:text-white",
    backLink: "text-white/60 hover:text-white",
    backRow: "text-white/60",
  },
};

/** Clerk appearance — Vivid Noir light variant */
export const clerkAppearanceLight = {
  variables: {
    colorBackground: "transparent",
    colorForeground: "#1c1b1b",
    colorMutedForeground: "#54433b",
    colorPrimary: "#8f491e",
    colorPrimaryForeground: "#ffffff",
    colorInput: "transparent",
    colorInputForeground: "#1c1b1b",
    colorBorder: "#d9c2b7",
    colorRing: "#8f491e",
    colorDanger: "#ba1a1a",
    borderRadius: "0",
    fontFamily: "inherit",
    fontFamilyButtons: "inherit",
  },
  elements: {
    rootBox: "w-full",
    cardBox: "w-full shadow-none",
    card: "bg-transparent shadow-none p-0 gap-6 w-full",
    header: "hidden",
    headerTitle: "hidden",
    headerSubtitle: "hidden",
    logoBox: "hidden",
    main: "gap-5",
    socialButtons: "flex flex-col gap-2.5 w-full",
    socialButtonsIconButton:
      "flex! h-12! w-full! justify-center! gap-3! rounded-full! border! border-border! bg-muted/50! text-foreground! shadow-none! hover:bg-muted!",
    socialButtonsBlockButton:
      "h-12! w-full! justify-center! gap-3! rounded-full! border! border-border! bg-muted/50! text-foreground! shadow-none! hover:bg-muted!",
    socialButtonsBlockButtonText: "text-sm! font-medium! text-foreground!",
    socialButtonsProviderIcon: "size-5! opacity-90!",
    dividerRow: "my-0 gap-3",
    dividerLine: "bg-border flex-1",
    dividerText: "text-muted-foreground text-[11px] tracking-wider",
    form: "gap-4",
    formField: "gap-1",
    formFieldLabel: "text-[13px] font-medium text-muted-foreground",
    formFieldInput:
      "border-0 border-b-2 border-border bg-transparent shadow-none rounded-none px-0 py-0 focus:border-primary focus:ring-0",
    formFieldInput__input:
      "h-14! bg-transparent! border-0! rounded-none! px-0! text-left! text-lg! font-medium! text-foreground! shadow-none! placeholder:text-muted-foreground/50! focus:ring-0! focus:outline-none!",
    formButtonPrimary:
      "mt-1! h-12! w-full! rounded-full! bg-primary! text-[15px]! font-semibold! text-primary-foreground! shadow-none! hover:bg-primary/90!",
    formButtonReset: "text-muted-foreground hover:text-foreground",
    footer: "hidden",
    footerAction: "hidden",
    footerActionLink: "text-muted-foreground hover:text-foreground",
    identityPreview: "border-border bg-muted/50 text-foreground",
    identityPreviewText: "text-foreground",
    identityPreviewEditButton: "text-muted-foreground hover:text-foreground",
    formFieldInputShowPasswordButton: "text-muted-foreground hover:text-foreground",
    alert: "border-border bg-muted/50 text-foreground",
    otpCodeFieldInput:
      "border-border bg-transparent text-foreground focus:border-primary",
    formResendCodeLink: "text-muted-foreground hover:text-foreground",
    backLink: "text-muted-foreground hover:text-foreground",
    backRow: "text-muted-foreground",
  },
};

/** @deprecated Use clerkAppearanceDark or clerkAppearanceLight */
export const clerkAppearance = clerkAppearanceDark;
