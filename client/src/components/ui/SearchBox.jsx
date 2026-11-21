import React, { useRef } from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBox({
  value,
  onChange,
  onClear,
  onSubmit,
  placeholder = "Search AI models, tasks, or local alternatives (e.g. Claude, DeepSeek, Ollama)...",
  className = "",
  autoFocus = false,
  compact = false,
}) {
  const inputRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onSubmit) {
      onSubmit(value);
    } else if (e.key === 'Escape' && onClear) {
      onClear();
    }
  };

  return (
    <div
      className={`w-full bg-surface border border-border rounded-full flex items-center gap-3 search-box-shadow transition-all ${
        compact ? 'px-4 py-2.5 text-sm' : 'px-5 py-3.5 text-sm'
      } ${className}`}
    >
      {/* Lucide Search line icon */}
      <Search
        className="w-4 h-4 text-subtle shrink-0"
        strokeWidth={1.75}
        aria-hidden="true"
      />

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        aria-label="Search models and tools"
        className="w-full bg-transparent text-sm text-ink placeholder:text-subtle focus:outline-none"
      />

      {value && (
        <button
          type="button"
          onClick={() => {
            if (onClear) onClear();
            inputRef.current?.focus();
          }}
          aria-label="Clear search input"
          className="text-subtle hover:text-ink p-1 focus:outline-none focus:ring-1 focus:ring-blue rounded-full transition-colors"
        >
          <X className="w-3.5 h-3.5" strokeWidth={1.75} />
        </button>
      )}
    </div>
  );
}
