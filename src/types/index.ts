export type UserRole = 'applicant' | 'recruiter' | 'admin';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  department?: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface Position {
  id: string;
  title: string;
  company: string;
  description: string;
  deadline: string;
  slots: number;
  recruiter?: User;
  createdAt: string;
  updatedAt?: string;
}

export type ApplicationStatus = 'pending' | 'selected' | 'rejected' | 'waitlisted';
export type TriageLevel = 'high' | 'medium' | 'low';

export interface Application {
  id: string;
  applicant?: User;
  position?: Position;
  status: ApplicationStatus;
  triageLevel: TriageLevel;
  interviewScore?: number;
  notes?: string;
  appliedAt: string;
  updatedAt?: string;
}

export interface TriageData {
  high: Application[];
  medium: Application[];
  low: Application[];
}