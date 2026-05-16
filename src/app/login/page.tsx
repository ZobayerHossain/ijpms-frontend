'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Briefcase, Mail, Lock } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { redirectByRole } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      router.push(redirectByRole(user.role));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'radial-gradient(ellipse at 60% 0%, #7c6af720 0%, transparent 60%), #0a0a0f' }}>
      {/* Grid background */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(#1e1e2e 1px, transparent 1px), linear-gradient(90deg, #1e1e2e 1px, transparent 1px)',
        backgroundSize: '48px 48px',
        opacity: 0.3,
      }} />

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#7c6af7]/15 border border-[#7c6af7]/30 mb-4">
            <Briefcase size={22} className="text-[#7c6af7]" />
          </div>
          <h1 className="text-2xl font-bold text-[#e8e8f0] mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>
            Welcome back
          </h1>
          <p className="text-sm text-[#8888aa]">Sign in to IJPMS Portal</p>
        </div>

        {/* Form card */}
        <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-8 shadow-2xl shadow-black/40">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3a3a52] pointer-events-none mt-3" />
              <Input
                label="Email"
                type="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="pl-9"
                required
              />
            </div>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3a3a52] pointer-events-none mt-3" />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                className="pl-9"
                required
              />
            </div>

            {error && (
              <div className="bg-[#f05252]/10 border border-[#f05252]/30 rounded-lg px-4 py-2.5 text-sm text-[#f05252]">
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} size="lg" className="mt-2 w-full">
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-[#8888aa] mt-6">
            No account?{' '}
            <Link href="/register" className="text-[#7c6af7] hover:text-[#9580ff] font-medium transition-colors">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
