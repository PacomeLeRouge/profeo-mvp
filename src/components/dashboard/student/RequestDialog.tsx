"use client";

import { subjectTranslations, type Subject } from "@/lib/subjects";
import { TutorProfile } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const formatLabels: Record<string, string> = {
  Online: "En ligne",
  "In-person": "En personne",
  Both: "En ligne & présentiel",
};

type RequestDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tutor: TutorProfile | null;
  subject: Subject | "";
  onSubjectChange: (subject: Subject) => void;
  onSubmit: () => void;
};

export function RequestDialog({
  open,
  onOpenChange,
  tutor,
  subject,
  onSubjectChange,
  onSubmit,
}: RequestDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-[1.5rem] border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Demander un cours</DialogTitle>
          <DialogDescription>
            Envoie une demande à {tutor?.name}. Le tuteur pourra accepter ou refuser.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Matière
            </label>
            <Select value={subject} onValueChange={(val) => onSubjectChange(val as Subject)}>
              <SelectTrigger className="h-12 w-full rounded-2xl">
                <SelectValue placeholder="Sélectionner une matière" />
              </SelectTrigger>
              <SelectContent>
                {tutor?.subjects.map((sub) => (
                  <SelectItem key={sub} value={sub}>
                    {subjectTranslations[sub]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {tutor ? (
            <div className="grid gap-2 rounded-2xl border border-border bg-muted p-4 text-sm">
              <Row label="Tarif" value={`${tutor.hourlyRate} €/h`} />
              <Row label="Format" value={formatLabels[tutor.format] ?? tutor.format} />
              <Row label="Établissement" value={tutor.institution} />
            </div>
          ) : null}
        </div>

        <DialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:gap-0">
          <Button variant="outline" className="rounded-full" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button className="rounded-full" onClick={onSubmit} disabled={!subject}>
            Envoyer la demande
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("max-w-[60%] break-words text-right font-medium text-foreground")}>{value}</span>
    </div>
  );
}
