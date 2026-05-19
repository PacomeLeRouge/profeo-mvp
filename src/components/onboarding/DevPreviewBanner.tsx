"use client";

import Link from "next/link";

export function DevPreviewBanner() {
  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-center text-sm text-amber-950">
      <span className="font-medium">Mode preview dev</span>
      <span className="mx-2 text-amber-700">·</span>
      <span className="text-amber-800">Aucune connexion requise — les données ne sont pas enregistrées.</span>
      <span className="mx-2 text-amber-700">·</span>
      <Link href="/dev" className="font-medium underline underline-offset-2 hover:text-amber-900">
        Autres previews
      </Link>
    </div>
  );
}
