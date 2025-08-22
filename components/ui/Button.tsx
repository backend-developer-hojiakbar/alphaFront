
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'default' | 'small';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'default', className = '', ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-bold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-40 disabled:pointer-events-none disabled:shadow-none';
  
  const variantClasses = {
    primary: 'bg-cyan-500 text-slate-900 shadow-[0_0_15px_rgba(56,189,248,0.4)] hover:bg-cyan-400 hover:shadow-[0_0_25px_rgba(56,189,248,0.7)] focus:ring-cyan-400 transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm',
    secondary: 'bg-slate-700/50 text-slate-300 border border-slate-600 hover:border-cyan-400 hover:text-cyan-400 focus:ring-cyan-500',
  };

  const sizeClasses = {
      default: 'px-5 py-3 text-sm',
      small: 'px-3 py-1.5 text-xs'
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;