'use client';

import { useState, useEffect } from 'react';
import RouteGuard from '@/components/layout/RouteGuard';
import Navbar from '@/components/layout/Navbar';
import { Card, Badge, Empty, Spinner, StatusBadge } from '@/components/ui';
import { triageApi } from '@/lib/api';
import { Application, TriageData, TriageLevel } from '@/types';

export default function TriagePage() {
  const [data, setData] = useState<TriageData>({ high: [], medium: [], low: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetchTriage();
  }, []);

  const fetchTriage = async () => {
    setLoading(true);
    try {
      const res = await triageApi.getAll();
      setData(res.data || { high: [], medium: [], low: [] });
    } catch (err) {
      console.error('Failed to fetch triage:', err);
    } finally {
      setLoading(false);
    }
  };

  const total = data.high.length + data.medium.length + data.low.length;

  const renderColumn = (
    apps: Application[],
    level: TriageLevel,
    emoji: string,
    title: string,
    rangeLabel: string,
    accentColor: string,
  ) => (
    <div className="flex-1 min-w-0">
      {/* Column Header */}
      <div
        className="rounded-xl border p-4 mb-4"
        style={{
          backgroundColor: `${accentColor}10`,
          borderColor: `${accentColor}40`,
        }}
      >
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">{emoji}</span>
            <h2 className="font-semibold text-[#e8e8f0]">{title}</h2>
          </div>
          <Badge variant={level}>{apps.length}</Badge>
        </div>
        <p className="text-xs text-[#8888aa]">{rangeLabel}</p>
      </div>

      {/* Applications */}
      <div className="space-y-3">
        {apps.length === 0 ? (
          <div className="text-center py-8 text-[#3a3a52] text-sm">
            No applications in this priority
          </div>
        ) : (
          apps.map((app) => (
            <Card key={app.id} className="hover:border-[#2e2e42] transition-colors">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-[#e8e8f0] truncate">
                    {app.applicant?.fullName ?? 'Applicant'}
                  </h3>
                  <p className="text-xs text-[#8888aa] truncate">
                    {app.applicant?.email}
                  </p>
                </div>
                <StatusBadge status={app.status} />
              </div>

              <div className="border-t border-[#1e1e2e] pt-2 mt-2">
                <p className="text-sm text-[#e8e8f0] truncate">
                  {app.position?.title ?? 'Position'}
                </p>
                <p className="text-xs text-[#8888aa] truncate">
                  {app.position?.company}
                </p>
              </div>

              <div className="flex items-center justify-between mt-3 text-xs">
                {typeof app.interviewScore === 'number' ? (
                  <Badge variant={level}>Score: {app.interviewScore}</Badge>
                ) : (
                  <span className="text-[#3a3a52]">No score yet</span>
                )}
                <span className="text-[#3a3a52]">
                  {new Date(app.appliedAt).toLocaleDateString()}
                </span>
              </div>

              {app.notes && (
                <p className="text-xs text-[#8888aa] italic mt-2 line-clamp-2">
                  "{app.notes}"
                </p>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );

  return (
    <RouteGuard allowedRoles={['recruiter', 'admin']}>
      <div className="min-h-screen bg-[#0a0a0f]">
        <Navbar />

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1
              className="text-2xl font-bold text-[#e8e8f0] mb-1"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              Triage Board
            </h1>
            <p className="text-sm text-[#8888aa]">
              Applications prioritized by interview performance ({total} total)
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Spinner size={28} />
            </div>
          ) : total === 0 ? (
            <Card>
              <Empty message="No applications to triage yet." />
            </Card>
          ) : (
            <div className="flex flex-col lg:flex-row gap-6">
              {renderColumn(
                data.high,
                'high',
                '🟢',
                'High Priority',
                'Score 80+ — Top candidates',
                '#10b981',
              )}
              {renderColumn(
                data.medium,
                'medium',
                '🟡',
                'Medium Priority',
                'Score 50–79 — Review needed',
                '#f59e0b',
              )}
              {renderColumn(
                data.low,
                'low',
                '🔴',
                'Low Priority',
                'Score 0–49 — Below threshold',
                '#ef4444',
              )}
            </div>
          )}
        </div>
      </div>
    </RouteGuard>
  );
}