/** Status badge styles — light + dark via Tailwind variants. */

export const requestStatusLabels: Record<string, string> = {
  Pending: "En attente",
  Confirmed: "Confirmé",
  Declined: "Refusé",
};

export const requestStatusClassName: Record<string, string> = {
  Pending:
    "border-primary/40 bg-primary/15 text-text-accent dark:border-primary/35 dark:bg-primary/12 dark:text-primary",
  Confirmed:
    "border-emerald-700/30 bg-emerald-700/10 text-emerald-900 dark:border-emerald-500/35 dark:bg-emerald-500/12 dark:text-emerald-300",
  Declined: "border-destructive/35 bg-destructive/12 text-destructive",
};
