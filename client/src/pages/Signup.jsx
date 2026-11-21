import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageShell from '../components/layout/PageShell';
import ButtonPrimary from '../components/ui/ButtonPrimary';
import { useAuthStore } from '../store/authStore';

export default function Signup() {
  const navigate = useNavigate();
  const { register, error } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localErr, setLocalErr] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalErr('');
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setLocalErr(err.message || 'Registration failed');
    }
  };

  return (
    <PageShell>
      <div className="w-full max-w-sm mx-auto my-auto py-12">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-ink mb-1">Create TechSphere Account</h1>
          <p className="text-xs text-muted">Join engineers discovering optimal tools & architectures</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface border border-borderSubtle p-6 rounded-2xl space-y-4">
          {(localErr || error) && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
              {localErr || error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-ink mb-1.5">Full name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ada Lovelace"
              className="w-full p-2.5 rounded-xl border border-borderSubtle bg-canvas text-xs text-ink focus:outline-none focus:border-googleBlue"
            />
          </div>

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
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full p-2.5 rounded-xl border border-borderSubtle bg-canvas text-xs text-ink focus:outline-none focus:border-googleBlue"
            />
          </div>

          <ButtonPrimary type="submit" className="w-full mt-2">
            Create Account
          </ButtonPrimary>
        </form>

        <div className="text-center mt-6 text-xs text-muted">
          Already have an account?{' '}
          <Link to="/login" className="text-googleBlue font-medium hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
