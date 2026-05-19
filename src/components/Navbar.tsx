"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { GraduationCap, LogOut } from "lucide-react";
import { useAppData } from "@/hooks/use-app-data";

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

  const displayName = user?.name ?? clerkUser.fullName ?? "Utilisateur";
  const role = user?.role;

  return (
    <nav className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-16 flex-col justify-center gap-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-0">
          <div className="flex min-w-0 flex-1 items-center justify-between gap-3 sm:justify-start">
            <button
              type="button"
              className="flex min-w-0 items-center gap-3 cursor-pointer"
              onClick={() => {
                if (role) router.push(`/dashboard/${role}`);
              }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="font-display block text-2xl font-bold leading-none text-foreground">Clutch</span>
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="inline-flex max-w-full items-center rounded-full border border-border bg-card px-3 py-2 text-sm text-muted-foreground shadow-sm">
              <span className="truncate font-medium text-foreground">{displayName}</span>
            </div>
            <Button variant="outline" size="sm" className="rounded-full" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
