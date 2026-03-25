import { create } from 'zustand';
import { User, TutorProfile, StudentProfile, LessonRequest, Role } from '../types';
import { mockTutors } from './mockData';

interface AppState {
  user: User | null;
  tutorProfile: TutorProfile | null;
  studentProfile: StudentProfile | null;
  tutors: TutorProfile[];
  requests: LessonRequest[];

  // Actions
  login: (name: string) => void;
  logout: () => void;
  setRole: (role: Role) => void;
  updateTutorProfile: (profile: Partial<TutorProfile>) => void;
  updateStudentProfile: (profile: Partial<StudentProfile>) => void;
  addRequest: (request: Omit<LessonRequest, 'id' | 'createdAt' | 'status'>) => void;
  updateRequestStatus: (id: string, status: 'Confirmed' | 'Declined') => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  tutorProfile: null,
  studentProfile: null,
  tutors: mockTutors,
  requests: [],

  login: (name) => set({
    user: { id: `u-${Date.now()}`, name, role: null },
  }),

  logout: () => set({
    user: null,
    tutorProfile: null,
    studentProfile: null,
  }),

  setRole: (role) => set((state) => ({
    user: state.user ? { ...state.user, role } : null,
  })),

  updateTutorProfile: (profileData) => set((state) => {
    if (!state.user) return state;

    const newProfile = {
      ...(state.tutorProfile || {
        id: `t-${Date.now()}`,
        userId: state.user.id,
        name: state.user.name,
        age: undefined,
        subjects: [],
        hourlyRate: 0,
        format: 'Online',
        bio: '',
        availability: '',
        educationLevel: '',
        institution: '',
      }),
      ...profileData,
    } as TutorProfile;

    // Also update global tutors list if it's the current user
    const existingIndex = state.tutors.findIndex(t => t.userId === state.user?.id);
    const newTutors = [...state.tutors];
    
    if (existingIndex >= 0) {
      newTutors[existingIndex] = newProfile;
    } else {
      newTutors.push(newProfile);
    }

    return { tutorProfile: newProfile, tutors: newTutors };
  }),

  updateStudentProfile: (profileData) => set((state) => {
    if (!state.user) return state;

    const newProfile = {
      ...(state.studentProfile || {
        id: `s-${Date.now()}`,
        userId: state.user.id,
        age: undefined,
        educationLevel: '',
        institution: '',
        subjectsOfInterest: [],
      }),
      ...profileData,
    } as StudentProfile;

    return { studentProfile: newProfile };
  }),

  addRequest: (reqData) => set((state) => ({
    requests: [
      ...state.requests,
      {
        ...reqData,
        id: `req-${Date.now()}`,
        status: 'Pending',
        createdAt: new Date().toISOString(),
      },
    ],
  })),

  updateRequestStatus: (id, status) => set((state) => ({
    requests: state.requests.map((req) =>
      req.id === id ? { ...req, status } : req
    ),
  })),
}));
