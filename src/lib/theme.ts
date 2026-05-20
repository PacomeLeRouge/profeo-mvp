export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "clutch-theme";
/** Thème par défaut onboarding + dashboard (bright / sable). */
export const APP_THEME: Theme = "light";
/** Thème page d'accueil et auth d'entrée (Neon Noir). */
export const AUTH_THEME: Theme = "dark";

export function isTheme(value: string | null): value is Theme {
  return value === "light" || value === "dark";
}

/** Routes toujours en dark, sans toggle. */
export function isAuthDarkRoute(pathname: string): boolean {
  return (
    pathname === "/" ||
    pathname.startsWith("/sign-up") ||
    pathname.startsWith("/signup")
  );
}

/** Parcours post-inscription : toujours thème clair par défaut. */
export function isAppLightRoute(pathname: string): boolean {
  return (
    pathname === "/role-selection" ||
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/dashboard")
  );
}

/** Routes où l'utilisateur peut basculer clair / sombre. */
export function isThemeToggleRoute(pathname: string): boolean {
  return isAppLightRoute(pathname);
}

export function resolveThemeForRoute(pathname: string, stored: string | null): Theme {
  if (isAuthDarkRoute(pathname)) return AUTH_THEME;
  if (pathname === "/role-selection") return APP_THEME;
  if (isAppLightRoute(pathname) && isTheme(stored)) return stored;
  if (isAppLightRoute(pathname)) return APP_THEME;
  return APP_THEME;
}

export function applyThemeToDocument(theme: Theme) {
  const isDark = theme === "dark";
  document.documentElement.classList.toggle("dark", isDark);
  document.body.classList.toggle("app-surface", !isDark);
  if (!isAuthDarkRoute(window.location.pathname)) {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }
}
