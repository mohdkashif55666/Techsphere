import React from 'react';
import Header from './Header';
import Footer from './Footer';

export default function PageShell({ children, className = '' }) {
  return (
    <div className="min-h-screen flex flex-col justify-between p-4 sm:p-8">
      <Header />
      <div className={`w-full flex-1 flex flex-col ${className}`}>
        {children}
      </div>
      <Footer />
    </div>
  );
}
