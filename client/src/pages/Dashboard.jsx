import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import PageShell from '../components/layout/PageShell';
import { useAuthStore } from '../store/authStore';
import { Heart, LogOut, Shield, ExternalLink, Bookmark } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ['my-favorites'],
    queryFn: () => api.get('/favorites'),
    enabled: !!user,
  });

  const favorites = data?.data?.favorites || [];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!user) {
    return (
      <PageShell>
        <div className="max-w-md mx-auto my-auto text-center py-16">
          <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
          <p className="text-xs text-muted mb-6">Please log in to view your profile dashboard.</p>
          <Link to="/login" className="btn-google-primary px-5 py-2.5 rounded-full text-xs font-medium">
            Sign In
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="w-full max-w-4xl mx-auto py-8">
        {/* PROFILE HEADER */}
        <div className="p-8 bg-surface border border-borderSubtle rounded-2xl mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-googleBlue text-white flex items-center justify-center font-bold text-xl shadow-sm">
              {user.avatarInitials || 'TS'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold text-ink">{user.name}</h1>
                {user.role === 'admin' && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-googleBlue text-white">
                    ADMIN
                  </span>
                )}
              </div>
              <p className="text-xs text-muted font-mono">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user.role === 'admin' && (
              <Link
                to="/admin"
                className="px-4 py-2 rounded-full text-xs font-medium bg-canvas border border-borderSubtle text-ink hover:border-googleBlue inline-flex items-center gap-1.5 transition-colors"
              >
                <Shield className="w-3.5 h-3.5 text-googleBlue" />
                <span>Admin Panel</span>
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-full text-xs font-medium btn-google-liquid inline-flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* SAVED TOOLS LIST */}
        <div className="bg-canvas border border-borderSubtle rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-6 pb-3 border-b border-borderSubtle">
            <Bookmark className="w-4 h-4 text-googleBlue" />
            <h2 className="text-base font-semibold text-ink">Saved Tools & Alternatives</h2>
            <span className="text-xs font-mono text-lightMuted ml-auto">
              {favorites.length} Saved
            </span>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-16 bg-surface rounded-xl animate-pulse" />
              ))}
            </div>
          ) : favorites.length === 0 ? (
            <div className="text-center py-12 text-xs text-muted">
              You haven't saved any tools yet.{' '}
              <Link to="/search" className="text-googleBlue font-medium hover:underline">
                Explore the directory
              </Link>{' '}
              and click the heart icon on any tool.
            </div>
          ) : (
            <div className="space-y-3">
              {favorites.map((tool) => (
                <div
                  key={tool._id}
                  className="p-4 bg-surface border border-borderSubtle rounded-xl flex justify-between items-center hover:border-googleBlue transition-colors group"
                >
                  <div>
                    <Link
                      to={`/tools/${tool.slug}`}
                      className="text-xs font-semibold text-ink group-hover:text-googleBlue hover:underline"
                    >
                      {tool.name}
                    </Link>
                    <div className="text-[11px] text-muted">
                      {tool.vendor} • {tool.pricing?.model}
                    </div>
                  </div>

                  <Link
                    to={`/tools/${tool.slug}`}
                    className="px-4 py-1.5 rounded-full text-xs font-medium btn-google-liquid"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
