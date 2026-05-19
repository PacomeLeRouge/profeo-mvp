"use client";

import { SUBJECTS, subjectTranslations, type Subject } from "@/lib/subjects";
import { Format } from "@/lib/types";
import { cn } from "@/lib/utils";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formatOptions: { value: Format | "All"; label: string }[] = [
  { value: "All", label: "Tous les formats" },
  { value: "Online", label: "En ligne" },
  { value: "In-person", label: "En personne" },
];

type TutorFiltersProps = {
  subjectFilter: Subject | "All";
  onSubjectFilterChange: (subject: Subject | "All") => void;
  maxPrice: string;
  onMaxPriceChange: (value: string) => void;
  formatFilter: Format | "All";
  onFormatFilterChange: (format: Format | "All") => void;
  onReset: () => void;
  activeFiltersCount: number;
};

export function TutorFilters({
  subjectFilter,
  onSubjectFilterChange,
  maxPrice,
  onMaxPriceChange,
  formatFilter,
  onFormatFilterChange,
  onReset,
  activeFiltersCount,
}: TutorFiltersProps) {
  return (
    <section className="rounded-[1.75rem] border border-border bg-card p-6 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.15)] sm:p-7">
      <div className="flex flex-col gap-4 border-b border-border pb-5 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" aria-hidden />
            <h2 className="text-xl font-semibold tracking-tight">Affiner la recherche</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Filtrez par matière, budget ou format — {SUBJECTS.length} matières disponibles.
          </p>
        </div>
        {activeFiltersCount > 0 ? (
          <Button
            variant="ghost"
            className="h-auto w-fit rounded-full px-0 text-muted-foreground hover:bg-transparent hover:text-foreground"
            onClick={onReset}
          >
            <X className="mr-1.5 h-4 w-4" />
            Réinitialiser ({activeFiltersCount})
          </Button>
        ) : null}
      </div>

      <div className="space-y-6 pt-5">
        <div className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Matière</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onSubjectFilterChange("All")}
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition-colors",
                subjectFilter === "All"
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground/75 hover:border-primary/30"
              )}
            >
              Toutes
            </button>
            {SUBJECTS.map((subject) => (
              <button
                key={subject}
                type="button"
                onClick={() => onSubjectFilterChange(subject)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm transition-colors",
                  subjectFilter === subject
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground/75 hover:border-primary/30"
                )}
              >
                {subjectTranslations[subject]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="max-price" className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Budget max (€/h)
            </label>
            <input
              id="max-price"
              type="number"
              min={0}
              placeholder="Ex. 40"
              value={maxPrice}
              onChange={(e) => onMaxPriceChange(e.target.value)}
              className="h-12 w-full rounded-2xl border border-border bg-muted px-4 text-base outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/30 focus:bg-card"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Format</label>
            <Select value={formatFilter} onValueChange={(val) => onFormatFilterChange(val as Format | "All")}>
              <SelectTrigger className="h-12 rounded-2xl border-border bg-muted">
                <SelectValue placeholder="Tous les formats" />
              </SelectTrigger>
              <SelectContent>
                {formatOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </section>
  );
}
