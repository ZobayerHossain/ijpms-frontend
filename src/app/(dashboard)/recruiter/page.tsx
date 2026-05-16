'use client';

import { useState, useEffect } from 'react';
import RouteGuard from '@/components/layout/RouteGuard';
import Navbar from '@/components/layout/Navbar';
import {
  Button,
  Card,
  Input,
  Textarea,
  Select,
  Badge,
  Empty,
  Spinner,
  StatusBadge,
} from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { positionsApi, triageApi } from '@/lib/api';
import api from '@/lib/api';
import {
  Position,
  Application,
  ApplicationStatus,
  TriageData,
  TriageLevel,
} from '@/types';

interface ResultFormState {
  status: ApplicationStatus;
  interviewScore: number;
  notes: string;
}

export default function RecruiterDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'list' | 'post'>('list');

  const [positions, setPositions] = useState<Position[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    title: '',
    company: '',
    description: '',
    deadline: '',
    slots: 1,
  });

  const [resultForms, setResultForms] = useState<Record<string, ResultFormState>>({});

  useEffect(() => {
    void loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAll = async () => {
    setLoadingData(true);
    try {
      await Promise.all([fetchPositions(), fetchAllApplications()]);
    } finally {
      setLoadingData(false);
    }
  };

  const fetchPositions = async () => {
    try {
      const res = await positionsApi.getAll();
      const all: Position[] = res.data || [];
      const mine = user
        ? all.filter((p) => !p.recruiter || p.recruiter.id === user.id)
        : all;
      setPositions(mine);
    } catch (err) {
      console.error('Failed to fetch positions:', err);
    }
  };

  const fetchAllApplications = async () => {
    try {
      const res = await triageApi.getAll();
      const data: TriageData = res.data || { high: [], medium: [], low: [] };
      const flat: Application[] = [
        ...(data.high || []).map((a) => ({ ...a, triageLevel: 'high' as TriageLevel })),
        ...(data.medium || []).map((a) => ({ ...a, triageLevel: 'medium' as TriageLevel })),
        ...(data.low || []).map((a) => ({ ...a, triageLevel: 'low' as TriageLevel })),
      ];
      setApplications(flat);
    } catch (err) {
      console.error('Failed to fetch applications:', err);
    }
  };

  const handlePostPosition = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setPosting(true);
    try {
      await positionsApi.create({
        title: form.title.trim(),
        company: form.company.trim(),
        description: form.description.trim(),
        deadline: form.deadline,
        slots: Number(form.slots),
      });
      setSuccess('Position posted successfully!');
      setForm({ title: '', company: '', description: '', deadline: '', slots: 1 });
      await fetchPositions();
      setTimeout(() => {
        setSuccess('');
        setActiveTab('list');
      }, 1000);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to post position');
    } finally {
      setPosting(false);
    }
  };

  const handleDeletePosition = async (id: string) => {
    if (!confirm('Delete this position? This cannot be undone.')) return;
    try {
      await positionsApi.delete(id);
      await fetchPositions();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to delete position');
    }
  };

  const handleUpdateResult = async (applicationId: string) => {
    const rf = resultForms[applicationId];
    if (!rf) return;
    if (rf.interviewScore < 0 || rf.interviewScore > 100) {
      alert('Score must be between 0 and 100');
      return;
    }
    try {
      await api.patch(`/applications/${applicationId}/result`, {
        status: rf.status,
        interviewScore: Number(rf.interviewScore),
        notes: rf.notes,
      });
      await fetchAllApplications();
      alert('Result saved!');
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to update result');
    }
  };

  const appsForPosition = (positionId: string) =>
    applications.filter((a) => a.position?.id === positionId);

  const getRfFor = (app: Application): ResultFormState =>
    resultForms[app.id] ?? {
      status: app.status,
      interviewScore: app.interviewScore ?? 0,
      notes: app.notes ?? '',
    };

  const updateRf = (app: Application, patch: Partial<ResultFormState>) => {
    setResultForms((prev) => ({
      ...prev,
      [app.id]: { ...getRfFor(app), ...prev[app.id], ...patch },
    }));
  };

  return (
    <RouteGuard allowedRoles={['recruiter']}>
      <div className="min-h-screen bg-[#0a0a0f]">
        <Navbar />

        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1
              className="text-2xl font-bold text-[#e8e8f0] mb-1"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              Recruiter Dashboard
            </h1>
            <p className="text-sm text-[#8888aa]">
              Welcome{user?.fullName ? `, ${user.fullName}` : ''}. Manage your positions and applicants.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-[#111118] border border-[#1e1e2e] rounded-xl p-1 mb-6 w-fit">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'list'
                  ? 'bg-[#7c6af7] text-white'
                  : 'text-[#8888aa] hover:text-[#e8e8f0]'
              }`}
            >
              My Positions ({positions.length})
            </button>
            <button
              onClick={() => setActiveTab('post')}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'post'
                  ? 'bg-[#7c6af7] text-white'
                  : 'text-[#8888aa] hover:text-[#e8e8f0]'
              }`}
            >
              + Post New Position
            </button>
          </div>

          {loadingData ? (
            <div className="flex justify-center py-20">
              <Spinner size={28} />
            </div>
          ) : (
            <>
              {/* POST FORM */}
              {activeTab === 'post' && (
                <Card>
                  <h2 className="text-lg font-semibold text-[#e8e8f0] mb-4">Post New Position</h2>

                  {error && (
                    <div className="bg-[#f05252]/10 border border-[#f05252]/40 text-[#f05252] px-3 py-2 rounded-lg text-sm mb-4">
                      {error}
                    </div>
                  )}
                  {success && (
                    <div className="bg-[#22d3a0]/10 border border-[#22d3a0]/40 text-[#22d3a0] px-3 py-2 rounded-lg text-sm mb-4">
                      {success}
                    </div>
                  )}

                  <form onSubmit={handlePostPosition} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Position Title"
                        required
                        placeholder="e.g. Frontend Developer Intern"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                      />
                      <Input
                        label="Company"
                        required
                        placeholder="e.g. Acme Corp"
                        value={form.company}
                        onChange={(e) => setForm({ ...form, company: e.target.value })}
                      />
                    </div>

                    <Textarea
                      label="Description"
                      required
                      rows={5}
                      placeholder="Role, responsibilities, requirements..."
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Application Deadline"
                        type="date"
                        required
                        value={form.deadline}
                        onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                      />
                      <Input
                        label="Number of Slots"
                        type="number"
                        required
                        min={1}
                        value={form.slots}
                        onChange={(e) => setForm({ ...form, slots: Number(e.target.value) })}
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button type="submit" loading={posting}>
                        Post Position
                      </Button>
                      <Button type="button" variant="secondary" onClick={() => setActiveTab('list')}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Card>
              )}

              {/* POSITIONS LIST */}
              {activeTab === 'list' && (
                <div className="space-y-4">
                  {positions.length === 0 ? (
                    <Card>
                      <Empty message="You haven't posted any positions yet." />
                      <div className="flex justify-center">
                        <Button onClick={() => setActiveTab('post')}>
                          Post Your First Position
                        </Button>
                      </div>
                    </Card>
                  ) : (
                    positions.map((position) => {
                      const apps = appsForPosition(position.id);
                      const isExpanded = expandedId === position.id;

                      return (
                        <Card key={position.id}>
                          <div className="flex items-start justify-between mb-2 gap-4">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-semibold text-[#e8e8f0] truncate">
                                {position.title}
                              </h3>
                              <p className="text-sm text-[#8888aa]">{position.company}</p>
                            </div>
                            <div className="flex gap-2 items-center flex-shrink-0">
                              <Badge variant="default">{position.slots} slots</Badge>
                              <Badge variant="default">{apps.length} applicants</Badge>
                            </div>
                          </div>

                          <p className="text-sm text-[#e8e8f0] mb-3 line-clamp-2">
                            {position.description}
                          </p>

                          <div className="text-xs text-[#8888aa] mb-4">
                            Deadline: {new Date(position.deadline).toLocaleDateString()}
                          </div>

                          <div className="flex gap-2 flex-wrap">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => setExpandedId(isExpanded ? null : position.id)}
                            >
                              {isExpanded ? 'Hide Applicants' : `View Applicants (${apps.length})`}
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDeletePosition(position.id)}
                            >
                              Delete
                            </Button>
                          </div>

                          {isExpanded && (
                            <div className="mt-6 border-t border-[#1e1e2e] pt-4 space-y-3">
                              <h4 className="font-semibold text-[#e8e8f0]">Applicants</h4>
                              {apps.length === 0 ? (
                                <Empty message="No applicants yet." />
                              ) : (
                                apps.map((app) => {
                                  const rf = getRfFor(app);
                                  return (
                                    <div
                                      key={app.id}
                                      className="bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg p-4"
                                    >
                                      <div className="flex items-start justify-between mb-3 gap-3 flex-wrap">
                                        <div className="min-w-0">
                                          <p className="font-medium text-[#e8e8f0] truncate">
                                            {app.applicant?.fullName ?? 'Applicant'}
                                          </p>
                                          <p className="text-sm text-[#8888aa] truncate">
                                            {app.applicant?.email}
                                          </p>
                                        </div>
                                        <div className="flex gap-2 items-center">
                                          <Badge variant={app.triageLevel}>
                                            {app.triageLevel.toUpperCase()}
                                          </Badge>
                                          <StatusBadge status={rf.status} />
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                        <Select
                                          label="Status"
                                          value={rf.status}
                                          onChange={(e) =>
                                            updateRf(app, {
                                              status: e.target.value as ApplicationStatus,
                                            })
                                          }
                                          options={[
                                            { value: 'pending', label: 'Pending' },
                                            { value: 'selected', label: 'Selected' },
                                            { value: 'rejected', label: 'Rejected' },
                                            { value: 'waitlisted', label: 'Waitlisted' },
                                          ]}
                                        />
                                        <Input
                                          label="Interview Score (0-100)"
                                          type="number"
                                          min={0}
                                          max={100}
                                          value={rf.interviewScore}
                                          onChange={(e) =>
                                            updateRf(app, {
                                              interviewScore: Number(e.target.value),
                                            })
                                          }
                                        />
                                      </div>

                                      <div className="mb-3">
                                        <Textarea
                                          label="Notes"
                                          rows={2}
                                          placeholder="Interview feedback..."
                                          value={rf.notes}
                                          onChange={(e) => updateRf(app, { notes: e.target.value })}
                                        />
                                      </div>

                                      <Button size="sm" onClick={() => handleUpdateResult(app.id)}>
                                        Save Result
                                      </Button>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          )}
                        </Card>
                      );
                    })
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