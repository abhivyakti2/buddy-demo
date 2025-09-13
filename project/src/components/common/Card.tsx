import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'elevated' | 'outlined';
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className, 
  hoverable = false, 
  padding = 'md',
  variant = 'default'
}) => {
  const baseClasses = cn(
    'bg-white rounded-2xl border border-gray-100 transition-all duration-300',
    hoverable && 'hover:shadow-xl hover:scale-[1.02] cursor-pointer'
  );

  const variantClasses = {
    default: 'shadow-lg',
    elevated: 'shadow-xl',
    outlined: 'border-2 border-gray-200 shadow-sm',
  };

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div className={cn(baseClasses, variantClasses[variant], paddingClasses[padding], className)}>
      {children}
    </div>
  );
};

export default Card;