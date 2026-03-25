"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Subject, Format, TutorProfile } from "@/lib/types";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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

export default function StudentDashboard() {
  const { tutors, addRequest, user, requests } = useStore();
  const router = useRouter();
  
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [formatFilter, setFormatFilter] = useState<Format | "All">("All");
  
  const [selectedTutor, setSelectedTutor] = useState<TutorProfile | null>(null);
  const [requestSubject, setRequestSubject] = useState<Subject | "">("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // View user's requests
  const myRequests = requests.filter(r => r.studentId === user?.id);

  const filteredTutors = useMemo(() => {
    return tutors.filter((tutor) => {
      // Don't show the user themselves if they somehow have a tutor profile
      if (tutor.userId === user?.id) return false;

      // Subject search
      const matchesSearch = search === "" || tutor.subjects.some(s => 
        (subjectTranslations[s] || s).toLowerCase().includes(search.toLowerCase()) ||
        s.toLowerCase().includes(search.toLowerCase())
      );
      
      // Price filter
      const matchesPrice = maxPrice === "" || tutor.hourlyRate <= Number(maxPrice);
      
      // Format filter
      const matchesFormat = formatFilter === "All" || 
                           tutor.format === "Both" || 
                           tutor.format === formatFilter;

      return matchesSearch && matchesPrice && matchesFormat;
    });
  }, [tutors, search, maxPrice, formatFilter, user?.id]);

  const handleOpenRequest = (tutor: TutorProfile) => {
    setSelectedTutor(tutor);
    setRequestSubject(tutor.subjects[0]); // Default to first subject
    setIsDialogOpen(true);
  };

  const handleSendRequest = () => {
    if (!user || !selectedTutor || !requestSubject) return;

    addRequest({
      studentId: user.id,
      tutorId: selectedTutor.id,
      tutorName: selectedTutor.name,
      subject: requestSubject as Subject,
    });

    setIsDialogOpen(false);
    setSelectedTutor(null);
    setRequestSubject("");
  };

  const getAvailabilitySlots = (availability: string) => {
    const slots = availability.split(' • ').map((slot) => slot.trim()).filter(Boolean);
    if (slots.length === 0) {
      return [availability];
    }
    return slots;
  };

  if (!user) return null;

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <div className="space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.25em] text-black/40">Espace étudiant</p>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Tableau de bord étudiant</h1>
              <p className="max-w-2xl text-base leading-7 text-black/55 md:text-lg">
                Trouvez rapidement un tuteur pertinent, comparez les profils utiles et suivez vos demandes sans friction.
              </p>
            </div>
          </div>
          <Button variant="outline" className="rounded-full" onClick={() => router.push('/onboarding/student')}>
            Modifier mon profil
          </Button>
        </div>
      </div>

      <Card className="gap-0 rounded-[1.75rem] border-black/10 shadow-none">
        <CardHeader className="border-b border-black/8 pb-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xl">Affiner la recherche</CardTitle>
              <CardDescription>
                Utilisez seulement les critères utiles pour réduire les résultats sans surcharger l’écran.
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              className="w-fit rounded-full px-0 text-black/60 hover:bg-transparent hover:text-black"
              onClick={() => {
                setSearch("");
                setMaxPrice("");
                setFormatFilter("All");
              }}
            >
              Réinitialiser les filtres
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-6 py-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Rechercher une matière</label>
              <Input 
                placeholder="ex: Mathématiques, Sciences" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Prix maximum (€/h)</label>
              <Input 
                type="number" 
                placeholder="N'importe quel prix" 
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Format</label>
              <Select value={formatFilter} onValueChange={(val: Format) => setFormatFilter(val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les formats" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">Tous les formats</SelectItem>
                  <SelectItem value="Online">En ligne</SelectItem>
                  <SelectItem value="In-person">En personne</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Tuteurs disponibles</h2>
          </div>
          <div className="inline-flex w-fit items-center rounded-full border border-black/10 bg-black/[0.03] px-3 py-1.5 text-sm font-medium text-black/65">
            {filteredTutors.length} résultat{filteredTutors.length > 1 ? "s" : ""}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTutors.map((tutor) => (
            <Card key={tutor.id} className="gap-0 rounded-[1.5rem] border-black/10 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <CardTitle className="text-xl">{tutor.name}</CardTitle>
                    <CardDescription>{formatTranslations[tutor.format] || tutor.format}</CardDescription>
                  </div>
                  <div className="rounded-full bg-black px-3 py-1.5 text-sm font-semibold text-white whitespace-nowrap">
                    {tutor.hourlyRate}€/h
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow space-y-4 px-6 pb-5">
                <div className="flex flex-wrap gap-2">
                  {tutor.subjects.map(sub => (
                    <Badge key={sub} variant="secondary">{subjectTranslations[sub] || sub}</Badge>
                  ))}
                </div>
                <p className="text-sm leading-6 text-black/65 line-clamp-3">{tutor.bio}</p>
                <div className="space-y-2 rounded-2xl bg-black/[0.03] p-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">Disponibilités</p>
                  <div className="flex flex-wrap gap-2">
                    {getAvailabilitySlots(tutor.availability).map((slot) => (
                      <Badge key={`${tutor.id}-${slot}`} variant="outline" className="bg-white">
                        {slot}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="mt-auto border-t border-black/8 px-6 py-4">
                <Button className="w-full rounded-full" onClick={() => handleOpenRequest(tutor)}>
                  Demander un cours
                </Button>
              </CardFooter>
            </Card>
          ))}
          {filteredTutors.length === 0 && (
            <div className="col-span-full rounded-[1.75rem] border border-dashed border-black/15 bg-black/[0.02] px-6 py-14 text-center">
              <div className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-black">Aucun tuteur trouvé avec ces critères</p>
                  <p className="text-sm leading-6 text-black/55">Élargissez la recherche ou retirez un filtre pour faire réapparaître des profils pertinents.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {myRequests.length > 0 && (
        <div className="mt-12 space-y-4 border-t border-black/8 pt-8">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">Mes demandes de cours</h2>
          </div>
          <div className="grid gap-4">
            {myRequests.map((req) => (
              <Card key={req.id} className="gap-0 rounded-[1.25rem] border-black/10 shadow-sm">
                <CardContent className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">Tuteur: {req.tutorName}</p>
                    <p className="text-sm text-black/55">Matière: {subjectTranslations[req.subject] || req.subject}</p>
                  </div>
                  <Badge variant={
                    req.status === 'Confirmed' ? 'default' : 
                    req.status === 'Declined' ? 'destructive' : 
                    'outline'
                  }>
                    {statusTranslations[req.status] || req.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Demander un cours</DialogTitle>
            <DialogDescription>
              Envoyer une demande à {selectedTutor?.name}. Le tuteur sera notifié et pourra accepter ou refuser.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Choisir la matière</label>
              <Select value={requestSubject} onValueChange={(val: Subject) => setRequestSubject(val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une matière" />
                </SelectTrigger>
                <SelectContent>
                  {selectedTutor?.subjects.map(sub => (
                    <SelectItem key={sub} value={sub}>{subjectTranslations[sub] || sub}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md space-y-2 text-sm">
              <p><strong>Tarif:</strong> {selectedTutor?.hourlyRate}€/h</p>
              <p><strong>Format:</strong> {selectedTutor ? formatTranslations[selectedTutor.format] || selectedTutor.format : ''}</p>
              <p><strong>Disponibilités:</strong> {selectedTutor?.availability}</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSendRequest} disabled={!requestSubject}>Envoyer la demande</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
