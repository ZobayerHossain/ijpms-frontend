'use client';
import { useRouter } from 'next/navigation';
import { LogOut, User, Briefcase } from 'lucide-react';
import { clearAuth, getUser } from '@/lib/auth';

export default function Navbar() {
  const router = useRouter();
  const user = getUser();

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  const roleColors: Record<string, string> = {
    ADMIN: '#f5a623',
    RECRUITER: '#7c6af7',
    APPLICANT: '#22d3a0',
  };

  return (
    <nav className="border-b border-[#1e1e2e] bg-[#0a0a0f]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Briefcase size={18} className="text-[#7c6af7]" />
          <span className="font-bold text-[#e8e8f0]" style={{ fontFamily: 'Syne, sans-serif' }}>
            IJPMS
          </span>
        </div>

        {/* User info */}
        {user && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#1e1e2e] border border-[#2e2e42] flex items-center justify-center">
                <User size={13} className="text-[#8888aa]" />
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-medium text-[#e8e8f0]">{user.name}</p>
                <p className="text-[10px]" style={{ color: roleColors[user.role] ?? '#8888aa' }}>
                  {user.role}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[#8888aa] hover:text-[#f05252] hover:bg-[#f05252]/10 transition-all"
            >
              <LogOut size={13} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
