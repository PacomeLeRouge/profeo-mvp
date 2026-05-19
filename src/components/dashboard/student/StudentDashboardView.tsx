"use client";

import { useMemo, useRef, useState } from "react";
import { RequestDialog } from "@/components/dashboard/student/RequestDialog";
import { RequestList } from "@/components/dashboard/student/RequestList";
import { TutorCard, TutorEmptyState } from "@/components/dashboard/student/TutorCard";
import { TutorFilters } from "@/components/dashboard/student/TutorFilters";
import { DevPreviewBanner } from "@/components/onboarding/DevPreviewBanner";
import { Button } from "@/components/ui/button";
import { gsap, useGSAP, prefersReducedMotion, onboardingEase } from "@/lib/gsap-config";
import { SUBJECTS, type Subject } from "@/lib/subjects";
import { Format, LessonRequest, TutorProfile, User } from "@/lib/types";
import { BookOpen, Search, Users } from "lucide-react";

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
    <div ref={pageRef} className="min-h-screen bg-[#fafafa]">
      {preview ? <DevPreviewBanner /> : null}

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.25em] text-black/40">
              {preview ? "Preview · Espace étudiant" : "Espace étudiant"}
            </p>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-[2.75rem] lg:leading-none">
                Trouve ton tuteur
              </h1>
              <p className="max-w-2xl text-base leading-7 text-black/55 md:text-lg">
                Compare les profils, filtre par matière et envoie une demande en quelques clics.
              </p>
            </div>
          </div>
          {onEditProfile ? (
            <Button
              variant="outline"
              className="rounded-full border-black/15 bg-white"
              onClick={onEditProfile}
            >
              Modifier mon profil
            </Button>
          ) : null}
        </header>

        <div className="grid gap-3 sm:grid-cols-3">
          <StatCard icon={Users} label="Tuteurs disponibles" value={String(filteredTutors.length)} />
          <StatCard icon={BookOpen} label="Matières" value={String(SUBJECTS.length)} />
          <StatCard icon={Search} label="Demandes en attente" value={String(pendingCount)} />
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
            <span className="inline-flex w-fit items-center rounded-full border border-black/10 bg-white px-3 py-1.5 text-sm font-medium text-black/65">
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
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users;
  label: string;
  value: string;
}) {
  return (
    <div
      data-dashboard-stat
      className="rounded-2xl border border-black/10 bg-white px-5 py-4 shadow-sm"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/[0.05]">
          <Icon className="h-4 w-4 text-black/70" aria-hidden />
        </div>
        <div>
          <p className="text-2xl font-semibold tracking-tight">{value}</p>
          <p className="text-sm text-black/50">{label}</p>
        </div>
      </div>
    </div>
  );
}
