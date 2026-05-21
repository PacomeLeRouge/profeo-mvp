"use client";

import { useMemo, useRef, useState } from "react";
import { RequestDialog } from "@/components/dashboard/student/RequestDialog";
import { RequestList } from "@/components/dashboard/student/RequestList";
import { TutorCard, TutorEmptyState } from "@/components/dashboard/student/TutorCard";
import { TutorFilters } from "@/components/dashboard/student/TutorFilters";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { StatCard } from "@/components/dashboard/StatCard";
import { DevPreviewBanner } from "@/components/onboarding/DevPreviewBanner";
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
  const [isRequestSubmitting, setIsRequestSubmitting] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);

  const myRequests = requests.filter((r) => r.studentId === user.id);
  const pendingCount = myRequests.filter((r) => r.status === "Pending").length;

  const requestStatusByTutorId = useMemo(() => {
    const statuses = new Map<string, LessonRequest["status"]>();

    for (const request of myRequests) {
      if (request.status === "Declined") continue;

      const existing = statuses.get(request.tutorId);
      if (!existing || request.status === "Confirmed") {
        statuses.set(request.tutorId, request.status);
      }
    }

    return statuses;
  }, [myRequests]);

  const activeFiltersCount =
    (subjectFilter !== "All" ? 1 : 0) +
    (maxPrice !== "" ? 1 : 0) +
    (formatFilter !== "All" ? 1 : 0);

  const catalogTutors = useMemo(
    () => tutors.filter((tutor) => tutor.userId !== user.id),
    [tutors, user.id]
  );

  const filteredTutors = useMemo(() => {
    const maxBudget = maxPrice === "" ? null : Number(maxPrice);

    return catalogTutors.filter((tutor) => {
      const matchesSubject =
        subjectFilter === "All" || tutor.subjects.includes(subjectFilter);

      const matchesPrice =
        maxBudget === null || !Number.isFinite(maxBudget) || tutor.hourlyRate <= maxBudget;

      const matchesFormat =
        formatFilter === "All" ||
        tutor.format === "Both" ||
        tutor.format === formatFilter;

      return matchesSubject && matchesPrice && matchesFormat;
    });
  }, [catalogTutors, subjectFilter, maxPrice, formatFilter]);

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
    const status = requestStatusByTutorId.get(tutor.id);
    if (status === "Pending" || status === "Confirmed") return;

    setRequestError(null);
    setSelectedTutor(tutor);
    setRequestSubject(tutor.subjects[0] ?? "");
    setIsDialogOpen(true);
  };

  const handleSendRequest = async () => {
    if (!selectedTutor || !requestSubject || !onSendRequest || isRequestSubmitting) return;

    setIsRequestSubmitting(true);
    setRequestError(null);

    try {
      await onSendRequest({
        tutor: selectedTutor,
        subject: requestSubject,
      });

      setIsDialogOpen(false);
      setSelectedTutor(null);
      setRequestSubject("");
    } catch (err) {
      console.error("[StudentDashboard] request failed:", err);
      setRequestError(
        err instanceof Error
          ? err.message
          : "Impossible d'envoyer la demande. Réessayez."
      );
    } finally {
      setIsRequestSubmitting(false);
    }
  };

  if (isLoading) return null;

  return (
    <DashboardShell>
      <div ref={pageRef}>
      {preview ? <DevPreviewBanner /> : null}

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-[2.75rem] lg:leading-none">
            {preview ? "Preview · Trouve ton tuteur" : "Trouve ton tuteur"}
          </h1>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
            Compare les profils, filtre par matière et envoie une demande en quelques clics.
          </p>
        </header>

        <div className="flex flex-wrap gap-2">
          <StatCard
            icon={Users}
            label="Tuteurs disponibles"
            value={String(catalogTutors.length)}
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
            {filteredTutors.map((tutor) => (
              <TutorCard
                key={tutor.id}
                tutor={tutor}
                requestStatus={requestStatusByTutorId.get(tutor.id) ?? null}
                onRequest={handleOpenRequest}
              />
            ))}
            {filteredTutors.length === 0 ? (
              <TutorEmptyState
                onReset={resetFilters}
                hasActiveFilters={activeFiltersCount > 0}
                hasCatalogTutors={catalogTutors.length > 0}
              />
            ) : null}
          </div>
        </section>

        <RequestList requests={myRequests} />

        <RequestDialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            if (!isRequestSubmitting) {
              setIsDialogOpen(open);
              if (!open) setRequestError(null);
            }
          }}
          tutor={selectedTutor}
          subject={requestSubject}
          onSubjectChange={setRequestSubject}
          onSubmit={handleSendRequest}
          isSubmitting={isRequestSubmitting}
          error={requestError}
        />
        </div>
      </div>
    </DashboardShell>
  );
}
