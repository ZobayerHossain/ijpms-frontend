import { User } from '@/types';

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
};

export const getUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('user');
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
};

export const saveAuth = (token: string, user: User) => {
  localStorage.setItem('access_token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

export const clearAuth = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user');
};

export const isLoggedIn = (): boolean => !!getToken();

export const redirectByRole = (role: string): string => {
  switch (role.toLowerCase()) {
    case 'admin': return '/admin';
    case 'recruiter': return '/recruiter';
    case 'applicant': return '/applicant';
    default: return '/login';
  }
};
