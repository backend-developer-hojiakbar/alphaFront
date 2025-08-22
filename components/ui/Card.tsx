import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(({ children, className = '', onClick }, ref) => {
  const baseClasses = 'bg-slate-800/40 backdrop-blur-lg border border-slate-500/30 rounded-2xl shadow-lg transition-all duration-300';
  const hoverClasses = onClick ? 'cursor-pointer hover:border-slate-400/50 hover:shadow-cyan-500/10' : '';
  
  return (
    <div
      ref={ref}
      className={`${baseClasses} ${hoverClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export default Card;