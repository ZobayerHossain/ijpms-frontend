'use client';
import { useState, useEffect } from 'react';
import { User } from '@/types';
import { getUser, getToken, saveAuth, clearAuth } from '@/lib/auth';
import { authApi } from '@/lib/api';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const u = getUser();
    const t = getToken();
    if (u && t) setUser(u);
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    const { access_token, user } = res.data;
    saveAuth(access_token, user);
    setUser(user);
    return user;
  };

  const register = async (name: string, email: string, password: string, role: string) => {
    const res = await authApi.register(name, email, password, role);
    const { access_token, user } = res.data;
    saveAuth(access_token, user);
    setUser(user);
    return user;
  };

  const logout = () => {
    clearAuth();
    setUser(null);
    router.push('/login');
  };

  return { user, loading, login, register, logout };
}
