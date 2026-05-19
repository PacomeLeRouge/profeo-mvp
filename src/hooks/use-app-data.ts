"use client";

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
  const [user, setUser] = useState<User | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [tutorProfile, setTutorProfile] = useState<TutorProfile | null>(null);
  const [tutors, setTutors] = useState<TutorProfile[]>([]);
  const [requests, setRequests] = useState<LessonRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const [currentUser, tutorList, myRequests] = await Promise.all([
        getCurrentUserAction(),
        listTutorProfilesAction(),
        listMyLessonRequestsAction(),
      ]);

      setUser(currentUser);
      setTutors(tutorList);
      setRequests(myRequests);

      if (currentUser?.role === "student") {
        const profile = await getStudentProfileAction();
        setStudentProfile(profile);
        setTutorProfile(null);
      } else if (currentUser?.role === "tutor") {
        const profile = await getTutorProfileAction();
        setTutorProfile(profile);
        setStudentProfile(null);
      } else {
        setStudentProfile(null);
        setTutorProfile(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    user,
    studentProfile,
    tutorProfile,
    tutors,
    requests,
    isLoading,
    refresh,
    setRequests,
    setTutors,
    setStudentProfile,
    setTutorProfile,
  };
}
