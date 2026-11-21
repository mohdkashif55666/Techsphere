import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageShell from '../components/layout/PageShell';
import ButtonLiquid from '../components/ui/ButtonLiquid';
import ButtonPrimary from '../components/ui/ButtonPrimary';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

const CATEGORIES = [
  { id: 'fullStack', label: 'Full-stack (MERN, Next.js)' },
  { id: 'frontend', label: 'Frontend / UI Components' },
  { id: 'backend', label: 'Backend / API / Routing' },
  { id: 'ml', label: 'Machine Learning & AI' },
  { id: 'dataAnalysis', label: 'Data Analysis & Charts' },
  { id: 'devOps', label: 'DevOps / CI-CD / Docker' },
  { id: 'mobile', label: 'Mobile App Development' },
  { id: 'cybersecurity', label: 'Cybersecurity & Code Audit' },
  { id: 'debugging', label: 'Debugging & Code Review' },
  { id: 'docs', label: 'Documentation & Testing' },
  { id: 'research', label: 'Research & CS Proofs' },
  { id: 'uiUx', label: 'UI/UX Visual Design' },
  { id: 'agents', label: 'Autonomous Agents & Workflows' },
];

export default function Find() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  // Form State
  const [formData, setFormData] = useState({
    category: 'fullStack',
    budget: 'freemium-ok',
    maxMonthlyBudget: 50,
    reasoningLevel: 'high',
    speedDepth: 'balanced',
    uiDesignLevel: 3,
    extras: {
      hasApi: false,
      hasIdeIntegration: false,
      largeContext: false,
      agenticMode: false,
      openSource: false,
      multimodal: false,
      runsLocally: false,
    },
    experienceLevel: 'intermediate',
  });

  const nextStep = () => setCurrentStep((s) => Math.min(totalSteps, s + 1));
  const prevStep = () => setCurrentStep((s) => Math.max(1, s - 1));

  const handleFinish = () => {
    sessionStorage.setItem('techsphere_finder_answers', JSON.stringify(formData));
    navigate('/results');
  };

  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  return (
    <PageShell>
      <div className="w-full max-w-2xl mx-auto my-auto py-8">
        {/* PROGRESS BAR */}
        <div className="w-full mb-8">
          <div className="flex justify-between items-center text-xs text-muted mb-2 font-mono">
            <span>STEP 0{currentStep} / 0{totalSteps}</span>
            <span>{progressPercent}% COMPLETE</span>
          </div>
          <div className="w-full h-1 bg-surface border border-borderSubtle rounded-full overflow-hidden">
            <div
              className="h-full bg-googleBlue transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* STEP CONTAINER */}
        <div className="bg-surface border border-borderSubtle rounded-2xl p-6 sm:p-10 mb-8 min-h-[380px] flex flex-col justify-between">
          {/* STEP 1: CATEGORY */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-xl font-semibold text-ink mb-2">
                What is your primary engineering objective?
              </h2>
              <p className="text-xs text-muted mb-6">
                Pick the domain that represents the bulk of your current engineering task.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[260px] overflow-y-auto pr-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat.id })}
                    className={`p-3 rounded-xl border text-left text-xs transition-all ${
                      formData.category === cat.id
                        ? 'border-googleBlue bg-canvas text-ink font-semibold shadow-sm'
                        : 'border-borderSubtle bg-canvas/60 text-muted hover:border-googleBlue/40'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: BUDGET */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-xl font-semibold text-ink mb-2">
                What is your cost and licensing preference?
              </h2>
              <p className="text-xs text-muted mb-6">
                Filter strictly for free/open-source tools or allow commercial services.
              </p>
              <div className="space-y-3 mb-6">
                {[
                  { id: 'free-only', title: '100% Free / Open Source Only', desc: 'No subscriptions, no hidden tokens, runs free or locally.' },
                  { id: 'freemium-ok', title: 'Freemium OK', desc: 'Generous free tier with optional paid upgrades.' },
                  { id: 'paid-ok', title: 'Paid Commercial OK', desc: 'High-end frontier models with token or subscription billing.' },
                ].map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, budget: b.id })}
                    className={`w-full p-4 rounded-xl border text-left text-xs transition-all ${
                      formData.budget === b.id
                        ? 'border-googleBlue bg-canvas text-ink shadow-sm'
                        : 'border-borderSubtle bg-canvas/60 text-muted hover:border-googleBlue/40'
                    }`}
                  >
                    <div className="font-semibold text-ink mb-0.5">{b.title}</div>
                    <div className="text-muted">{b.desc}</div>
                  </button>
                ))}
              </div>

              {formData.budget !== 'free-only' && (
                <div>
                  <div className="flex justify-between text-xs text-muted mb-1 font-mono">
                    <span>Monthly budget limit:</span>
                    <span className="font-semibold text-ink">${formData.maxMonthlyBudget}/mo</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="200"
                    step="5"
                    value={formData.maxMonthlyBudget}
                    onChange={(e) =>
                      setFormData({ ...formData, maxMonthlyBudget: parseInt(e.target.value, 10) })
                    }
                    className="w-full accent-googleBlue"
                  />
                </div>
              )}
            </div>
          )}

          {/* STEP 3: REASONING LEVEL */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-xl font-semibold text-ink mb-2">
                What level of reasoning precision do you require?
              </h2>
              <p className="text-xs text-muted mb-6">
                Choose between rapid heuristic completions and deep multi-step mathematical analysis.
              </p>
              <div className="space-y-3">
                {[
                  { id: 'low', title: 'Standard / Heuristic', desc: 'Fast snippet completion, doc generation, boilerplate, text cleaning.' },
                  { id: 'medium', title: 'Moderate Engineering', desc: 'Standard full-stack debugging, API routing, standard algorithm implementation.' },
                  { id: 'high', title: 'High-Depth Reasoning', desc: 'Complex algorithmic proofs, architecture design, formal verification, deep security audits.' },
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, reasoningLevel: r.id })}
                    className={`w-full p-4 rounded-xl border text-left text-xs transition-all ${
                      formData.reasoningLevel === r.id
                        ? 'border-googleBlue bg-canvas text-ink shadow-sm'
                        : 'border-borderSubtle bg-canvas/60 text-muted hover:border-googleBlue/40'
                    }`}
                  >
                    <div className="font-semibold text-ink mb-0.5">{r.title}</div>
                    <div className="text-muted">{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: SPEED VS DEPTH */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-xl font-semibold text-ink mb-2">
                Speed versus depth trade-off
              </h2>
              <p className="text-xs text-muted mb-6">
                Do you prioritize instant sub-second completions or thorough contemplative reasoning?
              </p>
              <div className="space-y-3">
                {[
                  { id: 'fast', title: 'Ultra-Fast Response (<1s)', desc: 'Prioritizes snappy latency. Ideal for real-time IDE autocomplete.' },
                  { id: 'balanced', title: 'Balanced (Standard latency)', desc: 'Optimal trade-off for routine interactive coding and chat assistance.' },
                  { id: 'slow-but-thorough', title: 'Deep & Contemplative', desc: 'Accepts slower response time to allow multi-token chain-of-thought.' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, speedDepth: s.id })}
                    className={`w-full p-4 rounded-xl border text-left text-xs transition-all ${
                      formData.speedDepth === s.id
                        ? 'border-googleBlue bg-canvas text-ink shadow-sm'
                        : 'border-borderSubtle bg-canvas/60 text-muted hover:border-googleBlue/40'
                    }`}
                  >
                    <div className="font-semibold text-ink mb-0.5">{s.title}</div>
                    <div className="text-muted">{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: UI & DESIGN THINKING */}
          {currentStep === 5 && (
            <div>
              <h2 className="text-xl font-semibold text-ink mb-2">
                UI & Visual Design Thinking
              </h2>
              <p className="text-xs text-muted mb-6">
                How much frontend design awareness and component taste do you expect from the tool?
              </p>
              <div className="py-8">
                <div className="flex justify-between text-xs text-muted mb-3 font-mono">
                  <span>Pure Backend (0)</span>
                  <span className="font-bold text-googleBlue text-sm">Level {formData.uiDesignLevel} / 5</span>
                  <span>Pixel-Perfect Design (5)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="1"
                  value={formData.uiDesignLevel}
                  onChange={(e) =>
                    setFormData({ ...formData, uiDesignLevel: parseInt(e.target.value, 10) })
                  }
                  className="w-full accent-googleBlue"
                />
                <div className="mt-6 p-4 rounded-xl bg-canvas border border-borderSubtle text-xs text-muted">
                  {formData.uiDesignLevel === 0 && 'Targeted strictly at terminal, backend, and low-level code.'}
                  {formData.uiDesignLevel > 0 && formData.uiDesignLevel <= 2 && 'Standard HTML/CSS generation without deep design system knowledge.'}
                  {formData.uiDesignLevel >= 3 && formData.uiDesignLevel <= 4 && 'Solid component architecture, Tailwind classes, and clean layout sense.'}
                  {formData.uiDesignLevel === 5 && 'High design sensitivity: typography, micro-interactions, responsive styling, and modern design tokens.'}
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: EXTRAS & HARDWARE PREFERENCES */}
          {currentStep === 6 && (
            <div>
              <h2 className="text-xl font-semibold text-ink mb-2">
                Special Capabilities & Deployment
              </h2>
              <p className="text-xs text-muted mb-6">
                Select any mandatory requirements or hardware constraints.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {[
                  { key: 'runsLocally', label: 'Must run locally (offline / Ollama)' },
                  { key: 'openSource', label: 'Must be open source / self-hostable' },
                  { key: 'hasIdeIntegration', label: 'VS Code or IDE integration' },
                  { key: 'hasApi', label: 'Programmable REST / SDK API' },
                  { key: 'largeContext', label: 'Large Context (64k+ tokens)' },
                  { key: 'agenticMode', label: 'Agentic multi-file workflow' },
                  { key: 'multimodal', label: 'Multimodal (Vision / Images)' },
                ].map((item) => (
                  <label
                    key={item.key}
                    className="p-3 bg-canvas border border-borderSubtle rounded-xl flex items-center gap-3 text-xs text-ink cursor-pointer hover:border-googleBlue transition-colors select-none"
                  >
                    <input
                      type="checkbox"
                      checked={formData.extras[item.key] || false}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          extras: { ...formData.extras, [item.key]: e.target.checked },
                        })
                      }
                      className="rounded border-borderSubtle text-googleBlue focus:ring-googleBlue"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* NAVIGATION BUTTONS */}
          <div className="flex justify-between items-center pt-6 border-t border-borderSubtle mt-auto">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-4 py-2 rounded-full text-xs font-medium text-muted hover:text-ink disabled:opacity-30 disabled:pointer-events-none inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            {currentStep < totalSteps ? (
              <ButtonPrimary onClick={nextStep} className="inline-flex items-center gap-1.5">
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </ButtonPrimary>
            ) : (
              <ButtonPrimary onClick={handleFinish} className="inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Calculate Recommendations</span>
              </ButtonPrimary>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
