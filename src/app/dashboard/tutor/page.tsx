"use client";

import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles } from "lucide-react";

// Translations
const subjectTranslations: Record<string, string> = {
  'Math': 'Mathématiques',
  'English': 'Anglais',
  'Science': 'Sciences',
  'History': 'Histoire',
  'Physics': 'Physique',
  'Computer Science': 'Informatique'
};

const formatTranslations: Record<string, string> = {
  'Online': 'En ligne',
  'In-person': 'En personne',
  'Both': 'Les deux (en ligne et en personne)',
  'All': 'Tous les formats'
};

const statusTranslations: Record<string, string> = {
  'Pending': 'En attente',
  'Confirmed': 'Confirmé',
  'Declined': 'Refusé'
};

export default function TutorDashboard() {
  const { user, tutorProfile, requests, updateRequestStatus } = useStore();
  const router = useRouter();

  if (!user || !tutorProfile) return null;

  const myRequests = requests.filter(r => r.tutorId === tutorProfile.id);
  const pendingRequests = myRequests.filter(r => r.status === 'Pending');
  const pastRequests = myRequests.filter(r => r.status !== 'Pending');

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <div className="space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.25em] text-black/40">Espace tuteur</p>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Tableau de bord tuteur</h1>
              <p className="max-w-2xl text-base leading-7 text-black/55 md:text-lg">
                Pilotez votre profil, gardez vos disponibilités lisibles et répondez rapidement aux demandes reçues.
              </p>
            </div>
          </div>
          <Button variant="outline" className="rounded-full" onClick={() => router.push('/onboarding/tutor')}>
            Modifier mon profil
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card className="gap-0 rounded-[1.75rem] border-black/10 shadow-sm">
            <CardHeader className="border-b border-black/8 pb-5">
              <CardTitle className="text-xl">Mon profil</CardTitle>
              <CardDescription>La version visible par les étudiants, organisée autour de l’essentiel.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-6 py-5">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/40">Niveau d&apos;études</p>
                <p className="font-medium text-black">{tutorProfile.educationLevel} - {tutorProfile.institution}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/40">Taux horaire</p>
                <p className="font-medium text-black">{tutorProfile.hourlyRate}€/h</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/40">Matières</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {tutorProfile.subjects.map(sub => (
                    <Badge key={sub} variant="secondary">{subjectTranslations[sub] || sub}</Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/40">Format</p>
                <p className="font-medium text-black">{formatTranslations[tutorProfile.format] || tutorProfile.format}</p>
              </div>
              <div className="space-y-2 rounded-2xl bg-black/[0.03] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/40">Disponibilités</p>
                <p className="text-sm leading-6 text-black/70">{tutorProfile.availability}</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/40">Biographie</p>
                <p className="text-sm leading-6 text-black/70">{tutorProfile.bio}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="h-full gap-0 rounded-[1.75rem] border-black/10 shadow-sm">
            <CardHeader className="border-b border-black/8 pb-5">
              <CardTitle className="text-xl">Demandes de cours</CardTitle>
              <CardDescription>Répondez vite aux nouvelles demandes, puis archivez naturellement l’historique.</CardDescription>
            </CardHeader>
            <CardContent className="px-6 py-5">
              <Tabs defaultValue="pending" className="w-full">
                <TabsList className="grid w-full grid-cols-2 rounded-full bg-black/[0.04] p-1">
                  <TabsTrigger value="pending">
                    En attente ({pendingRequests.length})
                  </TabsTrigger>
                  <TabsTrigger value="past">
                    Historique ({pastRequests.length})
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="pending" className="mt-5 space-y-4">
                  {pendingRequests.length === 0 ? (
                    <div className="rounded-[1.5rem] border border-dashed border-black/15 bg-black/[0.02] px-6 py-12 text-center">
                      <div className="mx-auto flex max-w-sm flex-col items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white">
                          <Sparkles className="h-5 w-5" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-lg font-semibold text-black">Aucune demande en attente</p>
                          <p className="text-sm leading-6 text-black/55">Les nouvelles sollicitations apparaîtront ici pour être traitées rapidement.</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    pendingRequests.map(req => (
                      <Card key={req.id} className="gap-0 rounded-[1.25rem] border-black/10 shadow-sm">
                        <CardContent className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
                          <div className="space-y-1">
                            <p className="font-medium text-black">Demande en {subjectTranslations[req.subject] || req.subject}</p>
                            <p className="text-sm text-black/55">Reçu le {new Date(req.createdAt).toLocaleDateString('fr-FR')}</p>
                          </div>
                          <div className="flex gap-2 w-full sm:w-auto">
                            <Button 
                              variant="outline" 
                              className="flex-1 rounded-full sm:flex-none border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                              onClick={() => updateRequestStatus(req.id, 'Declined')}
                            >
                              Refuser
                            </Button>
                            <Button 
                              className="flex-1 rounded-full sm:flex-none bg-green-600 hover:bg-green-700"
                              onClick={() => updateRequestStatus(req.id, 'Confirmed')}
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
                    <div className="rounded-[1.5rem] border border-dashed border-black/15 bg-black/[0.02] px-6 py-12 text-center text-black/55">
                      Aucun historique de demande.
                    </div>
                  ) : (
                    pastRequests.map(req => (
                      <Card key={req.id} className="gap-0 rounded-[1.25rem] border-black/10 shadow-sm">
                        <CardContent className="flex flex-col gap-3 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
                          <div className="space-y-1">
                            <p className="font-medium text-black">Cours de {subjectTranslations[req.subject] || req.subject}</p>
                            <p className="text-sm text-black/55">{new Date(req.createdAt).toLocaleDateString('fr-FR')}</p>
                          </div>
                          <Badge variant={req.status === 'Confirmed' ? 'default' : 'destructive'}>
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
