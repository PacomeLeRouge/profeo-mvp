import { AUTH_THEME, THEME_STORAGE_KEY } from "@/lib/theme";

/** Runs before paint to avoid theme flash. */
export function ThemeScript() {
  const script = `(function(){
    try {
      var k=${JSON.stringify(THEME_STORAGE_KEY)};
      var p=location.pathname;
      var authDark=p==='/'||p.indexOf('/sign-up')===0||p.indexOf('/signup')===0;
      var alwaysLight=p==='/role-selection';
      var appLight=p.indexOf('/onboarding')===0||p.indexOf('/dashboard')===0;
      var stored=localStorage.getItem(k);
      var dark=authDark?true:(alwaysLight?false:(appLight?stored==='dark':stored==='dark'));
      document.documentElement.classList.toggle('dark',dark);
      document.body.classList.toggle('app-surface',!dark);
    } catch(e) {
      document.documentElement.classList.toggle('dark',${AUTH_THEME === "dark"});
    }
  })();`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
