import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import PageShell from '../components/layout/PageShell';
import ButtonLiquid from '../components/ui/ButtonLiquid';
import Badge from '../components/ui/Badge';
import { Info, Heart, GitCompare, ArrowRight, ExternalLink, RefreshCw } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Results() {
  const navigate = useNavigate();
  const { user, toggleFavorite } = useAuthStore();
  const [selectedForCompare, setSelectedForCompare] = useState([]);

  // Retrieve answers from session storage
  const storedAnswers = sessionStorage.getItem('techsphere_finder_answers');
  const answers = storedAnswers ? JSON.parse(storedAnswers) : null;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['recommendations', answers],
    queryFn: () => {
      if (!answers) return Promise.resolve({ data: { results: [] } });
      return api.post('/recommend', answers);
    },
    enabled: !!answers,
  });

  const results = data?.data?.results || [];

  const handleToggleCompare = (slug) => {
    setSelectedForCompare((prev) => {
      if (prev.includes(slug)) {
        return prev.filter((s) => s !== slug);
      }
      if (prev.length >= 3) return prev;
      return [...prev, slug];
    });
  };

  const isSaved = (toolId) => user?.savedTools?.includes(toolId);

  if (!answers) {
    return (
      <PageShell>
        <div className="max-w-md mx-auto my-auto text-center py-16">
          <h2 className="text-xl font-semibold mb-3">No active recommendation session</h2>
          <p className="text-xs text-muted mb-6">
            Take our 60-second guided finder to get your tailored tool recommendations.
          </p>
          <Link to="/find" className="btn-google-primary px-6 py-2.5 rounded-full text-xs font-medium">
            Start Guided Finder
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="w-full max-w-4xl mx-auto py-8">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-borderSubtle pb-4">
          <div>
            <h1 className="text-2xl font-semibold text-ink mb-1">Recommended Tools</h1>
            <p className="text-xs text-muted">
              Ranked and scored specifically for your objective in{' '}
              <span className="font-semibold text-ink">{answers.category}</span>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/find')}
              className="px-4 py-2 rounded-full text-xs font-medium btn-google-liquid inline-flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span>Modify Answers</span>
            </button>
          </div>
        </div>

        {/* COMPARE FLOATING BAR */}
        {selectedForCompare.length > 0 && (
          <div className="fixed bottom-6 right-6 bg-ink text-canvas rounded-full px-5 py-3 shadow-xl flex items-center gap-4 z-50 text-xs">
            <span>{selectedForCompare.length} of 3 selected to compare</span>
            <Link
              to={`/compare?slugs=${selectedForCompare.join(',')}`}
              className="bg-googleBlue text-white px-4 py-1.5 rounded-full font-medium hover:bg-[#1765CC] transition-colors inline-flex items-center gap-1.5"
            >
              <GitCompare className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span>Compare Now</span>
            </Link>
            <button
              onClick={() => setSelectedForCompare([])}
              className="text-lightMuted hover:text-white"
            >
              Clear
            </button>
          </div>
        )}

        {/* LOADING STATE */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-44 bg-surface rounded-2xl border border-borderSubtle animate-pulse" />
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!isLoading && results.length === 0 && (
          <div className="text-center py-16 bg-surface border border-borderSubtle rounded-2xl p-8">
            <h3 className="text-base font-semibold text-ink mb-2">No matching tools found</h3>
            <p className="text-xs text-muted max-w-sm mx-auto mb-6">
              Your criteria may be too restrictive (e.g. required capabilities with very low budget).
            </p>
            <button
              onClick={() => navigate('/find')}
              className="btn-google-primary px-5 py-2.5 rounded-full text-xs font-medium"
            >
              Adjust Answers
            </button>
          </div>
        )}

        {/* RESULTS CARDS */}
        <div className="space-y-4">
          {results.map(({ tool, score, breakdown, whyFits }, index) => (
            <div
              key={tool._id}
              className="p-6 bg-canvas border border-borderSubtle rounded-2xl hover:border-googleBlue transition-all shadow-sm flex flex-col justify-between"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <span className="font-mono text-xs text-lightMuted font-bold">
                      #{index + 1}
                    </span>
                    <Link
                      to={`/tools/${tool.slug}`}
                      className="text-base font-semibold text-ink hover:text-googleBlue transition-colors"
                    >
                      {tool.name}
                    </Link>
                    <span className="text-xs text-lightMuted">by {tool.vendor}</span>
                    <Badge variant="outline">{tool.pricing?.model}</Badge>
                  </div>

                  <p className="text-xs text-muted max-w-2xl leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                {/* MATCH SCORE PILL */}
                <div className="text-right shrink-0">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-googleBlueBg text-googleBlue font-mono font-semibold text-sm">
                    <span>{score}% Match</span>
                  </div>
                  <div className="text-[10px] text-lightMuted mt-1">
                    Compatibility rating
                  </div>
                </div>
              </div>

              {/* WHY THIS FITS YOU BLURB */}
              <div className="bg-surface border border-borderSubtle rounded-xl p-3.5 mb-4 text-xs text-ink flex items-start gap-2.5">
                <Info className="w-4 h-4 text-googleBlue shrink-0 mt-0.5" strokeWidth={1.75} />
                <div className="flex-1 leading-relaxed">
                  <span className="font-semibold text-ink">Why this fits you: </span>
                  <span className="text-muted">{whyFits}</span>
                </div>
              </div>

              {/* OPEN-SOURCE ALTERNATIVE (Core signature feature) */}
              {tool.openAlternatives && tool.openAlternatives.length > 0 && (
                <div className="text-xs text-muted mb-4 pb-4 border-b border-borderSubtle flex items-center justify-between">
                  <div>
                    Commercial →{' '}
                    <span className="text-googleBlue font-medium">
                      <Link to={`/tools/${tool.openAlternatives[0].slug}`} className="hover:underline">
                        {tool.openAlternatives[0].name} (Free/Open Alternative)
                      </Link>
                    </span>
                  </div>
                  <Link
                    to={`/tools/${tool.openAlternatives[0].slug}`}
                    className="text-xs text-googleBlue hover:underline flex items-center gap-1"
                  >
                    <span>View alternative</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}

              {/* ACTION FOOTER */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                {/* Score breakdown pills */}
                <div className="flex items-center gap-2 font-mono text-[11px] text-lightMuted">
                  <span>Reasoning: {tool.scores?.reasoning || 5}/10</span>
                  <span>•</span>
                  <span>Speed: {tool.scores?.speed || 5}/10</span>
                  <span>•</span>
                  <span>UI Sense: {tool.scores?.uiDesignSense || 5}/10</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={selectedForCompare.includes(tool.slug)}
                    onClick={() => handleToggleCompare(tool.slug)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono transition-colors border ${
                      selectedForCompare.includes(tool.slug)
                        ? 'bg-googleBlue text-white border-googleBlue'
                        : 'bg-surface hover:bg-surfaceHover text-muted border-borderSubtle hover:text-ink'
                    }`}
                  >
                    <GitCompare className="w-3.5 h-3.5" strokeWidth={1.75} />
                    <span>{selectedForCompare.includes(tool.slug) ? 'Comparing' : 'Compare'}</span>
                  </button>

                  {user && (
                    <button
                      type="button"
                      onClick={() => toggleFavorite(tool._id)}
                      aria-label="Save tool"
                      className={`p-2 rounded-full border border-borderSubtle hover:bg-surface transition-colors ${
                        isSaved(tool._id) ? 'text-red-500 fill-red-500' : 'text-lightMuted'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isSaved(tool._id) ? 'fill-current' : ''}`} />
                    </button>
                  )}

                  <Link
                    to={`/tools/${tool.slug}`}
                    className="px-4 py-1.5 rounded-full text-xs font-medium btn-google-liquid"
                  >
                    Deep Dive
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
