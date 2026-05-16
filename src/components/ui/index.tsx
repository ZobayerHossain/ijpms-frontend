'use client';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

// ─── Button ──────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export function Button({
  variant = 'primary', size = 'md', loading, children, className, disabled, ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-[#7c6af7] hover:bg-[#9580ff] text-white shadow-lg shadow-[#7c6af7]/20',
    secondary: 'bg-[#1e1e2e] hover:bg-[#2a2a3e] text-[#e8e8f0] border border-[#2e2e42]',
    danger: 'bg-[#f05252]/10 hover:bg-[#f05252]/20 text-[#f05252] border border-[#f05252]/30',
    ghost: 'hover:bg-[#1e1e2e] text-[#8888aa] hover:text-[#e8e8f0]',
  };
  const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2 text-sm', lg: 'px-6 py-3 text-base' };

  return (
    <button className={clsx(base, variants[variant], sizes[size], className)} disabled={disabled || loading} {...props}>
      {loading && <Loader2 size={14} className="animate-spin" />}
      {children}
    </button>
  );
}

// ─── Input ───────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-[#8888aa]">{label}</label>}
      <input
        className={clsx(
          'w-full bg-[#111118] border border-[#1e1e2e] rounded-lg px-3 py-2.5 text-sm text-[#e8e8f0]',
          'placeholder:text-[#3a3a52] outline-none',
          'focus:border-[#7c6af7] focus:ring-1 focus:ring-[#7c6af7]/30 transition-all',
          error && 'border-[#f05252]',
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-[#f05252]">{error}</span>}
    </div>
  );
}

// ─── Textarea ────────────────────────────────────────────
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className, ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-[#8888aa]">{label}</label>}
      <textarea
        className={clsx(
          'w-full bg-[#111118] border border-[#1e1e2e] rounded-lg px-3 py-2.5 text-sm text-[#e8e8f0]',
          'placeholder:text-[#3a3a52] outline-none resize-none',
          'focus:border-[#7c6af7] focus:ring-1 focus:ring-[#7c6af7]/30 transition-all',
          error && 'border-[#f05252]',
          className
        )}
        rows={4}
        {...props}
      />
      {error && <span className="text-xs text-[#f05252]">{error}</span>}
    </div>
  );
}

// ─── Select ──────────────────────────────────────────────
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, options, className, ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-[#8888aa]">{label}</label>}
      <select
        className={clsx(
          'w-full bg-[#111118] border border-[#1e1e2e] rounded-lg px-3 py-2.5 text-sm text-[#e8e8f0]',
          'outline-none focus:border-[#7c6af7] transition-all cursor-pointer',
          className
        )}
        {...props}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

// ─── Card ────────────────────────────────────────────────
export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={clsx('bg-[#111118] border border-[#1e1e2e] rounded-xl p-5', className)}>
      {children}
    </div>
  );
}

// ─── Badge ───────────────────────────────────────────────
type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'high' | 'medium' | 'low';

export function Badge({ children, variant = 'default' }: { children: React.ReactNode; variant?: BadgeVariant }) {
  const variants: Record<BadgeVariant, string> = {
    default: 'bg-[#1e1e2e] text-[#8888aa]',
    success: 'bg-[#22d3a0]/10 text-[#22d3a0] border border-[#22d3a0]/30',
    warning: 'bg-[#f5a623]/10 text-[#f5a623] border border-[#f5a623]/30',
    danger: 'bg-[#f05252]/10 text-[#f05252] border border-[#f05252]/30',
    high: 'bg-[#ef4444]/15 text-[#ef4444] border border-[#ef4444]/40',
    medium: 'bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/40',
    low: 'bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/40',
  };
  return (
    <span className={clsx('inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium', variants[variant])}>
      {children}
    </span>
  );
}

// ─── Spinner ─────────────────────────────────────────────
export function Spinner({ size = 20 }: { size?: number }) {
  return <Loader2 size={size} className="animate-spin text-[#7c6af7]" />;
}

// ─── Empty State ─────────────────────────────────────────
export function Empty({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-[#3a3a52]">
      <div className="text-4xl mb-3">∅</div>
      <p className="text-sm">{message}</p>
    </div>
  );
}

// ─── Status Badge helper ─────────────────────────────────
export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, BadgeVariant> = {
    PENDING: 'default',
    REVIEWING: 'warning',
    INTERVIEW: 'warning',
    OFFERED: 'success',
    REJECTED: 'danger',
    WITHDRAWN: 'danger',
  };
  return <Badge variant={map[status] ?? 'default'}>{status}</Badge>;
}
