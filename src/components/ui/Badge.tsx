import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info';
  className?: string;
}

export default function Badge({
  children,
  variant = 'primary',
  className = '',
}: BadgeProps) {
  const baseStyle = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold select-none tracking-wide uppercase';
  
  const variants = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-dark/10 text-dark',
    danger: 'bg-accent-red/10 text-accent-red',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    info: 'bg-blue-100 text-blue-700',
  };

  return (
    <span className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
