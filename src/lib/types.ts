export type Role = 'student' | 'tutor' | null;

export type Subject = 'Math' | 'English' | 'Science' | 'History' | 'Physics' | 'Computer Science';

export type Format = 'Online' | 'In-person' | 'Both';

export interface User {
  id: string;
  role: Role;
  name: string;
  age?: number;
}

export interface TutorProfile {
  id: string;
  userId: string; // references User.id
  name: string;
  age?: number;
  subjects: Subject[];
  hourlyRate: number;
  format: Format;
  bio: string;
  availability: string;
  educationLevel: string;
  institution: string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  age?: number;
  educationLevel: string;
  institution: string;
  subjectsOfInterest: Subject[];
}

export type RequestStatus = 'Pending' | 'Confirmed' | 'Declined';

export interface LessonRequest {
  id: string;
  studentId: string;
  tutorId: string;
  tutorName: string;
  subject: Subject;
  status: RequestStatus;
  createdAt: string;
}
