"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import {
  applyThemeToDocument,
  isThemeToggleRoute,
  resolveThemeForRoute,
  THEME_STORAGE_KEY,
  type Theme,
} from "@/lib/theme";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  canToggleTheme: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStoredTheme(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(THEME_STORAGE_KEY);
}

/** Remounts when the route changes so theme resets without syncing in an effect. */
function ThemeProviderScope({
  pathname,
  children,
}: {
  pathname: string;
  children: ReactNode;
}) {
  const [theme, setThemeState] = useState<Theme>(() =>
    resolveThemeForRoute(pathname, readStoredTheme())
  );
  const canToggleTheme = isThemeToggleRoute(pathname);

  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  const setTheme = useCallback(
    (next: Theme) => {
      if (!isThemeToggleRoute(pathname)) return;
      setThemeState(next);
      applyThemeToDocument(next);
    },
    [pathname]
  );

  const toggleTheme = useCallback(() => {
    if (!isThemeToggleRoute(pathname)) return;
    setThemeState((current) => {
      const next: Theme = current === "dark" ? "light" : "dark";
      applyThemeToDocument(next);
      return next;
    });
  }, [pathname]);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme,
      canToggleTheme,
    }),
    [theme, setTheme, toggleTheme, canToggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <ThemeProviderScope key={pathname} pathname={pathname}>
      {children}
    </ThemeProviderScope>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
