"use client";

import { subjectTranslations } from "@/lib/subjects";
import { LessonRequest } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Clock3 } from "lucide-react";

const statusLabels: Record<string, string> = {
  Pending: "En attente",
  Confirmed: "Confirmé",
  Declined: "Refusé",
};

const statusStyles: Record<string, string> = {
  Pending: "border-amber-200 bg-amber-50 text-amber-900",
  Confirmed: "border-emerald-200 bg-emerald-50 text-emerald-900",
  Declined: "border-red-200 bg-red-50 text-red-900",
};

type RequestListProps = {
  requests: LessonRequest[];
};

export function RequestList({ requests }: RequestListProps) {
  if (requests.length === 0) return null;

  return (
    <section className="space-y-4 border-t border-border pt-10">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Suivi</p>
          <h2 className="text-xl font-semibold tracking-tight">Mes demandes de cours</h2>
        </div>
        <Badge variant="outline" className="rounded-full border-border px-3 py-1">
          {requests.length} active{requests.length > 1 ? "s" : ""}
        </Badge>
      </div>

      <div className="grid gap-3">
        {requests.map((request) => (
          <article
            key={request.id}
            className="flex flex-col gap-4 rounded-[1.25rem] border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="space-y-1">
              <p className="font-medium text-foreground">{request.tutorName}</p>
              <p className="text-sm text-muted-foreground">
                {subjectTranslations[request.subject] ?? request.subject}
              </p>
              {request.createdAt ? (
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock3 className="h-3.5 w-3.5" aria-hidden />
                  {new Date(request.createdAt).toLocaleDateString("fr-BE", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              ) : null}
            </div>
            <span
              className={cn(
                "inline-flex w-fit rounded-full border px-3 py-1 text-sm font-medium",
                statusStyles[request.status] ?? "border-border bg-muted text-foreground/70"
              )}
            >
              {statusLabels[request.status] ?? request.status}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}
