"use client";

import { useMemo, useRef, useState } from "react";
import { RequestDialog } from "@/components/dashboard/student/RequestDialog";
import { RequestList } from "@/components/dashboard/student/RequestList";
import { TutorCard, TutorEmptyState } from "@/components/dashboard/student/TutorCard";
import { TutorFilters } from "@/components/dashboard/student/TutorFilters";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { RoleBadge } from "@/components/dashboard/RoleBadge";
import { SwitchRoleLink } from "@/components/dashboard/SwitchRoleLink";
import { StatCard } from "@/components/dashboard/StatCard";
import { DevPreviewBanner } from "@/components/onboarding/DevPreviewBanner";
import { Button } from "@/components/ui/button";
import { gsap, useGSAP, prefersReducedMotion, onboardingEase } from "@/lib/gsap-config";
import { type Subject } from "@/lib/subjects";
import { Format, LessonRequest, TutorProfile, User } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Search, Users } from "lucide-react";

type StudentDashboardViewProps = {
  tutors: TutorProfile[];
  user: Pick<User, "id" | "name">;
  requests: LessonRequest[];
  preview?: boolean;
  isLoading?: boolean;
  onEditProfile?: () => void;
  onSendRequest?: (data: {
    tutor: TutorProfile;
    subject: Subject;
  }) => void | Promise<void>;
};

export function StudentDashboardView({
  tutors,
  user,
  requests,
  preview = false,
  isLoading = false,
  onEditProfile,
  onSendRequest,
}: StudentDashboardViewProps) {
  const pageRef = useRef<HTMLDivElement>(null);

  const [subjectFilter, setSubjectFilter] = useState<Subject | "All">("All");
  const [maxPrice, setMaxPrice] = useState("");
  const [formatFilter, setFormatFilter] = useState<Format | "All">("All");

  const [selectedTutor, setSelectedTutor] = useState<TutorProfile | null>(null);
  const [requestSubject, setRequestSubject] = useState<Subject | "">("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const myRequests = requests.filter((r) => r.studentId === user.id);
  const pendingCount = myRequests.filter((r) => r.status === "Pending").length;

  const activeFiltersCount =
    (subjectFilter !== "All" ? 1 : 0) +
    (maxPrice !== "" ? 1 : 0) +
    (formatFilter !== "All" ? 1 : 0);

  const filteredTutors = useMemo(() => {
    return tutors.filter((tutor) => {
      if (tutor.userId === user.id) return false;

      const matchesSubject =
        subjectFilter === "All" || tutor.subjects.includes(subjectFilter);

      const matchesPrice = maxPrice === "" || tutor.hourlyRate <= Number(maxPrice);

      const matchesFormat =
        formatFilter === "All" ||
        tutor.format === "Both" ||
        tutor.format === formatFilter;

      return matchesSubject && matchesPrice && matchesFormat;
    });
  }, [tutors, subjectFilter, maxPrice, formatFilter, user.id]);

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

  const resetFilters = () => {
    setSubjectFilter("All");
    setMaxPrice("");
    setFormatFilter("All");
  };

  const handleOpenRequest = (tutor: TutorProfile) => {
    setSelectedTutor(tutor);
    setRequestSubject(tutor.subjects[0] ?? "");
    setIsDialogOpen(true);
  };

  const handleSendRequest = async () => {
    if (!selectedTutor || !requestSubject || !onSendRequest) return;

    await onSendRequest({
      tutor: selectedTutor,
      subject: requestSubject,
    });

    setIsDialogOpen(false);
    setSelectedTutor(null);
    setRequestSubject("");
  };

  if (isLoading) return null;

  return (
    <DashboardShell>
      <div ref={pageRef}>
      {preview ? <DevPreviewBanner /> : null}

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              {!preview ? <RoleBadge role="student" /> : null}
              <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">
                {preview ? "Preview · Espace étudiant" : "Espace étudiant"}
              </p>
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-[2.75rem] lg:leading-none">
                Trouve ton tuteur
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
                Compare les profils, filtre par matière et envoie une demande en quelques clics.
              </p>
            </div>
          </div>
          {!preview ? (
            <div className="flex flex-wrap items-center gap-2">
              <SwitchRoleLink currentRole="student" />
              {onEditProfile ? (
                <Button variant="outline" className="rounded-full" onClick={onEditProfile}>
                  Modifier mon profil
                </Button>
              ) : null}
            </div>
          ) : onEditProfile ? (
            <Button variant="outline" className="rounded-full" onClick={onEditProfile}>
              Modifier mon profil
            </Button>
          ) : null}
        </header>

        <div className="flex flex-wrap gap-2">
          <StatCard
            icon={Users}
            label="Tuteurs disponibles"
            value={String(filteredTutors.length)}
            accent="lime"
            variant="solid"
          />
          <StatCard
            icon={Search}
            label="Demandes en attente"
            value={String(pendingCount)}
            accent="violet"
            emphasis={pendingCount > 0}
            variant="solid"
          />
        </div>

        <TutorFilters
          subjectFilter={subjectFilter}
          onSubjectFilterChange={setSubjectFilter}
          maxPrice={maxPrice}
          onMaxPriceChange={setMaxPrice}
          formatFilter={formatFilter}
          onFormatFilterChange={setFormatFilter}
          onReset={resetFilters}
          activeFiltersCount={activeFiltersCount}
        />

        <section className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold tracking-tight">Tuteurs disponibles</h2>
            <span
              className={cn(
                "inline-flex w-fit items-center rounded-full border px-3 py-1.5 text-sm font-semibold backdrop-blur-sm",
                filteredTutors.length > 0
                  ? "border-highlight/35 bg-highlight/12 text-highlight"
                  : "border-border bg-card/80 text-muted-foreground"
              )}
            >
              {filteredTutors.length} résultat{filteredTutors.length > 1 ? "s" : ""}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredTutors.map((tutor, index) => (
              <TutorCard key={tutor.id} tutor={tutor} index={index} onRequest={handleOpenRequest} />
            ))}
            {filteredTutors.length === 0 ? <TutorEmptyState onReset={resetFilters} /> : null}
          </div>
        </section>

        <RequestList requests={myRequests} />

        <RequestDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          tutor={selectedTutor}
          subject={requestSubject}
          onSubjectChange={setRequestSubject}
          onSubmit={handleSendRequest}
        />
        </div>
      </div>
    </DashboardShell>
  );
}
