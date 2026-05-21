"use client";

import Link from "next/link";

export function DevPreviewBanner() {
  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-center text-xs text-amber-950 sm:text-sm">
      <div className="mx-auto flex max-w-4xl flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-2">
        <span className="font-medium">Mode preview dev</span>
        <span className="hidden text-amber-700 sm:inline">·</span>
        <span className="text-amber-800">Aucune connexion requise — les données ne sont pas enregistrées.</span>
        <span className="hidden text-amber-700 sm:inline">·</span>
        <Link href="/dev" className="font-medium underline underline-offset-2 hover:text-amber-900">
          Autres previews
        </Link>
      </div>
    </div>
  );
}
