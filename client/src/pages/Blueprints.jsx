import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import PageShell from '../components/layout/PageShell';
import InfoCard from '../components/ui/InfoCard';

export default function Blueprints() {
  const { data, isLoading } = useQuery({
    queryKey: ['blueprints-list'],
    queryFn: () => api.get('/blueprints'),
  });

  const blueprints = data?.data?.blueprints || [];

  const databaseBlueprints = blueprints.filter((b) => b.pillar === 'database');
  const backendBlueprints = blueprints.filter((b) => b.pillar === 'backend');
  const frontendBlueprints = blueprints.filter((b) => b.pillar === 'frontend');

  return (
    <PageShell>
      <div className="w-full max-w-5xl mx-auto py-8">
        <div className="mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-semibold text-ink mb-3">
            MERN Architecture Blueprints
          </h1>
          <p className="text-muted text-xs sm:text-sm max-w-xl mx-auto">
            Production-grade blueprints for MongoDB schemas, Express middleware security, and React/Vite query patterns.
          </p>
        </div>

        {/* PILLARS GRID */}
        <div className="space-y-12">
          {/* DATABASE PILLAR */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs text-googleBlue font-mono font-bold">01. DATABASE</span>
              <div className="h-px bg-borderSubtle flex-1" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {databaseBlueprints.map((b) => (
                <InfoCard
                  key={b._id}
                  indexLabel="MONGODB"
                  title={b.title}
                  description={b.summary}
                  to={`/blueprints/${b.slug}`}
                />
              ))}
            </div>
          </div>

          {/* BACKEND PILLAR */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs text-googleBlue font-mono font-bold">02. BACKEND</span>
              <div className="h-px bg-borderSubtle flex-1" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {backendBlueprints.map((b) => (
                <InfoCard
                  key={b._id}
                  indexLabel="EXPRESS & SECURITY"
                  title={b.title}
                  description={b.summary}
                  to={`/blueprints/${b.slug}`}
                />
              ))}
            </div>
          </div>

          {/* FRONTEND PILLAR */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs text-googleBlue font-mono font-bold">03. FRONTEND</span>
              <div className="h-px bg-borderSubtle flex-1" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {frontendBlueprints.map((b) => (
                <InfoCard
                  key={b._id}
                  indexLabel="REACT & VITE"
                  title={b.title}
                  description={b.summary}
                  to={`/blueprints/${b.slug}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
