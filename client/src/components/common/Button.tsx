import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  className,
  disabled,
  ...props
}) => {
  const baseClasses = cn(
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
    'transform hover:scale-[1.02] active:scale-[0.98]',
    fullWidth && 'w-full'
  );
  
  const variantClasses = {
    primary: cn(
      'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700',
      'text-white shadow-lg hover:shadow-xl focus:ring-primary-500'
    ),
    secondary: cn(
      'bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700',
      'text-white shadow-lg hover:shadow-xl focus:ring-secondary-500'
    ),
    outline: cn(
      'border-2 border-primary-500 text-primary-600 hover:bg-primary-500 hover:text-white',
      'focus:ring-primary-500 bg-white'
    ),
    ghost: cn(
      'text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500'
    ),
    danger: cn(
      'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
      'text-white shadow-lg hover:shadow-xl focus:ring-red-500'
    ),
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      disabled={disabled || loading}
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};

export default Button;