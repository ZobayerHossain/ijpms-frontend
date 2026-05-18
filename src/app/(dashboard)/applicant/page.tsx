'use client';
import { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/layout/Navbar';
import RouteGuard from '@/components/layout/RouteGuard';
import { Button, Card, Badge, StatusBadge, Spinner, Empty } from '@/components/ui';
import { positionsApi, applicationsApi } from '@/lib/api';
import { Position, Application } from '@/types';
import { Briefcase, Building2, Calendar, CheckCircle, X } from 'lucide-react';

export default function ApplicantDashboard() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [myApps, setMyApps] = useState<Application[]>([]);
  const [tab, setTab] = useState<'browse' | 'applied'>('browse');
  const [loadingPos, setLoadingPos] = useState(true);
  const [loadingApps, setLoadingApps] = useState(true);
  const [applying, setApplying] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const loadPositions = useCallback(async () => {
    try {
      const res = await positionsApi.getAll();
      // NestJS ইন্টারসেপ্টরের রেসপন্স থেকে মূল অ্যারেটি আনপ্যাক করা হচ্ছে
      setPositions(res.data.data || []);
    } catch {
      /* ignore */
      setPositions([]);
    } finally {
      setLoadingPos(false);
    }
  }, []);

  const loadMyApps = useCallback(async () => {
    try {
      const res = await applicationsApi.getMyApplications();
      // NestJS ইন্টারসেপ্টরের রেসপন্স থেকে মূল অ্যারেটি আনপ্যাক করা হচ্ছে
      setMyApps(res.data.data || []);
    } catch {
      /* ignore */
      setMyApps([]);
    } finally {
      setLoadingApps(false);
    }
  }, []);

  useEffect(() => {
    loadPositions();
    loadMyApps();
  }, [loadPositions, loadMyApps]);

  // Application has eager-loaded `position` object, not `positionId`
  const appliedIds = new Set(myApps.map((a) => a.position?.id).filter(Boolean) as string[]);

  const handleApply = async (positionId: string) => {
    setApplying(positionId);
    try {
      await applicationsApi.apply(positionId);
      showToast('Application submitted!');
      loadMyApps();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(null);
    }
  };

  const handleWithdraw = async (id: string) => {
    if (!confirm('Withdraw this application?')) return;
    try {
      await applicationsApi.withdraw(id);
      showToast('Application withdrawn');
      loadMyApps();
    } catch {
      showToast('Failed to withdraw');
    }
  };

  // Backend status values are lowercase
  const inReviewCount = myApps.filter((a) => a.status === 'pending').length;
  const canWithdraw = (status: string) => status === 'pending';

  return (
    <RouteGuard allowedRoles={['applicant']}>
      <div className="min-h-screen bg-[#0a0a0f]">
        <Navbar />

        {/* Toast */}
        {toast && (
          <div className="fixed top-4 right-4 z-50 bg-[#7c6af7] text-white text-sm px-4 py-2.5 rounded-xl shadow-lg">
            {toast}
          </div>
        )}

        <div className="max-w-5xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1
              className="text-2xl font-bold text-[#e8e8f0] mb-1"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              Job Portal
            </h1>
            <p className="text-sm text-[#8888aa]">
              Browse open positions and track your applications
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Open Positions', value: positions.length },
              { label: 'Applied', value: myApps.length },
              { label: 'In Review', value: inReviewCount },
            ].map((s) => (
              <Card key={s.label} className="text-center">
                <p
                  className="text-2xl font-bold text-[#7c6af7] mb-1"
                  style={{ fontFamily: 'Syne, sans-serif' }}
                >
                  {s.value}
                </p>
                <p className="text-xs text-[#8888aa]">{s.label}</p>
              </Card>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-[#111118] border border-[#1e1e2e] rounded-xl p-1 mb-6 w-fit">
            {(['browse', 'applied'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                  tab === t
                    ? 'bg-[#7c6af7] text-white'
                    : 'text-[#8888aa] hover:text-[#e8e8f0]'
                }`}
              >
                {t === 'browse' ? 'Browse Jobs' : `My Applications (${myApps.length})`}
              </button>
            ))}
          </div>

          {/* Browse Tab */}
          {tab === 'browse' && (
            <div className="space-y-3">
              {loadingPos ? (
                <div className="flex justify-center py-12">
                  <Spinner />
                </div>
              ) : positions.length === 0 ? (
                <Empty message="No open positions right now" />
              ) : Array.isArray(positions) ? (
                positions.map((pos) => (
                  <Card key={pos.id} className="hover:border-[#2e2e42] transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-lg bg-[#7c6af7]/10 border border-[#7c6af7]/20 flex items-center justify-center mt-0.5 shrink-0">
                            <Briefcase size={15} className="text-[#7c6af7]" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-[#e8e8f0] mb-1">{pos.title}</h3>
                            <div className="flex flex-wrap gap-3 mb-2">
                              <span className="flex items-center gap-1 text-xs text-[#8888aa]">
                                <Building2 size={11} />
                                {pos.company}
                              </span>
                              <span className="flex items-center gap-1 text-xs text-[#8888aa]">
                                <Calendar size={11} />
                                Deadline: {new Date(pos.deadline).toLocaleDateString()}
                              </span>
                              <span className="text-xs text-[#8888aa]">{pos.slots} slot(s)</span>
                            </div>
                            <p className="text-sm text-[#8888aa] line-clamp-2">
                              {pos.description}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="shrink-0">
                        {appliedIds.has(pos.id) ? (
                          <Badge variant="success">
                            <CheckCircle size={10} className="mr-1" />
                            Applied
                          </Badge>
                        ) : (
                          <Button
                            size="sm"
                            loading={applying === pos.id}
                            onClick={() => handleApply(pos.id)}
                          >
                            Apply Now
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-red-500 text-sm text-center">Invalid jobs data format.</div>
              )}
            </div>
          )}

          {/* My Applications Tab */}
          {tab === 'applied' && (
            <div className="space-y-3">
              {loadingApps ? (
                <div className="flex justify-center py-12">
                  <Spinner />
                </div>
              ) : myApps.length === 0 ? (
                <Empty message="You haven't applied to any position yet" />
              ) : Array.isArray(myApps) ? (
                myApps.map((app) => (
                  <Card key={app.id} className="hover:border-[#2e2e42] transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-[#e8e8f0] mb-1.5">
                          {app.position?.title ?? 'Position'}
                        </h3>
                        <div className="flex flex-wrap gap-2 items-center">
                          <StatusBadge status={app.status} />
                          {app.triageLevel && (
                            <Badge variant={app.triageLevel}>
                              {app.triageLevel.toUpperCase()} Priority
                            </Badge>
                          )}
                          {typeof app.interviewScore === 'number' && (
                            <Badge variant="default">Score: {app.interviewScore}</Badge>
                          )}
                          <span className="text-xs text-[#3a3a52]">
                            {new Date(app.appliedAt).toLocaleDateString()}
                          </span>
                        </div>
                        {app.notes && (
                          <p className="text-xs text-[#8888aa] mt-2 italic">"{app.notes}"</p>
                        )}
                      </div>
                      {canWithdraw(app.status) && (
                        <Button size="sm" variant="danger" onClick={() => handleWithdraw(app.id)}>
                          <X size={12} />
                          Withdraw
                        </Button>
                      )}
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-red-500 text-sm text-center">Invalid applications data format.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </RouteGuard>
  );
}