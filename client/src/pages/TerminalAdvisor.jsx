import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';
import PageShell from '../components/layout/PageShell';
import ButtonPrimary from '../components/ui/ButtonPrimary';
import { Terminal, Copy, Check, AlertCircle, HardDrive } from 'lucide-react';

export default function TerminalAdvisor() {
  const [os, setOs] = useState('macos');
  const [ramGB, setRamGB] = useState(16);
  const [vramGB, setVramGB] = useState(0);
  const [stack, setStack] = useState('mern');
  const [goal, setGoal] = useState('scaffold');
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const mutation = useMutation({
    mutationFn: (body) => api.post('/terminal-advisor', body),
  });

  const handleGenerate = (e) => {
    e.preventDefault();
    mutation.mutate({ os, ramGB, vramGB, stack, goal });
  };

  const advisorData = mutation.data?.data;
  const steps = advisorData?.template?.steps || [];
  const compatibleModels = advisorData?.compatibleModels || [];

  const handleCopySingle = (cmd, idx) => {
    navigator.clipboard.writeText(cmd).then(() => {
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  const handleCopyAll = () => {
    const allText = steps.map((s) => `# ${s.label}\n${s.command}`).join('\n\n');
    navigator.clipboard.writeText(allText).then(() => {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    });
  };

  return (
    <PageShell>
      <div className="w-full max-w-4xl mx-auto py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Terminal className="w-5 h-5 text-googleBlue" />
            <h1 className="text-2xl sm:text-3xl font-semibold text-ink">
              Quick Stack Terminal Advisor
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted">
            Configure your local operating system and hardware profile to generate verified, deterministic terminal commands.
          </p>
        </div>

        {/* INPUT CONFIGURATION FORM */}
        <form
          onSubmit={handleGenerate}
          className="p-6 bg-surface border border-borderSubtle rounded-2xl mb-8 space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* OS SELECTION */}
            <div>
              <label className="block text-xs font-semibold text-ink mb-2">Operating System</label>
              <select
                value={os}
                onChange={(e) => setOs(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-borderSubtle bg-canvas text-xs text-ink focus:outline-none focus:border-googleBlue"
              >
                <option value="macos">macOS (Homebrew / zsh)</option>
                <option value="linux">Linux (Ubuntu / Debian / bash)</option>
                <option value="windows">Windows (PowerShell / winget)</option>
              </select>
            </div>

            {/* STACK SELECTION */}
            <div>
              <label className="block text-xs font-semibold text-ink mb-2">Target Stack</label>
              <select
                value={stack}
                onChange={(e) => setStack(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-borderSubtle bg-canvas text-xs text-ink focus:outline-none focus:border-googleBlue"
              >
                <option value="mern">MERN Monorepo (React + Express)</option>
                <option value="local-model">Local Model (Ollama + GGUF)</option>
              </select>
            </div>

            {/* GOAL */}
            <div>
              <label className="block text-xs font-semibold text-ink mb-2">Objective</label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-borderSubtle bg-canvas text-xs text-ink focus:outline-none focus:border-googleBlue"
              >
                <option value="scaffold">Scaffold clean project repository</option>
                <option value="local-model">Run air-gapped offline model</option>
              </select>
            </div>
          </div>

          {/* HARDWARE SLIDERS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-borderSubtle">
            <div>
              <div className="flex justify-between text-xs text-muted mb-2 font-mono">
                <span>System RAM:</span>
                <span className="font-semibold text-ink">{ramGB} GB RAM</span>
              </div>
              <input
                type="range"
                min="4"
                max="64"
                step="4"
                value={ramGB}
                onChange={(e) => setRamGB(parseInt(e.target.value, 10))}
                className="w-full accent-googleBlue"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-muted mb-2 font-mono">
                <span>Dedicated GPU VRAM:</span>
                <span className="font-semibold text-ink">{vramGB} GB VRAM</span>
              </div>
              <input
                type="range"
                min="0"
                max="32"
                step="2"
                value={vramGB}
                onChange={(e) => setVramGB(parseInt(e.target.value, 10))}
                className="w-full accent-googleBlue"
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-[11px] text-muted font-mono flex items-center gap-1">
              <HardDrive className="w-3.5 h-3.5 text-lightMuted" />
              Templates verified & tested against LTS
            </span>
            <ButtonPrimary type="submit">Generate Commands</ButtonPrimary>
          </div>
        </form>

        {/* OUTPUT TERMINAL BLOCK */}
        {steps.length > 0 && (
          <div className="space-y-6">
            <div className="bg-ink text-canvas rounded-2xl overflow-hidden shadow-lg border border-borderSubtle">
              <div className="bg-[#2D2E30] px-5 py-3 flex justify-between items-center text-xs border-b border-[#3C4043]">
                <div className="flex items-center gap-2 font-mono text-lightMuted">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
                  <span className="ml-2 text-white font-semibold">
                    {os.toUpperCase()} • {stack.toUpperCase()}
                  </span>
                </div>

                <button
                  onClick={handleCopyAll}
                  className="bg-[#3C4043] text-white px-3 py-1.5 rounded-md hover:bg-[#4A4D51] transition-colors inline-flex items-center gap-1.5 font-mono text-[11px]"
                >
                  {copiedAll ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAll ? 'Copied Full Script' : 'Copy All Commands'}</span>
                </button>
              </div>

              <div className="p-6 space-y-4 font-mono text-xs">
                {steps.map((step, idx) => (
                  <div key={idx} className="group relative">
                    <div className="text-lightMuted mb-1 text-[11px]"># {step.label}</div>
                    <div className="flex justify-between items-center bg-[#18191B] p-3 rounded-lg border border-[#2D2E30]">
                      <code className="text-green-400 break-all select-all">{step.command}</code>
                      <button
                        onClick={() => handleCopySingle(step.command, idx)}
                        className="ml-3 p-1.5 rounded text-lightMuted hover:text-white hover:bg-[#2D2E30] transition-colors shrink-0"
                        title="Copy command"
                      >
                        {copiedIndex === idx ? (
                          <Check className="w-3.5 h-3.5 text-green-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* VERIFY WARNING */}
            <div className="p-4 bg-surface border border-borderSubtle rounded-xl flex items-center gap-3 text-xs text-muted">
              <AlertCircle className="w-4 h-4 text-googleBlue shrink-0" />
              <span>
                Always inspect and verify commands before running them with administrative privileges in your local terminal.
              </span>
            </div>

            {/* COMPATIBLE LOCAL MODELS FOR THIS HARDWARE */}
            {compatibleModels.length > 0 && (
              <div className="p-6 bg-canvas border border-borderSubtle rounded-2xl">
                <h3 className="text-sm font-semibold text-ink mb-3">
                  Local AI Models Compatible with Your Hardware ({ramGB}GB RAM)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {compatibleModels.map((m) => (
                    <div
                      key={m._id}
                      className="p-3 bg-surface border border-borderSubtle rounded-xl flex justify-between items-center text-xs"
                    >
                      <div>
                        <div className="font-semibold text-ink">{m.name}</div>
                        <div className="text-lightMuted font-mono">
                          Requires {m.localRequirements?.minRamGB}GB RAM
                        </div>
                      </div>
                      <code className="bg-canvas border border-borderSubtle px-2 py-1 rounded text-googleBlue font-mono">
                        ollama run {m.localRequirements?.ollamaTag || m.slug}
                      </code>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </PageShell>
  );
}
