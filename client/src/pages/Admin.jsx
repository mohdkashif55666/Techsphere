import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import PageShell from '../components/layout/PageShell';
import ButtonPrimary from '../components/ui/ButtonPrimary';
import { useAuthStore } from '../store/authStore';
import { Shield, Trash2, CheckCircle, BarChart3, Database, Wrench, Star } from 'lucide-react';

export default function Admin() {
  const { user } = useAuthStore();
  const [tab, setTab] = useState('analytics');

  // Analytics query
  const { data: analyticsData } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: () => api.get('/admin/analytics'),
    enabled: user?.role === 'admin',
  });

  // Tools query
  const { data: toolsData, refetch: refetchTools } = useQuery({
    queryKey: ['admin-tools'],
    queryFn: () => api.get('/admin/tools'),
    enabled: user?.role === 'admin' && tab === 'tools',
  });

  // Reviews query
  const { data: reviewsData, refetch: refetchReviews } = useQuery({
    queryKey: ['admin-reviews'],
    queryFn: () => api.get('/admin/reviews'),
    enabled: user?.role === 'admin' && tab === 'reviews',
  });

  // Delete tool mutation
  const deleteToolMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/tools/${id}`),
    onSuccess: () => refetchTools(),
  });

  // Approve review mutation
  const approveReviewMutation = useMutation({
    mutationFn: (id) => api.put(`/admin/reviews/${id}/approve`),
    onSuccess: () => refetchReviews(),
  });

  if (!user || user.role !== 'admin') {
    return (
      <PageShell>
        <div className="max-w-md mx-auto my-auto text-center py-16">
          <Shield className="w-8 h-8 text-red-500 mx-auto mb-3" />
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-xs text-muted mb-6">
            Administrator privileges are required to view this panel.
          </p>
          <Link to="/" className="btn-google-primary px-5 py-2.5 rounded-full text-xs font-medium">
            Return Home
          </Link>
        </div>
      </PageShell>
    );
  }

  const counts = analyticsData?.data?.counts || {};
  const recentSearches = analyticsData?.data?.recentSearches || [];
  const tools = toolsData?.data?.tools || [];
  const reviews = reviewsData?.data?.reviews || [];

  return (
    <PageShell>
      <div className="w-full max-w-5xl mx-auto py-8">
        <div className="flex justify-between items-center mb-8 border-b border-borderSubtle pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-5 h-5 text-googleBlue" />
              <h1 className="text-2xl font-semibold text-ink">TechSphere Administration</h1>
            </div>
            <p className="text-xs text-muted">System metrics, dataset management, and moderation.</p>
          </div>

          {/* TAB BUTTONS */}
          <div className="flex gap-2">
            {[
              { id: 'analytics', label: 'Metrics' },
              { id: 'tools', label: 'Tools CRUD' },
              { id: 'reviews', label: 'Moderation' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  tab === t.id
                    ? 'bg-googleBlue text-white'
                    : 'bg-surface border border-borderSubtle text-muted hover:text-ink'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* TAB 1: ANALYTICS */}
        {tab === 'analytics' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Total Models & Tools', val: counts.tools || 0 },
                { label: 'Registered Users', val: counts.users || 0 },
                { label: 'Blueprints', val: counts.blueprints || 0 },
                { label: 'Verified Reviews', val: counts.reviews || 0 },
              ].map((c) => (
                <div key={c.label} className="p-5 bg-surface border border-borderSubtle rounded-2xl">
                  <div className="text-xs text-muted mb-1">{c.label}</div>
                  <div className="text-2xl font-bold font-mono text-ink">{c.val}</div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-canvas border border-borderSubtle rounded-2xl">
              <h2 className="text-sm font-semibold text-ink mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-googleBlue" />
                <span>Recent Live Searches & Analytics Logs</span>
              </h2>

              <div className="space-y-2">
                {recentSearches.map((s, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-surface border border-borderSubtle rounded-xl flex justify-between items-center text-xs"
                  >
                    <span className="font-mono text-ink font-medium">"{s.query}"</span>
                    <span className="text-lightMuted font-mono">
                      {s.resultCount} results • {new Date(s.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TOOLS CRUD */}
        {tab === 'tools' && (
          <div className="bg-canvas border border-borderSubtle rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-base font-semibold text-ink">Manage Tools Database ({tools.length})</h2>
            </div>

            <div className="space-y-3">
              {tools.map((t) => (
                <div
                  key={t._id}
                  className="p-4 bg-surface border border-borderSubtle rounded-xl flex justify-between items-center text-xs"
                >
                  <div>
                    <span className="font-semibold text-ink">{t.name}</span>
                    <span className="text-muted ml-2">({t.vendor})</span>
                    <span className="ml-2 font-mono text-[11px] text-googleBlue">{t.pricing?.model}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      to={`/tools/${t.slug}`}
                      className="text-googleBlue hover:underline font-medium"
                    >
                      View Live
                    </Link>
                    <button
                      onClick={() => {
                        if (confirm(`Delete ${t.name}?`)) {
                          deleteToolMutation.mutate(t._id);
                        }
                      }}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: REVIEWS MODERATION */}
        {tab === 'reviews' && (
          <div className="bg-canvas border border-borderSubtle rounded-2xl p-6">
            <h2 className="text-base font-semibold text-ink mb-6">
              Community Review Moderation Queue
            </h2>

            <div className="space-y-3">
              {reviews.map((r) => (
                <div
                  key={r._id}
                  className="p-4 bg-surface border border-borderSubtle rounded-xl flex justify-between items-start text-xs"
                >
                  <div className="space-y-1">
                    <div className="font-semibold text-ink">
                      {r.user?.name || 'User'} on <span className="text-googleBlue">{r.tool?.name}</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(r.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      ))}
                    </div>
                    <p className="text-muted max-w-xl">{r.body}</p>
                  </div>

                  {!r.approved && (
                    <button
                      onClick={() => approveReviewMutation.mutate(r._id)}
                      className="px-3 py-1.5 rounded-full bg-googleBlue text-white text-xs inline-flex items-center gap-1 shrink-0"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}
