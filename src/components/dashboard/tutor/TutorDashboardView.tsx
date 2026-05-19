"use client";

import { useRef, useState } from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { DevPreviewBanner } from "@/components/onboarding/DevPreviewBanner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { gsap, useGSAP, prefersReducedMotion, onboardingEase } from "@/lib/gsap-config";
import { tutorDashboardDecor } from "@/lib/dashboard-decor";
import { subjectTranslations } from "@/lib/subjects";
import type { LessonRequest, TutorProfile, User } from "@/lib/types";
import { cn } from "@/lib/utils";
import { BookOpen, Clock, Euro, Sparkles } from "lucide-react";

const formatTranslations: Record<string, string> = {
  Online: "En ligne",
  "In-person": "En personne",
  Both: "Les deux (en ligne et en personne)",
};

const statusTranslations: Record<string, string> = {
  Pending: "En attente",
  Confirmed: "Confirmé",
  Declined: "Refusé",
};

type TutorDashboardViewProps = {
  user: Pick<User, "id" | "name">;
  tutorProfile: TutorProfile;
  requests: LessonRequest[];
  preview?: boolean;
  isLoading?: boolean;
  onEditProfile?: () => void;
  onUpdateRequestStatus?: (id: string, status: "Confirmed" | "Declined") => void | Promise<void>;
};

export function TutorDashboardView({
  user,
  tutorProfile,
  requests,
  preview = false,
  isLoading = false,
  onEditProfile,
  onUpdateRequestStatus,
}: TutorDashboardViewProps) {
  const pageRef = useRef<HTMLDivElement>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const myRequests = requests.filter((r) => r.tutorId === tutorProfile.id);
  const pendingRequests = myRequests.filter((r) => r.status === "Pending");
  const pastRequests = myRequests.filter((r) => r.status !== "Pending");
  const confirmedCount = myRequests.filter((r) => r.status === "Confirmed").length;

  useGSAP(
    () => {
      if (prefersReducedMotion() || isLoading) return;
      gsap.from("[data-dashboard-stat]", {
        opacity: 0,
        y: 16,
        duration: 0.45,
        stagger: 0.08,
        ease: onboardingEase.enter,
        delay: 0.1,
      });
    },
    { scope: pageRef, dependencies: [isLoading] }
  );

  const handleStatus = async (id: string, status: "Confirmed" | "Declined") => {
    if (!onUpdateRequestStatus) return;
    setUpdatingId(id);
    try {
      await onUpdateRequestStatus(id, status);
    } finally {
      setUpdatingId(null);
    }
  };

  if (isLoading) return null;

  return (
    <DashboardShell decor={tutorDashboardDecor}>
      <div ref={pageRef}>
        {preview ? <DevPreviewBanner /> : null}

        <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">
                {preview ? "Preview · Espace tuteur" : "Espace tuteur"}
              </p>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-[2.75rem] lg:leading-none">
                  Bonjour {user.name}
                </h1>
                <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
                  Gérez votre profil publié et répondez aux demandes des étudiants en temps réel.
                </p>
              </div>
            </div>
            {onEditProfile ? (
              <Button variant="outline" className="rounded-full" onClick={onEditProfile}>
                Modifier mon profil
              </Button>
            ) : null}
          </header>

          <div className="grid gap-3 sm:grid-cols-3">
            <StatCard
              icon={Clock}
              label="Demandes en attente"
              value={String(pendingRequests.length)}
              accent="violet"
              emphasis={pendingRequests.length > 0}
            />
            <StatCard
              icon={BookOpen}
              label="Matières enseignées"
              value={String(tutorProfile.subjects.length)}
              accent="lime"
            />
            <StatCard
              icon={Euro}
              label="Tarif horaire"
              value={`${tutorProfile.hourlyRate}€`}
              accent="violet"
              emphasis
            />
          </div>

          <section className="rounded-[1.75rem] border border-border bg-card/85 p-6 shadow-sm backdrop-blur-md sm:p-7">
            <div className="flex flex-col gap-4 border-b border-border pb-5 md:flex-row md:items-end md:justify-between">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold tracking-tight">Mon profil publié</h2>
                <p className="text-sm text-muted-foreground">
                  {tutorProfile.educationLevel} · {tutorProfile.institution}
                </p>
              </div>
              <span className="inline-flex w-fit items-center rounded-full border border-border bg-muted px-3 py-1.5 text-sm font-medium text-foreground/70">
                {formatTranslations[tutorProfile.format] || tutorProfile.format}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 pt-5">
              {tutorProfile.subjects.map((sub) => (
                <Badge key={sub} variant="secondary" className="rounded-full">
                  {subjectTranslations[sub] || sub}
                </Badge>
              ))}
            </div>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              <span className="font-medium text-foreground">{confirmedCount}</span> cours confirmé
              {confirmedCount > 1 ? "s" : ""} · Disponibilités : {tutorProfile.availability}
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-semibold tracking-tight">Demandes reçues</h2>
              <span
                className={cn(
                  "inline-flex w-fit items-center rounded-full border px-3 py-1.5 text-sm font-semibold backdrop-blur-sm",
                  pendingRequests.length > 0
                    ? "border-highlight/35 bg-highlight/12 text-highlight"
                    : "border-border bg-card/80 text-muted-foreground"
                )}
              >
                {pendingRequests.length} en attente
              </span>
            </div>

            <div className="rounded-[1.75rem] border border-border bg-card/85 p-5 shadow-sm backdrop-blur-md sm:p-6">
              <Tabs defaultValue="pending" className="w-full">
                <TabsList className="grid w-full grid-cols-2 rounded-full bg-muted p-1">
                  <TabsTrigger value="pending">En attente ({pendingRequests.length})</TabsTrigger>
                  <TabsTrigger value="past">Historique ({pastRequests.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="mt-5 space-y-4">
                  {pendingRequests.length === 0 ? (
                    <div className="rounded-[1.5rem] border border-dashed border-border bg-muted/80 px-6 py-12 text-center">
                      <div className="mx-auto flex max-w-sm flex-col items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                          <Sparkles className="h-5 w-5" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-lg font-semibold text-foreground">Aucune demande en attente</p>
                          <p className="text-sm leading-6 text-muted-foreground">
                            Les nouvelles sollicitations des étudiants apparaîtront ici.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    pendingRequests.map((req) => (
                      <article
                        key={req.id}
                        className="flex flex-col gap-4 rounded-[1.25rem] border border-border bg-background/50 p-5 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="space-y-1">
                          <p className="font-medium text-foreground">
                            {subjectTranslations[req.subject] || req.subject}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Reçu le{" "}
                            {new Date(req.createdAt).toLocaleDateString("fr-BE", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="flex w-full gap-2 sm:w-auto">
                          <Button
                            variant="destructive"
                            className="flex-1 rounded-full sm:flex-none"
                            disabled={updatingId === req.id}
                            onClick={() => handleStatus(req.id, "Declined")}
                          >
                            Refuser
                          </Button>
                          <Button
                            className="flex-1 rounded-full sm:flex-none"
                            disabled={updatingId === req.id}
                            onClick={() => handleStatus(req.id, "Confirmed")}
                          >
                            Accepter
                          </Button>
                        </div>
                      </article>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="past" className="mt-5 space-y-4">
                  {pastRequests.length === 0 ? (
                    <div className="rounded-[1.5rem] border border-dashed border-border bg-muted/80 px-6 py-12 text-center text-muted-foreground">
                      Aucun historique de demande.
                    </div>
                  ) : (
                    pastRequests.map((req) => (
                      <article
                        key={req.id}
                        className="flex flex-col gap-3 rounded-[1.25rem] border border-border bg-background/50 p-5 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="space-y-1">
                          <p className="font-medium text-foreground">
                            {subjectTranslations[req.subject] || req.subject}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(req.createdAt).toLocaleDateString("fr-BE")}
                          </p>
                        </div>
                        <Badge variant={req.status === "Confirmed" ? "default" : "destructive"}>
                          {statusTranslations[req.status] || req.status}
                        </Badge>
                      </article>
                    ))
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </section>
        </div>
      </div>
    </DashboardShell>
  );
}
