import Link from "next/link";
import { notFound } from "next/navigation";
import { isDevPreviewEnabled } from "@/lib/dev-preview";

const previews = [
  {
    href: "/dev/preview/student",
    title: "Onboarding étudiant",
    description: "4 étapes — âge, niveau, établissement, matières. Animations GSAP incluses.",
  },
  {
    href: "/dev/preview/tutor",
    title: "Onboarding tuteur",
    description: "7 étapes — tarif, format, disponibilités. Sans connexion Clerk.",
  },
  {
    href: "/dev/preview/dashboard/student",
    title: "Dashboard étudiant",
    description: "Filtres par matière, cartes tuteurs, demandes de cours — données mock, sans connexion.",
  },
];

export default function DevHubPage() {
  if (!isDevPreviewEnabled()) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white px-6 py-16 text-black md:px-12">
      <div className="mx-auto max-w-3xl space-y-10">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.25em] text-black/40">Développement local</p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Previews UI</h1>
          <p className="text-lg leading-8 text-black/55">
            Accédez aux parcours et au dashboard sans vous connecter. Disponible uniquement en{" "}
            <code className="rounded bg-black/5 px-1.5 py-0.5 text-base">npm run dev</code>.
          </p>
        </div>

        <div className="grid gap-4">
          {previews.map((preview) => (
            <Link
              key={preview.href}
              href={preview.href}
              className="group rounded-3xl border border-black/10 p-6 transition-colors hover:border-black/25 hover:bg-black/[0.02]"
            >
              <h2 className="text-2xl font-semibold tracking-tight group-hover:underline">
                {preview.title}
              </h2>
              <p className="mt-2 text-base leading-7 text-black/55">{preview.description}</p>
              <p className="mt-4 text-sm font-medium text-black/70">{preview.href}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
