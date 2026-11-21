import React from 'react';
import { Link } from 'react-router-dom';
import Badge from './Badge';

export default function RegistryRow({
  taskTitle,
  commercialName,
  commercialSlug,
  openName,
  openSlug,
  tag,
}) {
  return (
    <div className="py-3.5 px-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 transition-colors hover:bg-surfaceHover/70">
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-ink">
          {taskTitle}
        </div>
        <div className="text-xs text-muted mt-0.5 flex items-center gap-1.5 flex-wrap">
          {commercialSlug ? (
            <Link to={`/tools/${commercialSlug}`} className="hover:text-blue hover:underline">
              {commercialName}
            </Link>
          ) : (
            <span>{commercialName}</span>
          )}
          <span className="text-subtle font-mono">→</span>
          <span className="text-blue font-medium">
            {openSlug ? (
              <Link to={`/tools/${openSlug}`} className="hover:underline">
                {openName}
              </Link>
            ) : (
              openName
            )}
          </span>
        </div>
      </div>

      <Badge variant="surface" className="shrink-0 text-[11px]">
        {tag}
      </Badge>
    </div>
  );
}
