import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Code-split pages for high performance
const Home = lazy(() => import('./pages/Home'));
const Search = lazy(() => import('./pages/Search'));
const Find = lazy(() => import('./pages/Find'));
const Results = lazy(() => import('./pages/Results'));
const ToolDetail = lazy(() => import('./pages/ToolDetail'));
const Compare = lazy(() => import('./pages/Compare'));
const Blueprints = lazy(() => import('./pages/Blueprints'));
const BlueprintDetail = lazy(() => import('./pages/BlueprintDetail'));
const TerminalAdvisor = lazy(() => import('./pages/TerminalAdvisor'));
const Prompts = lazy(() => import('./pages/Prompts'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Admin = lazy(() => import('./pages/Admin'));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas">
      <div className="w-8 h-8 rounded-full border-2 border-googleBlue border-t-transparent animate-spin" />
    </div>
  );
}

export default function App() {
  const { fetchMe } = useAuthStore();

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/find" element={<Find />} />
        <Route path="/results" element={<Results />} />
        <Route path="/tools/:slug" element={<ToolDetail />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/blueprints" element={<Blueprints />} />
        <Route path="/blueprints/:slug" element={<BlueprintDetail />} />
        <Route path="/terminal-advisor" element={<TerminalAdvisor />} />
        <Route path="/prompts" element={<Prompts />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Suspense>
  );
}
