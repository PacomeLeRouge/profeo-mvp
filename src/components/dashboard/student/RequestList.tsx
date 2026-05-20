"use client";

import { subjectTranslations } from "@/lib/subjects";
import {
  requestStatusClassName,
  requestStatusLabels,
} from "@/lib/dashboard-status-styles";
import { ContactEmailLink } from "@/components/dashboard/ContactEmailLink";
import { LessonRequest } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Clock3 } from "lucide-react";

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
        <Badge variant="secondary" className="rounded-full px-3 py-1">
          {requests.length} active{requests.length > 1 ? "s" : ""}
        </Badge>
      </div>

      <div className="grid gap-3">
        {requests.map((request) => (
          <article
            key={request.id}
            className="flex flex-col gap-4 rounded-[1.25rem] border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="space-y-2">
              <p className="font-medium text-foreground">{request.tutorName}</p>
              <p className="text-sm text-muted-foreground">
                {subjectTranslations[request.subject] ?? request.subject}
              </p>
              {request.status === "Confirmed" ? (
                <ContactEmailLink
                  email={request.tutorContactEmail}
                  label="Contacter le tuteur"
                />
              ) : request.status === "Pending" ? (
                <p className="text-xs text-muted-foreground">
                  Les coordonnées du tuteur seront partagées après acceptation.
                </p>
              ) : null}
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
                requestStatusClassName[request.status] ??
                  "border-border bg-muted text-muted-foreground"
              )}
            >
              {requestStatusLabels[request.status] ?? request.status}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}
