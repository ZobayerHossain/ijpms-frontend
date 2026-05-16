'use client';

import { useState, useEffect } from 'react';
import RouteGuard from '@/components/layout/RouteGuard';
import Navbar from '@/components/layout/Navbar';
import {
  Button,
  Card,
  Badge,
  Empty,
  Spinner,
  StatusBadge,
} from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import api, { positionsApi, triageApi, usersApi } from '@/lib/api';
import { Position, Application, User, TriageData } from '@/types';

type Tab = 'overview' | 'positions' | 'applications' | 'users';

export default function AdminPanel() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>('overview');

  const [positions, setPositions] = useState<Position[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchPositions(), fetchApplications(), fetchUsers()]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPositions = async () => {
    try {
      const res = await positionsApi.getAll();
      setPositions(res.data || []);
    } catch (err) {
      console.error('Failed to fetch positions:', err);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await triageApi.getAll();
      const data: TriageData = res.data || { high: [], medium: [], low: [] };
      const flat: Application[] = [
        ...(data.high || []).map((a) => ({ ...a, triageLevel: 'high' as const })),
        ...(data.medium || []).map((a) => ({ ...a, triageLevel: 'medium' as const })),
        ...(data.low || []).map((a) => ({ ...a, triageLevel: 'low' as const })),
      ];
      setApplications(flat);
    } catch (err) {
      console.error('Failed to fetch applications:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await usersApi.getAll();
      setUsers(res.data || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const handleDeletePosition = async (id: string) => {
    if (!confirm('Delete this position? This cannot be undone.')) return;
    try {
      await positionsApi.delete(id);
      await fetchPositions();
      await fetchApplications();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to delete position');
    }
  };

  const handleDeleteApplication = async (id: string) => {
    if (!confirm('Delete this application? This cannot be undone.')) return;
    try {
      await api.delete(`/applications/${id}`);
      await fetchApplications();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to delete application');
    }
  };

  const handleDeleteUser = async (id: string, fullName: string) => {
    if (!confirm(`Delete user "${fullName}"? This cannot be undone.`)) return;
    try {
      await usersApi.deleteUser(id);
      await fetchUsers();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to delete user');
    }
  };

  // ─── Stats ───────────────────────────────────────────────
  const stats = {
    positions: positions.length,
    applications: applications.length,
    users: users.length,
    applicants: users.filter((u) => u.role === 'applicant').length,
    recruiters: users.filter((u) => u.role === 'recruiter').length,
    admins: users.filter((u) => u.role === 'admin').length,
    pending: applications.filter((a) => a.status === 'pending').length,
    selected: applications.filter((a) => a.status === 'selected').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
  };

  const roleBadgeVariant = (role: string) => {
    if (role === 'admin') return 'danger';
    if (role === 'recruiter') return 'warning';
    return 'success';
  };

  return (
    <RouteGuard allowedRoles={['admin']}>
      <div className="min-h-screen bg-[#0a0a0f]">
        <Navbar />

        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1
              className="text-2xl font-bold text-[#e8e8f0] mb-1"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              Admin Panel
            </h1>
            <p className="text-sm text-[#8888aa]">
              Welcome{user?.fullName ? `, ${user.fullName}` : ''}. Full system control.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-[#111118] border border-[#1e1e2e] rounded-xl p-1 mb-6 w-fit flex-wrap">
            {(['overview', 'positions', 'applications', 'users'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                  tab === t
                    ? 'bg-[#7c6af7] text-white'
                    : 'text-[#8888aa] hover:text-[#e8e8f0]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Spinner size={28} />
            </div>
          ) : (
            <>
              {/* OVERVIEW */}
              {tab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { label: 'Total Positions', value: stats.positions },
                      { label: 'Total Applications', value: stats.applications },
                      { label: 'Total Users', value: stats.users },
                      { label: 'Applicants', value: stats.applicants },
                      { label: 'Recruiters', value: stats.recruiters },
                      { label: 'Admins', value: stats.admins },
                    ].map((s) => (
                      <Card key={s.label} className="text-center">
                        <p
                          className="text-3xl font-bold text-[#7c6af7] mb-1"
                          style={{ fontFamily: 'Syne, sans-serif' }}
                        >
                          {s.value}
                        </p>
                        <p className="text-xs text-[#8888aa]">{s.label}</p>
                      </Card>
                    ))}
                  </div>

                  <Card>
                    <h3 className="font-semibold text-[#e8e8f0] mb-4">
                      Application Status Breakdown
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-[#8888aa]">{stats.pending}</p>
                        <p className="text-xs text-[#8888aa] mt-1">Pending</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-[#22d3a0]">{stats.selected}</p>
                        <p className="text-xs text-[#8888aa] mt-1">Selected</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-[#f05252]">{stats.rejected}</p>
                        <p className="text-xs text-[#8888aa] mt-1">Rejected</p>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* POSITIONS */}
              {tab === 'positions' && (
                <div className="space-y-3">
                  {positions.length === 0 ? (
                    <Card>
                      <Empty message="No positions in the system." />
                    </Card>
                  ) : (
                    positions.map((p) => (
                      <Card key={p.id}>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-[#e8e8f0] truncate">
                              {p.title}
                            </h3>
                            <p className="text-sm text-[#8888aa] mb-2">{p.company}</p>
                            <p className="text-sm text-[#e8e8f0] line-clamp-2 mb-2">
                              {p.description}
                            </p>
                            <div className="flex flex-wrap gap-2 items-center text-xs text-[#8888aa]">
                              <span>Deadline: {new Date(p.deadline).toLocaleDateString()}</span>
                              <span>•</span>
                              <span>{p.slots} slots</span>
                              {p.recruiter && (
                                <>
                                  <span>•</span>
                                  <span>By: {p.recruiter.fullName}</span>
                                </>
                              )}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDeletePosition(p.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              )}

              {/* APPLICATIONS */}
              {tab === 'applications' && (
                <div className="space-y-3">
                  {applications.length === 0 ? (
                    <Card>
                      <Empty message="No applications in the system." />
                    </Card>
                  ) : (
                    applications.map((a) => (
                      <Card key={a.id}>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                              <h3 className="font-semibold text-[#e8e8f0]">
                                {a.applicant?.fullName ?? 'Applicant'}
                              </h3>
                              <Badge variant={a.triageLevel}>
                                {a.triageLevel.toUpperCase()}
                              </Badge>
                              <StatusBadge status={a.status} />
                              {typeof a.interviewScore === 'number' && (
                                <Badge variant="default">Score: {a.interviewScore}</Badge>
                              )}
                            </div>
                            <p className="text-sm text-[#8888aa] mb-1">
                              {a.applicant?.email}
                            </p>
                            <p className="text-sm text-[#e8e8f0]">
                              Applied to:{' '}
                              <span className="font-medium">
                                {a.position?.title ?? 'Position'}
                              </span>{' '}
                              <span className="text-[#8888aa]">({a.position?.company})</span>
                            </p>
                            <p className="text-xs text-[#3a3a52] mt-1">
                              {new Date(a.appliedAt).toLocaleDateString()}
                            </p>
                            {a.notes && (
                              <p className="text-xs text-[#8888aa] italic mt-2">
                                "{a.notes}"
                              </p>
                            )}
                          </div>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDeleteApplication(a.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              )}

              {/* USERS */}
              {tab === 'users' && (
                <div className="space-y-3">
                  {users.length === 0 ? (
                    <Card>
                      <Empty message="No users in the system." />
                    </Card>
                  ) : (
                    users.map((u) => (
                      <Card key={u.id}>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h3 className="font-semibold text-[#e8e8f0]">
                                {u.fullName}
                              </h3>
                              <Badge variant={roleBadgeVariant(u.role)}>
                                {u.role.toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-sm text-[#8888aa]">{u.email}</p>
                            {u.department && (
                              <p className="text-xs text-[#3a3a52] mt-1">
                                Dept: {u.department}
                              </p>
                            )}
                          </div>
                          {u.id !== user?.id && (
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => handleDeleteUser(u.id, u.fullName)}
                            >
                              Delete
                            </Button>
                          )}
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </RouteGuard>
  );
}