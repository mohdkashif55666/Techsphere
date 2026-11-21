import React from 'react';

export default function Chip({ children, onClick, active = false, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full border text-xs transition-colors focus:outline-none focus:ring-1 focus:ring-googleBlue ${
        active
          ? 'bg-googleBlueBg text-googleBlue border-googleBlue font-medium'
          : 'bg-surface border-borderSubtle text-muted hover:bg-surfaceHover hover:text-ink'
      } ${className}`}
    >
      {children}
    </button>
  );
}
