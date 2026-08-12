import React, { forwardRef } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-bold text-dark uppercase tracking-wider select-none">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`w-full border border-gray-border rounded-lg px-4 py-2.5 text-sm bg-white text-dark placeholder-gray-400 focus:outline-none focus:border-primary transition-all resize-y min-h-[100px] ${
            error ? 'border-accent-red focus:border-accent-red' : ''
          } ${className}`}
          {...props}
        />
        {error && (
          <span className="text-xs font-semibold text-accent-red mt-0.5">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
