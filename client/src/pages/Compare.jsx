import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import PageShell from '../components/layout/PageShell';
import { ArrowLeft, Check, X } from 'lucide-react';

export default function Compare() {
  const [searchParams] = useSearchParams();
  const slugs = searchParams.get('slugs') || '';

  const { data, isLoading } = useQuery({
    queryKey: ['compare-tools', slugs],
    queryFn: () => api.get(`/compare?slugs=${slugs}`),
    enabled: !!slugs,
  });

  const tools = data?.data?.tools || [];

  return (
    <PageShell>
      <div className="w-full max-w-5xl mx-auto py-8">
        <Link
          to="/search"
          className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-ink mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to directory</span>
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-ink mb-2">Side-by-Side Comparison</h1>
          <p className="text-xs text-muted">
            Detailed capability matrix for {tools.length} selected tools.
          </p>
        </div>

        {isLoading ? (
          <div className="h-96 bg-surface rounded-2xl border border-borderSubtle animate-pulse" />
        ) : tools.length === 0 ? (
          <div className="text-center py-16 bg-surface border border-borderSubtle rounded-2xl p-8">
            <h3 className="text-base font-semibold text-ink mb-2">No tools selected for comparison</h3>
            <p className="text-xs text-muted max-w-sm mx-auto mb-6">
              Browse our directory and check "Compare" on up to 3 tools to compare them side by side.
            </p>
            <Link to="/search" className="btn-google-primary px-5 py-2.5 rounded-full text-xs font-medium">
              Explore Tools
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs bg-canvas border border-borderSubtle rounded-2xl overflow-hidden shadow-sm">
              <thead>
                <tr className="bg-surface border-b border-borderSubtle">
                  <th className="p-4 font-mono font-medium text-lightMuted w-1/4">Attribute</th>
                  {tools.map((t) => (
                    <th key={t._id} className="p-4 font-semibold text-ink text-sm">
                      <Link to={`/tools/${t.slug}`} className="hover:text-googleBlue transition-colors">
                        {t.name}
                      </Link>
                      <div className="text-xs font-normal text-muted mt-0.5">{t.vendor}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-borderSubtle">
                <tr>
                  <td className="p-4 font-mono text-muted bg-surface/40">Pricing Model</td>
                  {tools.map((t) => (
                    <td key={t._id} className="p-4 font-mono font-medium text-googleBlue">
                      {t.pricing?.model}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-mono text-muted bg-surface/40">Starting Price</td>
                  {tools.map((t) => (
                    <td key={t._id} className="p-4">
                      {t.pricing?.startingPriceUSD > 0 ? `$${t.pricing.startingPriceUSD}/mo` : 'Free'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-mono text-muted bg-surface/40">Open Source</td>
                  {tools.map((t) => (
                    <td key={t._id} className="p-4">
                      {t.capabilities?.openSource ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <X className="w-4 h-4 text-red-500" />
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-mono text-muted bg-surface/40">Runs Locally</td>
                  {tools.map((t) => (
                    <td key={t._id} className="p-4">
                      {t.capabilities?.runsLocally ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <X className="w-4 h-4 text-red-500" />
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-mono text-muted bg-surface/40">IDE Integration</td>
                  {tools.map((t) => (
                    <td key={t._id} className="p-4">
                      {t.capabilities?.hasIdeIntegration ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <X className="w-4 h-4 text-red-500" />
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-mono text-muted bg-surface/40">Agentic Mode</td>
                  {tools.map((t) => (
                    <td key={t._id} className="p-4">
                      {t.capabilities?.agentic ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <X className="w-4 h-4 text-red-500" />
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-mono text-muted bg-surface/40">Reasoning Score</td>
                  {tools.map((t) => (
                    <td key={t._id} className="p-4 font-mono font-semibold">
                      {t.scores?.reasoning || 5} / 10
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-mono text-muted bg-surface/40">Coding Score</td>
                  {tools.map((t) => (
                    <td key={t._id} className="p-4 font-mono font-semibold">
                      {t.scores?.coding || 5} / 10
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-mono text-muted bg-surface/40">UI Design Sense</td>
                  {tools.map((t) => (
                    <td key={t._id} className="p-4 font-mono font-semibold">
                      {t.scores?.uiDesignSense || 5} / 10
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-mono text-muted bg-surface/40">Context Window</td>
                  {tools.map((t) => (
                    <td key={t._id} className="p-4 font-mono">
                      {t.contextWindowTokens ? `${(t.contextWindowTokens / 1000).toFixed(0)}k tokens` : 'N/A'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-mono text-muted bg-surface/40">Local Requirements</td>
                  {tools.map((t) => (
                    <td key={t._id} className="p-4 font-mono text-[11px] text-muted">
                      {t.localRequirements?.minRamGB
                        ? `${t.localRequirements.minRamGB}GB RAM (${t.localRequirements.ollamaTag || 'local'})`
                        : 'Cloud Hosted'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageShell>
  );
}
