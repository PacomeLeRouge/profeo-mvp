"use client";

import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { GraduationCap, LogOut } from "lucide-react";

export function Navbar() {
  const { user, logout } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const isEntryFlow = pathname === "/" || pathname === "/role-selection" || pathname.startsWith("/signup") || pathname.startsWith("/onboarding");

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!user || isEntryFlow) return null;

  return (
    <nav className="sticky top-0 z-40 border-b border-black/8 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-16 flex-col justify-center gap-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-0">
          <div className="flex min-w-0 flex-1 items-center justify-between gap-3 sm:justify-start">
            <div 
              className="flex min-w-0 items-center gap-3 cursor-pointer"
              onClick={() => router.push(`/dashboard/${user.role}`)}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black text-white">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="block text-2xl font-bold leading-none text-black">Clutch</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="inline-flex max-w-full items-center rounded-full border border-black/10 bg-white px-3 py-2 text-sm text-black/60 shadow-sm">
              <span className="truncate font-medium text-black">{user.name}</span>
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
