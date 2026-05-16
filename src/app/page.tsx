'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, getToken, redirectByRole } from '@/lib/auth';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const user = getUser();
    const token = getToken();
    if (user && token) {
      router.replace(redirectByRole(user.role));
    } else {
      router.replace('/login');
    }
  }, [router]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div style={{ width: 32, height: 32, border: '3px solid #7c6af7', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );
}
