import React from 'react';

export default function ButtonLiquid({ children, className = '', ...props }) {
  return (
    <button
      className={`px-5 py-2 rounded-full text-xs font-medium btn-google-liquid inline-flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-googleBlue focus:ring-offset-1 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
