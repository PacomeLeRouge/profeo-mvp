"use client";

import { useUser } from "@clerk/nextjs";
import { useCallback, useEffect, useState } from "react";
import { getCurrentUserAction } from "@/app/actions/user";
import {
  getStudentProfileAction,
  getTutorProfileAction,
  listTutorProfilesAction,
} from "@/app/actions/profiles";
import { listMyLessonRequestsAction } from "@/app/actions/requests";
import type {
  LessonRequest,
  StudentProfile,
  TutorProfile,
  User,
} from "@/lib/types";

export function useAppData() {
  const { isLoaded: clerkLoaded, isSignedIn } = useUser();
  const [user, setUser] = useState<User | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [tutorProfile, setTutorProfile] = useState<TutorProfile | null>(null);
  const [tutors, setTutors] = useState<TutorProfile[]>([]);
  const [requests, setRequests] = useState<LessonRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const currentUser = await getCurrentUserAction();
      setUser(currentUser);

      if (!currentUser) {
        setStudentProfile(null);
        setTutorProfile(null);
        setTutors([]);
        setRequests([]);
        return;
      }

      const [tutorList, myRequests] = await Promise.all([
        listTutorProfilesAction().catch(() => [] as TutorProfile[]),
        listMyLessonRequestsAction().catch(() => [] as LessonRequest[]),
      ]);

      setTutors(tutorList);
      setRequests(myRequests);

      if (currentUser.role === "student") {
        const profile = await getStudentProfileAction().catch(() => null);
        setStudentProfile(profile);
        setTutorProfile(null);
      } else if (currentUser.role === "tutor") {
        const profile = await getTutorProfileAction().catch(() => null);
        setTutorProfile(profile);
        setStudentProfile(null);
      } else {
        setStudentProfile(null);
        setTutorProfile(null);
      }
    } catch (err) {
      console.error("[useAppData] refresh failed:", err);
      setError(
        err instanceof Error ? err.message : "Impossible de charger vos données"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!clerkLoaded) return;

    if (!isSignedIn) {
      setUser(null);
      setStudentProfile(null);
      setTutorProfile(null);
      setTutors([]);
      setRequests([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    void refresh();
  }, [clerkLoaded, isSignedIn, refresh]);

  return {
    user,
    studentProfile,
    tutorProfile,
    tutors,
    requests,
    isLoading: !clerkLoaded || isLoading,
    error,
    refresh,
    setRequests,
    setTutors,
    setStudentProfile,
    setTutorProfile,
  };
}
