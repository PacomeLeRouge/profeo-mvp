import { DEFAULT_THEME, THEME_STORAGE_KEY } from "@/lib/theme";

/** Runs before paint to avoid theme flash. */
export function ThemeScript() {
  const script = `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var t=localStorage.getItem(k);var dark=t?t==='dark':${DEFAULT_THEME === "dark"};document.documentElement.classList.toggle('dark',dark);document.body.classList.toggle('app-surface',!dark);}catch(e){document.body.classList.add('app-surface');}})();`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
