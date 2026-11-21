import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageShell from '../components/layout/PageShell';
import ButtonPrimary from '../components/ui/ButtonPrimary';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const navigate = useNavigate();
  const { login, error } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localErr, setLocalErr] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalErr('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setLocalErr(err.message || 'Login failed');
    }
  };

  return (
    <PageShell>
      <div className="w-full max-w-sm mx-auto my-auto py-12">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-ink mb-1">Sign in to TechSphere</h1>
          <p className="text-xs text-muted">Access your saved tools, preferences, and reviews</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface border border-borderSubtle p-6 rounded-2xl space-y-4">
          {(localErr || error) && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
              {localErr || error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-ink mb-1.5">Email address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="developer@techsphere.dev"
              className="w-full p-2.5 rounded-xl border border-borderSubtle bg-canvas text-xs text-ink focus:outline-none focus:border-googleBlue"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-2.5 rounded-xl border border-borderSubtle bg-canvas text-xs text-ink focus:outline-none focus:border-googleBlue"
            />
          </div>

          <ButtonPrimary type="submit" className="w-full mt-2">
            Sign In
          </ButtonPrimary>
        </form>

        <div className="text-center mt-6 text-xs text-muted">
          Don't have an account?{' '}
          <Link to="/signup" className="text-googleBlue font-medium hover:underline">
            Create an account
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
