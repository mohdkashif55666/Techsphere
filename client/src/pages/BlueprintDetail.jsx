import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import PageShell from '../components/layout/PageShell';
import { ArrowLeft, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function BlueprintDetail() {
  const { slug } = useParams();
  const [copiedSnippetIndex, setCopiedSnippetIndex] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['blueprint-detail', slug],
    queryFn: () => api.get(`/blueprints/${slug}`),
  });

  const blueprint = data?.data?.blueprint;

  const handleCopyCode = (code, index) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedSnippetIndex(index);
      setTimeout(() => setCopiedSnippetIndex(null), 2000);
    });
  };

  if (isLoading) {
    return (
      <PageShell>
        <div className="max-w-3xl mx-auto py-12">
          <div className="h-64 bg-surface rounded-2xl animate-pulse" />
        </div>
      </PageShell>
    );
  }

  if (!blueprint) {
    return (
      <PageShell>
        <div className="max-w-md mx-auto my-auto text-center py-16">
          <h2 className="text-xl font-semibold mb-2">Blueprint Not Found</h2>
          <Link to="/blueprints" className="btn-google-primary px-5 py-2 rounded-full text-xs font-medium inline-block mt-4">
            Back to Blueprints
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="w-full max-w-3xl mx-auto py-8">
        <Link
          to="/blueprints"
          className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-ink mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to blueprints</span>
        </Link>

        {/* HEADER */}
        <div className="mb-8 border-b border-borderSubtle pb-6">
          <div className="text-xs font-mono text-googleBlue uppercase font-semibold mb-2">
            Pillar: {blueprint.pillar}
          </div>
          <h1 className="text-3xl font-semibold text-ink mb-3">{blueprint.title}</h1>
          <p className="text-sm text-muted leading-relaxed">{blueprint.summary}</p>
        </div>

        {/* MARKDOWN BODY */}
        <div className="prose prose-sm max-w-none mb-10 text-xs sm:text-sm text-ink leading-relaxed">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {blueprint.bodyMarkdown}
          </ReactMarkdown>
        </div>

        {/* CODE SNIPPETS */}
        {blueprint.codeSnippets && blueprint.codeSnippets.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-base font-semibold text-ink">Implementation Snippets</h2>
            {blueprint.codeSnippets.map((snippet, idx) => (
              <div
                key={idx}
                className="bg-canvas border border-borderSubtle rounded-2xl overflow-hidden shadow-sm"
              >
                <div className="bg-surface px-5 py-3 border-b border-borderSubtle flex justify-between items-center text-xs">
                  <span className="font-mono font-medium text-ink">{snippet.label || `Snippet ${idx + 1}`}</span>
                  <button
                    onClick={() => handleCopyCode(snippet.code, idx)}
                    className="p-1.5 rounded-md hover:bg-surfaceHover text-muted hover:text-ink transition-colors inline-flex items-center gap-1"
                  >
                    {copiedSnippetIndex === idx ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-600" />
                        <span className="text-green-600 font-mono text-[11px]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="font-mono text-[11px]">Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-5 font-mono text-xs text-ink overflow-x-auto whitespace-pre leading-relaxed bg-[#FAFAFA]">
                  {snippet.code}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
