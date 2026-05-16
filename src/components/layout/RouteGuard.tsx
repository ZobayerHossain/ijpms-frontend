'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, getToken, redirectByRole } from '@/lib/auth';
import { UserRole } from '@/types';
import { Spinner } from '@/components/ui';

interface Props {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export default function RouteGuard({ children, allowedRoles }: Props) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const user = getUser();
    const token = getToken();

    if (!user || !token) {
      router.replace('/login');
      return;
    }
    if (!allowedRoles.map(r => r.toLowerCase()).includes(user.role.toLowerCase())) {
      router.replace(redirectByRole(user.role));
      return;
    }
    setAuthorized(true);
  }, [router, allowedRoles]);

  if (!authorized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size={28} />
      </div>
    );
  }

  return <>{children}</>;
}
