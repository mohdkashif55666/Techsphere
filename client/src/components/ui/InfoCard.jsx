import React from 'react';
import { Link } from 'react-router-dom';

export default function InfoCard({ indexLabel, title, description, to }) {
  const content = (
    <div className="p-5 bg-surface border border-borderSubtle rounded-2xl hover:shadow-sm transition-all h-full flex flex-col justify-between group hover:border-googleBlue">
      <div>
        <div className="text-xs text-googleBlue font-mono mb-2">{indexLabel}</div>
        <h3 className="text-sm font-semibold mb-2 group-hover:text-googleBlue transition-colors">
          {title}
        </h3>
        <p className="text-xs text-muted leading-relaxed">{description}</p>
      </div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="block h-full">
        {content}
      </Link>
    );
  }

  return content;
}
