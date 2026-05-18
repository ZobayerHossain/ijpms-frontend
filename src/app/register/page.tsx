'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Briefcase, Eye, EyeOff } from 'lucide-react'; // Imported Eye icons
import { Button, Input, Select } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { redirectByRole } from '@/lib/auth';

const ROLE_OPTIONS = [
  { value: 'APPLICANT', label: 'Applicant — Looking for a job' },
  { value: 'RECRUITER', label: 'Recruiter — Hiring talent' },
];

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: 'APPLICANT' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); // State for success message
  const [loading, setLoading] = useState(false);

  // States for toggling password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    
    try {
      const user = await register(form.name, form.email, form.password, form.role);
      
      // Set success message and allow 2 seconds before redirecting
      setSuccess('Registration successful! Redirecting to dashboard...');
      
      setTimeout(() => {
        // Safeguard role extraction in case NestJS wrapper nests the payload
        const targetRole = user?.role || user?.data?.role || form.role;
        router.push(redirectByRole(targetRole));
      }, 2000);

    } catch (err: any) {
      // Unwrapping the message from NestJS exception layer or fallback
      setError(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      // Keep loading spinner active if registration was successful during redirect timeout
      if (!success) setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: 'radial-gradient(ellipse at 40% 0%, #22d3a015 0%, transparent 60%), #0a0a0f' }}>
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(#1e1e2e 1px, transparent 1px), linear-gradient(90deg, #1e1e2e 1px, transparent 1px)',
        backgroundSize: '48px 48px',
        opacity: 0.3,
      }} />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#22d3a0]/10 border border-[#22d3a0]/30 mb-4">
            <Briefcase size={22} className="text-[#22d3a0]" />
          </div>
          <h1 className="text-2xl font-bold text-[#e8e8f0] mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>
            Create account
          </h1>
          <p className="text-sm text-[#8888aa]">Join IJPMS Portal</p>
        </div>

        <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-8 shadow-2xl shadow-black/40">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input label="Full Name" placeholder="John Doe" value={form.name} onChange={set('name')} required />
            <Input label="Email" type="email" placeholder="you@company.com" value={form.email} onChange={set('email')} required />
            <Select label="I am a..." options={ROLE_OPTIONS} value={form.role} onChange={set('role')} />
            
            {/* Password input with visibility toggle */}
            <div className="relative w-full">
              <Input 
                label="Password" 
                type={showPassword ? 'text' : 'password'} 
                placeholder="Min. 6 characters" 
                value={form.password} 
                onChange={set('password')} 
                required 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 bottom-3 text-[#8888aa] hover:text-[#e8e8f0] transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Confirm Password input with visibility toggle */}
            <div className="relative w-full">
              <Input 
                label="Confirm Password" 
                type={showConfirmPassword ? 'text' : 'password'} 
                placeholder="Repeat password" 
                value={form.confirm} 
                onChange={set('confirm')} 
                required 
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 bottom-3 text-[#8888aa] hover:text-[#e8e8f0] transition-colors focus:outline-none"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Error message box */}
            {error && (
              <div className="bg-[#f05252]/10 border border-[#f05252]/30 rounded-lg px-4 py-2.5 text-sm text-[#f05252]">
                {error}
              </div>
            )}

            {/* Success message box */}
            {success && (
              <div className="bg-[#22d3a0]/10 border border-[#22d3a0]/30 rounded-lg px-4 py-2.5 text-sm text-[#22d3a0]">
                {success}
              </div>
            )}

            <Button type="submit" loading={loading || !!success} size="lg" className="mt-2 w-full bg-[#22d3a0] hover:bg-[#1ab98a] shadow-[#22d3a0]/20 text-black font-semibold">
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-[#8888aa] mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-[#7c6af7] hover:text-[#9580ff] font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}