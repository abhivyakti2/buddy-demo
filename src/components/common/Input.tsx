import React from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className,
  ...props
}) => {
  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-bold text-violet-800">
          {label}
          {props.required && <span className="text-pink-500 ml-1 animate-twinkle">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <div className="text-violet-500 animate-twinkle">{leftIcon}</div>
          </div>
        )}
        
        <input
          className={cn(
            'cute-input w-full px-6 py-4 text-violet-900 font-medium placeholder-violet-400',
            'focus:outline-none focus:ring-0',
            leftIcon && 'pl-12',
            rightIcon && 'pr-12',
            error && 'border-pink-500 focus:border-pink-600 shadow-sparkle',
            className
          )}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <div className="text-violet-500 animate-twinkle">{rightIcon}</div>
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-pink-600 font-semibold animate-pulse flex items-center">
          <span className="mr-1">💖</span>
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="text-sm text-violet-600 font-medium flex items-center">
          <span className="mr-1">✨</span>
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Input;