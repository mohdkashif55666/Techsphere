import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full max-w-4xl mx-auto py-6 border-t border-border flex flex-col sm:flex-row justify-between items-center text-xs text-muted gap-3 mt-auto">
      <p>© 2026 TechSphere. Model benchmarks & open-source mapping directory.</p>
      <div className="flex gap-5">
        <Link to="/search" className="text-ink hover:text-blue transition-colors">
          Models
        </Link>
        <Link to="/find" className="text-ink hover:text-blue transition-colors">
          Guided Finder
        </Link>
        <Link to="/terminal-advisor" className="text-ink hover:text-blue transition-colors">
          Hardware
        </Link>
        <Link to="/compare" className="text-ink hover:text-blue transition-colors">
          Compare
        </Link>
        <a href="#privacy" className="text-muted hover:text-ink transition-colors">
          Privacy
        </a>
        <a href="#terms" className="text-muted hover:text-ink transition-colors">
          Terms
        </a>
      </div>
    </footer>
  );
}
