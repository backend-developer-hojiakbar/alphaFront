import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  children: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({ label, id, children, ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-400 mb-2">
        {label}
      </label>
      <select
        id={id}
        className="w-full appearance-none rounded-lg border border-slate-600/80 bg-slate-800/50 py-2.5 px-4 text-slate-100 shadow-inner-sm transition-colors focus:border-cyan-400 focus:bg-slate-800 focus:ring-1 focus:ring-cyan-400 focus:outline-none sm:text-sm"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: 'right 0.5rem center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '1.5em 1.5em',
          paddingRight: '2.5rem',
        }}
        {...props}
      >
        {children}
      </select>
    </div>
  );
};

export default Select;