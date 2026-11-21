import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import PageShell from '../components/layout/PageShell';
import ButtonLiquid from '../components/ui/ButtonLiquid';
import ButtonPrimary from '../components/ui/ButtonPrimary';
import Badge from '../components/ui/Badge';
import { ExternalLink, Heart, Check, X, ArrowLeft, Star, MessageSquare } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function ToolDetail() {
  const { slug } = useParams();
  const { user, toggleFavorite } = useAuthStore();
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewBody, setReviewBody] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['tool-detail', slug],
    queryFn: () => api.get(`/tools/${slug}`),
  });

  const tool = data?.data?.tool;

  const { data: reviewsData, refetch: refetchReviews } = useQuery({
    queryKey: ['tool-reviews', tool?._id],
    queryFn: () => api.get(`/reviews?toolId=${tool?._id}`),
    enabled: !!tool?._id,
  });

  const reviews = reviewsData?.data?.reviews || [];

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user || !tool) return;

    try {
      await api.post('/reviews', {
        toolId: tool._id,
        rating: reviewRating,
        body: reviewBody,
      });
      setReviewSubmitted(true);
      setReviewBody('');
      refetch();
      refetchReviews();
    } catch (err) {
      alert(err.message || 'Failed to submit review');
    }
  };

  if (isLoading) {
    return (
      <PageShell>
        <div className="max-w-4xl mx-auto py-12">
          <div className="h-64 bg-surface rounded-2xl animate-pulse" />
        </div>
      </PageShell>
    );
  }

  if (!tool) {
    return (
      <PageShell>
        <div className="max-w-md mx-auto my-auto text-center py-16">
          <h2 className="text-xl font-semibold mb-2">Tool Not Found</h2>
          <Link to="/search" className="btn-google-primary px-5 py-2 rounded-full text-xs font-medium inline-block mt-4">
            Back to Search
          </Link>
        </div>
      </PageShell>
    );
  }

  const isSaved = user?.savedTools?.includes(tool._id);

  return (
    <PageShell>
      <div className="w-full max-w-4xl mx-auto py-8">
        {/* BACK NAVIGATION */}
        <Link
          to="/search"
          className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-ink mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to directory</span>
        </Link>

        {/* HERO CARD */}
        <div className="p-8 bg-surface border border-borderSubtle rounded-2xl mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
            <div>
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <h1 className="text-3xl font-semibold text-ink">{tool.name}</h1>
                <span className="text-xs text-lightMuted">by {tool.vendor}</span>
                <Badge variant="blue">{tool.pricing?.model}</Badge>
                <Badge variant="surface">{tool.type}</Badge>
              </div>
              <p className="text-sm text-muted leading-relaxed max-w-2xl">
                {tool.description}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {user && (
                <button
                  type="button"
                  onClick={() => toggleFavorite(tool._id)}
                  aria-label="Save tool"
                  className={`p-2.5 rounded-full border border-borderSubtle bg-canvas hover:bg-surface transition-colors ${
                    isSaved ? 'text-red-500 fill-red-500' : 'text-lightMuted'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                </button>
              )}

              {tool.website && (
                <a
                  href={tool.website}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-google-primary px-5 py-2.5 rounded-full text-xs font-medium inline-flex items-center gap-1.5"
                >
                  <span>Official Website</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-borderSubtle text-xs text-muted font-mono">
            <div>
              {tool.ratingCount > 0 ? (
                <>
                  Rating: <span className="text-ink font-semibold">{tool.avgRating ? tool.avgRating.toFixed(1) : '0.0'} / 5</span> ({tool.ratingCount} {tool.ratingCount === 1 ? 'review' : 'reviews'})
                </>
              ) : (
                <>
                  Rating: <span className="text-ink font-semibold">Unrated</span> (0 community reviews)
                </>
              )}
            </div>
            <div>
              Context: <span className="text-ink font-semibold">{tool.contextWindowTokens ? `${(tool.contextWindowTokens / 1000).toFixed(0)}k tokens` : 'N/A'}</span>
            </div>
            <div>
              Verified: <span className="text-ink font-semibold">{tool.lastVerifiedAt ? new Date(tool.lastVerifiedAt).toISOString().slice(0, 10) : '2026'}</span>
            </div>
          </div>
        </div>

        {/* RADAR / SCORE BREAKDOWN GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Reasoning', val: tool.scores?.reasoning },
            { label: 'Speed', val: tool.scores?.speed },
            { label: 'Coding', val: tool.scores?.coding },
            { label: 'UI / Design', val: tool.scores?.uiDesignSense },
            { label: 'ML Depth', val: tool.scores?.ml },
            { label: 'Context', val: tool.scores?.context },
            { label: 'Agentic', val: tool.scores?.agentic },
            { label: 'Ease of Use', val: tool.scores?.easeOfUse },
          ].map((s) => (
            <div key={s.label} className="p-4 bg-canvas border border-borderSubtle rounded-xl text-center">
              <div className="text-xs text-lightMuted mb-1">{s.label}</div>
              <div className="text-xl font-bold font-mono text-ink">{s.val || 5}/10</div>
            </div>
          ))}
        </div>

        {/* STRENGTHS & WEAKNESSES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="p-6 bg-canvas border border-borderSubtle rounded-xl">
            <h3 className="text-xs font-mono uppercase tracking-wider text-green-700 font-semibold mb-3 flex items-center gap-1.5">
              <Check className="w-4 h-4 text-green-600" /> Key Strengths
            </h3>
            <ul className="space-y-2 text-xs text-muted">
              {tool.strengths?.map((str, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 bg-canvas border border-borderSubtle rounded-xl">
            <h3 className="text-xs font-mono uppercase tracking-wider text-red-700 font-semibold mb-3 flex items-center gap-1.5">
              <X className="w-4 h-4 text-red-600" /> Known Limitations
            </h3>
            <ul className="space-y-2 text-xs text-muted">
              {tool.weaknesses?.map((w, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ALTERNATIVES SECTION (Commercial <-> Open) */}
        <div className="p-6 bg-surface border border-borderSubtle rounded-2xl mb-8">
          <h2 className="text-base font-semibold text-ink mb-4">
            Direct Tool Alternatives
          </h2>

          {tool.openAlternatives && tool.openAlternatives.length > 0 && (
            <div className="mb-4">
              <div className="text-xs font-mono text-lightMuted mb-2">FREE / OPEN-SOURCE ALTERNATIVES:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tool.openAlternatives.map((alt) => (
                  <Link
                    key={alt._id}
                    to={`/tools/${alt.slug}`}
                    className="p-3 bg-canvas border border-borderSubtle rounded-xl flex justify-between items-center hover:border-googleBlue transition-colors group"
                  >
                    <div>
                      <div className="text-xs font-semibold text-ink group-hover:text-googleBlue">
                        {alt.name}
                      </div>
                      <div className="text-[11px] text-muted">{alt.vendor}</div>
                    </div>
                    <span className="text-xs text-googleBlue font-medium">View</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {tool.commercialEquivalents && tool.commercialEquivalents.length > 0 && (
            <div>
              <div className="text-xs font-mono text-lightMuted mb-2">COMMERCIAL EQUIVALENTS:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tool.commercialEquivalents.map((alt) => (
                  <Link
                    key={alt._id}
                    to={`/tools/${alt.slug}`}
                    className="p-3 bg-canvas border border-borderSubtle rounded-xl flex justify-between items-center hover:border-googleBlue transition-colors group"
                  >
                    <div>
                      <div className="text-xs font-semibold text-ink group-hover:text-googleBlue">
                        {alt.name}
                      </div>
                      <div className="text-[11px] text-muted">{alt.vendor}</div>
                    </div>
                    <span className="text-xs text-googleBlue font-medium">View</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* REVIEWS & COMMUNITY FEEDBACK */}
        <div className="p-6 bg-canvas border border-borderSubtle rounded-2xl">
          <div className="flex justify-between items-center mb-6 pb-3 border-b border-borderSubtle">
            <h2 className="text-base font-semibold text-ink flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-googleBlue" /> Community Reviews
            </h2>
            <span className="text-xs text-lightMuted font-mono">
              {reviews.length} Verified Reviews
            </span>
          </div>

          {/* ADD REVIEW FORM */}
          {user ? (
            <form onSubmit={handleReviewSubmit} className="mb-8 p-4 bg-surface rounded-xl border border-borderSubtle">
              <div className="text-xs font-semibold text-ink mb-2">Write a Review as {user.name}</div>
              <div className="flex items-center gap-1.5 mb-3">
                <span className="text-xs text-muted mr-1">Rating:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="p-1 hover:opacity-80 transition-opacity"
                    aria-label={`${star} star`}
                  >
                    <Star
                      className={`w-4 h-4 ${
                        star <= reviewRating ? 'text-amber-500 fill-amber-500' : 'text-border stroke-[1.75]'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <textarea
                value={reviewBody}
                onChange={(e) => setReviewBody(e.target.value)}
                placeholder="Share your practical experience using this tool for your tasks..."
                rows={3}
                className="w-full p-3 rounded-lg border border-borderSubtle bg-canvas text-xs text-ink focus:outline-none focus:border-googleBlue mb-3"
              />
              <div className="flex justify-between items-center">
                {reviewSubmitted && (
                  <span className="text-xs text-green-600 font-medium">Thank you! Review published.</span>
                )}
                <ButtonPrimary type="submit" className="ml-auto">
                  Post Review
                </ButtonPrimary>
              </div>
            </form>
          ) : (
            <div className="p-4 bg-surface rounded-xl border border-borderSubtle text-center text-xs text-muted mb-6">
              <Link to="/login" className="text-googleBlue font-medium hover:underline">
                Sign in
              </Link>{' '}
              to leave a review and save tools to your profile.
            </div>
          )}

          {/* REVIEW LIST */}
          <div className="space-y-3">
            {reviews.length > 0 ? (
              reviews.map((rev) => (
                <div key={rev._id} className="p-4 bg-surface rounded-xl border border-borderSubtle">
                  <div className="flex justify-between items-center mb-1 text-xs">
                    <span className="font-semibold text-ink">{rev.user?.name || 'Anonymous Developer'}</span>
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">{rev.body}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-xs text-lightMuted">
                No reviews yet. Be the first to share feedback on this tool!
              </div>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
