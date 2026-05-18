'use client';
import { useState } from 'react';
import { X, Link2, FileText, Globe } from 'lucide-react'; // Swapped Github out for Globe
import { Button, Input } from '@/components/ui';

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { resumeUrl: string; githubUrl: string; coverLetter: string }) => Promise<void>;
  positionTitle: string;
  positionCompany: string;
}

export default function ApplyModal({ isOpen, onClose, onSubmit, positionTitle, positionCompany }: ApplyModalProps) {
  const [form, setForm] = useState({ resumeUrl: '', githubUrl: '', coverLetter: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onSubmit(form);
      setForm({ resumeUrl: '', githubUrl: '', coverLetter: '' }); 
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-[#111118] border border-[#1e1e2e] rounded-2xl p-6 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-[#e8e8f0]">Apply for Position</h3>
            <p className="text-xs text-[#8888aa] mt-0.5">{positionTitle} — <span className="text-[#22d3a0]">{positionCompany}</span></p>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="text-[#8888aa] hover:text-[#e8e8f0] p-1.5 rounded-lg hover:bg-[#1e1e2e] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Error Flag */}
        {error && (
          <div className="bg-[#f05252]/10 border border-[#f05252]/30 rounded-lg px-4 py-2.5 text-sm text-[#f05252] mb-4">
            {error}
          </div>
        )}

        {/* Application Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-[#8888aa] mb-1.5 flex items-center gap-1.5">
              <FileText size={14} className="text-[#22d3a0]" /> Resume Link (PDF URL / Drive Link)
            </label>
            <Input
              placeholder="https://drive.google.com/file/d/.../view"
              value={form.resumeUrl}
              onChange={(e) => setForm({ ...form, resumeUrl: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#8888aa] mb-1.5 flex items-center gap-1.5">
              <Globe size={14} className="text-[#7c6af7]" /> GitHub / Portfolio URL
            </label>
            <Input
              placeholder="https://github.com/your-profile"
              value={form.githubUrl}
              onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#8888aa] mb-1.5 flex items-center gap-1.5">
              <Link2 size={14} className="text-[#8888aa]" /> Cover Letter / Brief Pitch
            </label>
            <textarea
              rows={4}
              placeholder="Introduce yourself to the hiring team..."
              value={form.coverLetter}
              onChange={(e) => setForm({ ...form, coverLetter: e.target.value })}
              className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-xl px-3.5 py-2.5 text-sm text-[#e8e8f0] placeholder-[#444455] focus:outline-none focus:border-[#22d3a0] transition-colors resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" loading={loading} className="bg-[#22d3a0] hover:bg-[#1ab98a] text-black font-medium px-6">
              Submit Application
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
}