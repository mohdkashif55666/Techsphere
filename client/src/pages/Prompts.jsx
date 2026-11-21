import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';
import PageShell from '../components/layout/PageShell';
import ButtonPrimary from '../components/ui/ButtonPrimary';
import { Copy, Check, Sparkles } from 'lucide-react';

export default function Prompts() {
  const [copiedId, setCopiedId] = useState(null);

  const { data, refetch } = useQuery({
    queryKey: ['prompts-list'],
    queryFn: () => api.get('/prompts'),
  });

  const copyMutation = useMutation({
    mutationFn: (id) => api.post(`/prompts/${id}/copy`),
    onSuccess: () => refetch(),
  });

  const prompts = data?.data?.prompts || [];

  const handleCopy = (prompt) => {
    navigator.clipboard.writeText(prompt.body).then(() => {
      setCopiedId(prompt._id);
      copyMutation.mutate(prompt._id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <PageShell>
      <div className="w-full max-w-4xl mx-auto py-8">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-googleBlueBg text-googleBlue text-xs font-mono mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Anti-Gravity Stencil Library</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold text-ink mb-3">
            Engineering Prompt Stencils
          </h1>
          <p className="text-muted text-xs sm:text-sm max-w-lg mx-auto">
            Battle-tested prompts engineered for LLMs to generate production-quality MERN code, clean architectures, and strict schemas.
          </p>
        </div>

        <div className="space-y-8">
          {prompts.map((p) => (
            <div
              key={p._id}
              className="p-6 sm:p-8 bg-surface border border-borderSubtle rounded-2xl shadow-sm"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                <div>
                  <h2 className="text-base font-semibold text-ink">{p.title}</h2>
                  <p className="text-xs text-muted mt-0.5">{p.description}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[11px] font-mono text-lightMuted">
                    {p.copyCount || 0} copies
                  </span>
                  <ButtonPrimary onClick={() => handleCopy(p)}>
                    {copiedId === p._id ? 'Copied to Clipboard' : 'Copy Stencil'}
                  </ButtonPrimary>
                </div>
              </div>

              <pre className="bg-canvas border border-borderSubtle p-5 rounded-xl font-mono text-xs leading-relaxed text-ink overflow-x-auto whitespace-pre-wrap select-all">
                {p.body}
              </pre>

              {p.tags && p.tags.length > 0 && (
                <div className="flex gap-2 mt-4 flex-wrap">
                  {p.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono bg-canvas border border-borderSubtle text-muted px-2 py-0.5 rounded-md"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
