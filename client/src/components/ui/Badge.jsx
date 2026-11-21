import React from 'react';

/**
 * Unified Badge Component (Design System v2)
 * Ensures 100% consistent rounded-full shape, font size, and semantic color pairing.
 */
export default function Badge({
  children,
  variant = 'blue', // 'blue' | 'surface' | 'neutral' | 'success' | 'warning'
  className = '',
}) {
  const variantStyles = {
    blue: 'bg-blueBg text-blue border-transparent',
    surface: 'bg-surface border-border text-muted',
    neutral: 'bg-canvas border-border text-ink',
    success: 'bg-successBg text-success border-transparent',
    warning: 'bg-warningBg text-warning border-transparent',
  };

  const selectedVariant = variantStyles[variant] || variantStyles.blue;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono border ${selectedVariant} ${className}`}
    >
      {children}
    </span>
  );
}
