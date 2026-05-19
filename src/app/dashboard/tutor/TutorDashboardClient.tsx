"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateLessonRequestStatusAction } from "@/app/actions/requests";
import { refreshTutorDashboardAction } from "@/app/actions/dashboard";
import type { TutorDashboardData } from "@/lib/data/dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles } from "lucide-react";
import { subjectTranslations } from "@/lib/subjects";

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

type Props = {
  initialData: TutorDashboardData;
};

export function TutorDashboardClient({ initialData }: Props) {
  const router = useRouter();
  const [data, setData] = useState(initialData);
  const { user, tutorProfile, requests } = data;

  const refresh = async () => {
    const next = await refreshTutorDashboardAction();
    setData(next);
    router.refresh();
  };

  const handleUpdateStatus = async (id: string, status: "Confirmed" | "Declined") => {
    await updateLessonRequestStatusAction(id, status);
    await refresh();
  };

  const myRequests = requests.filter((r) => r.tutorId === tutorProfile.id);
  const pendingRequests = myRequests.filter((r) => r.status === "Pending");
  const pastRequests = myRequests.filter((r) => r.status !== "Pending");

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">Espace tuteur</p>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Tableau de bord tuteur</h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
              Bonjour {user.name} — voici votre profil publié et les demandes reçues en temps réel.
            </p>
          </div>
        </div>
        <Button variant="outline" className="rounded-full" onClick={() => router.push("/onboarding/tutor")}>
          Modifier mon profil
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card className="gap-0 rounded-[1.75rem] border-border shadow-sm">
            <CardHeader className="border-b border-border pb-5">
              <CardTitle className="text-xl">Mon profil</CardTitle>
              <CardDescription>Profil enregistré en base — visible par les étudiants.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-6 py-5">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Niveau d&apos;études</p>
                <p className="font-medium text-foreground">
                  {tutorProfile.educationLevel} — {tutorProfile.institution}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Taux horaire</p>
                <p className="font-medium text-foreground">{tutorProfile.hourlyRate}€/h</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Matières</p>
                <div className="mt-1 flex flex-wrap gap-2">
                  {tutorProfile.subjects.map((sub) => (
                    <Badge key={sub} variant="secondary">
                      {subjectTranslations[sub] || sub}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Format</p>
                <p className="font-medium text-foreground">
                  {formatTranslations[tutorProfile.format] || tutorProfile.format}
                </p>
              </div>
              <div className="space-y-2 rounded-2xl bg-muted p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Disponibilités</p>
                <p className="text-sm leading-6 text-foreground/70">{tutorProfile.availability}</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Biographie</p>
                <p className="text-sm leading-6 text-foreground/70">{tutorProfile.bio}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="h-full gap-0 rounded-[1.75rem] border-border shadow-sm">
            <CardHeader className="border-b border-border pb-5">
              <CardTitle className="text-xl">Demandes de cours</CardTitle>
              <CardDescription>
                {pendingRequests.length} en attente · {pastRequests.length} dans l&apos;historique
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 py-5">
              <Tabs defaultValue="pending" className="w-full">
                <TabsList className="grid w-full grid-cols-2 rounded-full bg-muted p-1">
                  <TabsTrigger value="pending">En attente ({pendingRequests.length})</TabsTrigger>
                  <TabsTrigger value="past">Historique ({pastRequests.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="mt-5 space-y-4">
                  {pendingRequests.length === 0 ? (
                    <div className="rounded-[1.5rem] border border-dashed border-border bg-muted px-6 py-12 text-center">
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
                      <Card key={req.id} className="gap-0 rounded-[1.25rem] border-border shadow-sm">
                        <CardContent className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
                          <div className="space-y-1">
                            <p className="font-medium text-foreground">
                              Demande en {subjectTranslations[req.subject] || req.subject}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Reçu le {new Date(req.createdAt).toLocaleDateString("fr-FR")}
                            </p>
                          </div>
                          <div className="flex w-full gap-2 sm:w-auto">
                            <Button
                              variant="outline"
                              className="flex-1 rounded-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 sm:flex-none"
                              onClick={() => handleUpdateStatus(req.id, "Declined")}
                            >
                              Refuser
                            </Button>
                            <Button
                              className="flex-1 rounded-full bg-green-600 hover:bg-green-700 sm:flex-none"
                              onClick={() => handleUpdateStatus(req.id, "Confirmed")}
                            >
                              Accepter
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="past" className="mt-5 space-y-4">
                  {pastRequests.length === 0 ? (
                    <div className="rounded-[1.5rem] border border-dashed border-border bg-muted px-6 py-12 text-center text-muted-foreground">
                      Aucun historique de demande.
                    </div>
                  ) : (
                    pastRequests.map((req) => (
                      <Card key={req.id} className="gap-0 rounded-[1.25rem] border-border shadow-sm">
                        <CardContent className="flex flex-col gap-3 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
                          <div className="space-y-1">
                            <p className="font-medium text-foreground">
                              Cours de {subjectTranslations[req.subject] || req.subject}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(req.createdAt).toLocaleDateString("fr-FR")}
                            </p>
                          </div>
                          <Badge variant={req.status === "Confirmed" ? "default" : "destructive"}>
                            {statusTranslations[req.status] || req.status}
                          </Badge>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
