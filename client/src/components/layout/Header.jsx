import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function Header() {
  const { user } = useAuthStore();
  const location = useLocation();

  const navLinks = [
    { label: 'Register & Models', to: '/search' },
    { label: 'Guided Finder', to: '/find' },
    { label: 'Hardware Advisor', to: '/terminal-advisor' },
    { label: 'Compare', to: '/compare' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="w-full max-w-4xl mx-auto flex justify-between items-center py-3 px-2">
      <div className="flex items-center gap-8 text-sm font-medium">
        {/* Brand wordmark with blue period */}
        <Link
          to="/"
          className="text-ink font-semibold tracking-tight text-base hover:opacity-85 transition-opacity"
        >
          TechSphere<span className="text-blue">.</span>
        </Link>

        {/* Clean nav links with high AA contrast text (#202124) */}
        <nav className="hidden sm:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`transition-colors text-xs font-medium ${
                isActive(link.to)
                  ? 'text-blue font-semibold'
                  : 'text-ink hover:text-blue'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <Link
            to="/dashboard"
            aria-label="User Dashboard"
            className="w-8 h-8 rounded-full bg-blue text-white flex items-center justify-center font-semibold text-xs shadow-sm hover:bg-blueHover transition-colors focus:outline-none focus:ring-2 focus:ring-blue focus:ring-offset-2"
          >
            {user.avatarInitials || 'TS'}
          </Link>
        ) : (
          <Link
            to="/login"
            className="px-4 py-1.5 rounded-full text-xs font-medium text-ink hover:text-blue transition-colors focus:outline-none focus:ring-2 focus:ring-blue focus:ring-offset-1"
          >
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}
