"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { GraduationCap, LogOut, UserRound } from "lucide-react";
import { useAppData } from "@/hooks/use-app-data";
import { RoleBadge } from "@/components/dashboard/RoleBadge";
import { SwitchRoleLink } from "@/components/dashboard/SwitchRoleLink";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import type { AppRole } from "@/lib/role-ui";

export function Navbar() {
  const { user: clerkUser, isLoaded } = useUser();
  const { signOut } = useClerk();
  const { user } = useAppData();
  const router = useRouter();
  const pathname = usePathname();
  const isEntryFlow =
    pathname === "/" ||
    pathname.startsWith("/sign-up") ||
    pathname === "/role-selection" ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/dev");

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  if (!isLoaded || !clerkUser || isEntryFlow) return null;

  const role = user?.role as AppRole | undefined;
  const isDashboard = pathname.startsWith("/dashboard");
  const profileHref = role ? `/onboarding/${role}` : "/role-selection";

  return (
    <nav className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-14 items-center justify-between gap-3 py-2 sm:min-h-16 sm:py-0">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              className="flex min-w-0 cursor-pointer items-center gap-3"
              onClick={() => {
                if (role) router.push(`/dashboard/${role}`);
              }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="font-display block text-2xl font-bold leading-none text-foreground">
                Clutch
              </span>
            </button>
            {isDashboard && role ? <RoleBadge role={role} size="sm" className="hidden sm:inline-flex" /> : null}
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            {isDashboard ? <ThemeToggle className="size-9 px-0" /> : null}
            {isDashboard && role ? (
              <>
                <SwitchRoleLink currentRole={role} variant="navbar" />
                <Link
                  href={profileHref}
                  aria-label="Modifier mon profil"
                  title="Modifier mon profil"
                  className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition-colors hover:border-primary/30 hover:bg-muted"
                >
                  <UserRound className="size-4 shrink-0" aria-hidden />
                </Link>
              </>
            ) : null}
            <Button
              variant="outline"
              size="icon"
              className="size-9 rounded-full"
              onClick={handleLogout}
              aria-label="Déconnexion"
              title="Déconnexion"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
