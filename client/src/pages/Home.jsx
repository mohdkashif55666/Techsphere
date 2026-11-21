import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import PageShell from '../components/layout/PageShell';
import SearchBox from '../components/ui/SearchBox';
import Chip from '../components/ui/Chip';
import Badge from '../components/ui/Badge';
import RegistryRow from '../components/ui/RegistryRow';
import ButtonLiquid from '../components/ui/ButtonLiquid';
import ButtonPrimary from '../components/ui/ButtonPrimary';
import {
  Terminal,
  Cpu,
  GitCompare,
  ArrowRight,
  SlidersHorizontal,
  Check,
  Copy,
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [quickRam, setQuickRam] = useState(16);

  // Trending searches
  const { data: trendingData } = useQuery({
    queryKey: ['trending'],
    queryFn: () => api.get('/search/trending'),
    staleTime: 60_000,
  });

  // Top registry entries
  const { data: registryData } = useQuery({
    queryKey: ['registry-preview'],
    queryFn: () => api.get('/registry?limit=5'),
    staleTime: 60_000,
  });

  const trendingList = trendingData?.data?.trending || [
    'DeepSeek-V3',
    'Claude 3.7 Sonnet',
    'Local Ollama',
    'React 19 Refactoring',
  ];

  const registryEntries = registryData?.data?.entries || [];
  const updatedBadgeText = registryData?.data?.meta?.updatedBadge || 'Updated 2026';

  const handleSearchSubmit = (term) => {
    if (term && term.trim()) {
      navigate(`/search?q=${encodeURIComponent(term.trim())}`);
    }
  };

  const handleChipClick = (term) => {
    setSearchTerm(term);
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  // Local model recommendation based on user RAM
  const localModelRecommendation = quickRam >= 32
    ? { name: 'DeepSeek-V3 (Q4)', cmd: 'ollama run deepseek-v3', desc: 'MoE coding model requiring 32GB+ RAM' }
    : quickRam >= 16
    ? { name: 'Qwen 2.5 Coder 14B / Phi-4', cmd: 'ollama run phi4', desc: 'Fast code completion and STEM reasoning for 16GB laptops' }
    : { name: 'Mistral 7B', cmd: 'ollama run mistral:7b', desc: 'Lightweight model that runs smoothly on 8GB RAM laptops' };

  const handleCopyCommand = () => {
    navigator.clipboard.writeText(localModelRecommendation.cmd).then(() => {
      setCopiedCmd(true);
      setTimeout(() => setCopiedCmd(false), 2000);
    });
  };

  const filteredEntries = registryEntries.filter((item) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    const task = (item.taskTitle || '').toLowerCase();
    const cName = (item.commercialTool?.name || '').toLowerCase();
    const oName = (item.openTool?.name || '').toLowerCase();
    const tag = (item.tag || '').toLowerCase();
    return task.includes(q) || cName.includes(q) || oName.includes(q) || tag.includes(q);
  });

  return (
    <PageShell>
      {/* UNIFIED CONTAINER SYSTEM (max-w-4xl) */}
      <main className="w-full max-w-4xl mx-auto py-8 sm:py-14 flex flex-col items-center">
        {/* LOGO & BALANCED SUBTITLE */}
        <div className="mb-8 text-center max-w-2xl mx-auto">
          <h1 className="text-5xl sm:text-6xl font-semibold tracking-display text-ink mb-3">
            TechSphere<span className="text-blue">.</span>
          </h1>
          <p className="text-muted text-base sm:text-lg leading-relaxed [text-wrap:balance]">
            Search AI tools by task, compare commercial benchmarks, and find free open-source alternatives you can run yourself.
          </p>
        </div>

        {/* SEARCH BOX */}
        <div className="w-full max-w-2xl mb-4">
          <SearchBox
            value={searchTerm}
            onChange={setSearchTerm}
            onClear={() => setSearchTerm('')}
            onSubmit={handleSearchSubmit}
            placeholder="Search tasks, models, or open alternatives (e.g. Claude, DeepSeek, Ollama)..."
          />
        </div>

        {/* SEARCH ACTION BUTTONS: Search (Primary) + Guide me (Secondary) */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <ButtonPrimary
            onClick={() => handleSearchSubmit(searchTerm || 'MERN Stack')}
            className="px-6 py-2.5"
          >
            Search
          </ButtonPrimary>
          <ButtonLiquid
            onClick={() => navigate('/find')}
            className="px-6 py-2.5 text-xs inline-flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue" strokeWidth={1.75} />
            <span>Guide me</span>
          </ButtonLiquid>
        </div>

        {/* SUGGESTED CHIPS */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-14 text-xs text-muted">
          <span className="text-subtle mr-1">Suggested:</span>
          {trendingList.map((term) => (
            <Chip key={term} onClick={() => handleChipClick(term)}>
              {term}
            </Chip>
          ))}
        </div>

        {/* SECTION 01: FLATTENED AI MODEL & OPEN-SOURCE REGISTER (No nested cards) */}
        <section
          id="register"
          className="w-full bg-canvas border border-border rounded-2xl overflow-hidden mb-12 shadow-sm"
        >
          {/* Header row */}
          <div className="p-5 sm:p-6 bg-surface border-b border-border flex justify-between items-center">
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-ink">
                AI Model & Open-Source Register
              </h2>
              <p className="text-xs text-muted mt-0.5">
                Frontier commercial models mapped to verified open-source counterparts
              </p>
            </div>
            <Badge variant="blue">{updatedBadgeText}</Badge>
          </div>

          {/* Divided rows (flattened, no nested cards) */}
          <div className="divide-y divide-border">
            {filteredEntries.length > 0 ? (
              filteredEntries.map((item) => (
                <RegistryRow
                  key={item._id}
                  taskTitle={item.taskTitle}
                  commercialName={item.commercialTool?.name || 'Commercial Model'}
                  commercialSlug={item.commercialTool?.slug}
                  openName={`${item.openTool?.name || 'Open Alternative'} (Open)`}
                  openSlug={item.openTool?.slug}
                  tag={item.tag}
                />
              ))
            ) : (
              <div className="text-center py-8 text-xs text-muted">
                No matching register items found for "{searchTerm}".
              </div>
            )}
          </div>

          {/* Footer of the register */}
          <div className="p-4 bg-surface border-t border-border flex justify-between items-center text-xs">
            <span className="text-subtle text-[11px]">
              Curated for 2026 development workflows. Verify token pricing before production deployment.
            </span>
            <Link
              to="/search"
              className="text-blue hover:text-blueHover font-medium inline-flex items-center gap-1 transition-colors"
            >
              <span>Explore all models</span>
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.75} />
            </Link>
          </div>
        </section>

        {/* SECTION 02: REDESIGNED PRODUCT LINK TILES (Non-monotonous, distinct hierarchy) */}
        <section className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {/* Tile 1: Guided Finder */}
          <Link
            to="/find"
            className="p-5 rounded-2xl border border-border bg-surface hover:bg-surfaceHover hover:border-borderStrong transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-xl bg-blueBg text-blue flex items-center justify-center mb-3">
                <SlidersHorizontal className="w-4 h-4" strokeWidth={1.75} />
              </div>
              <h3 className="text-sm font-semibold text-ink group-hover:text-blue transition-colors mb-1.5">
                Guided Finder
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                60-second questionnaire matching your task type, budget, and latency requirements with a ranked compatibility score.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-border/60 flex items-center gap-1 text-xs text-blue font-medium">
              <span>Start questionnaire</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" strokeWidth={1.75} />
            </div>
          </Link>

          {/* Tile 2: Hardware Advisor */}
          <Link
            to="/terminal-advisor"
            className="p-5 rounded-2xl border border-border bg-surface hover:bg-surfaceHover hover:border-borderStrong transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-xl bg-surface border border-border text-ink flex items-center justify-center mb-3">
                <Terminal className="w-4 h-4 text-blue" strokeWidth={1.75} />
              </div>
              <h3 className="text-sm font-semibold text-ink group-hover:text-blue transition-colors mb-1.5">
                Hardware Advisor
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                Check whether your laptop or workstation can run DeepSeek, Qwen, or Llama locally with precise Ollama terminal commands.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-border/60 flex items-center gap-1 text-xs text-blue font-medium">
              <span>Calculate local commands</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" strokeWidth={1.75} />
            </div>
          </Link>

          {/* Tile 3: Head-to-Head Compare */}
          <Link
            to="/compare"
            className="p-5 rounded-2xl border border-border bg-surface hover:bg-surfaceHover hover:border-borderStrong transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-xl bg-surface border border-border text-ink flex items-center justify-center mb-3">
                <GitCompare className="w-4 h-4 text-blue" strokeWidth={1.75} />
              </div>
              <h3 className="text-sm font-semibold text-ink group-hover:text-blue transition-colors mb-1.5">
                Side-by-Side Matrix
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                Directly compare context windows, token pricing, coding benchmarks, and offline execution across 2-3 models.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-border/60 flex items-center gap-1 text-xs text-blue font-medium">
              <span>Open comparison</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" strokeWidth={1.75} />
            </div>
          </Link>
        </section>

        {/* SECTION 03: FLATTENED LOCAL MODEL CHECK (No nested sub-card, clean unified layout) */}
        <section
          id="hardware-check"
          className="w-full bg-surface border border-border rounded-2xl p-6 sm:p-7"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Cpu className="w-4 h-4 text-blue" strokeWidth={1.75} />
                <h2 className="text-base font-semibold text-ink">
                  Instant Local Model Check
                </h2>
              </div>
              <p className="text-xs text-muted">
                Select your system RAM to see the recommended open-source model that runs offline on your hardware.
              </p>
            </div>

            {/* RAM Switcher Pills */}
            <div className="flex items-center gap-1.5 bg-canvas border border-border p-1 rounded-full">
              {[8, 16, 32, 64].map((ram) => (
                <button
                  key={ram}
                  type="button"
                  onClick={() => setQuickRam(ram)}
                  className={`px-3 py-1 rounded-full text-xs font-mono transition-colors ${
                    quickRam === ram
                      ? 'bg-blue text-white font-medium shadow-xs'
                      : 'text-muted hover:text-ink'
                  }`}
                >
                  {ram}GB
                </button>
              ))}
            </div>
          </div>

          {/* Recommendation row (flattened, no inner card border) */}
          <div className="pt-4 border-t border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-ink">
                  Recommended for {quickRam}GB RAM:
                </span>
                <span className="text-xs font-mono text-blue font-semibold">
                  {localModelRecommendation.name}
                </span>
              </div>
              <p className="text-xs text-muted">{localModelRecommendation.desc}</p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <code className="bg-canvas border border-border px-3 py-2 rounded-lg font-mono text-xs text-ink select-all flex-1 sm:flex-initial">
                {localModelRecommendation.cmd}
              </code>
              <ButtonPrimary
                onClick={handleCopyCommand}
                className="shrink-0 px-4 py-2 text-xs inline-flex items-center gap-1.5"
              >
                {copiedCmd ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" strokeWidth={2} />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" strokeWidth={1.75} />
                    <span>Copy</span>
                  </>
                )}
              </ButtonPrimary>
            </div>
          </div>
        </section>
      </main>
    </PageShell>
  );
}
