import React from 'react';

export default function ButtonPrimary({ children, className = '', ...props }) {
  return (
    <button
      className={`btn-google-primary px-5 py-2.5 rounded-full text-xs font-medium inline-flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-googleBlue focus:ring-offset-1 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
