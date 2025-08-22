import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  unit?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, id, unit, error, ...props }) => {
  const errorClasses = error ? 'border-red-500/80 focus:border-red-500 focus:ring-red-500' : 'border-slate-600/80 focus:border-cyan-400 focus:ring-cyan-400';
  const unitPadding = unit ? 'pr-12' : 'pr-4';

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-400 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          className={`w-full rounded-lg border bg-slate-800/50 py-2.5 pl-4 ${unitPadding} text-slate-100 shadow-inner-sm transition-colors focus:bg-slate-800 focus:ring-1 focus:outline-none sm:text-sm ${errorClasses}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
        {unit && <span className="absolute inset-y-0 right-4 flex items-center text-sm text-slate-400 pointer-events-none">{unit}</span>}
      </div>
      {error && <p id={`${id}-error`} className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
};

export default Input;