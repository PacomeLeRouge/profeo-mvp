export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "clutch-theme";
export const DEFAULT_THEME: Theme = "light";

export function isTheme(value: string | null): value is Theme {
  return value === "light" || value === "dark";
}
