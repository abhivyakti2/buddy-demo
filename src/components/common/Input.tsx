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
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-bold text-violet-700">
          {label}
          {props.required && <span className="text-pink-500 ml-1 animate-twinkle">✨</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="text-violet-400 animate-twinkle">{leftIcon}</div>
          </div>
        )}
        
        <input
          className={cn(
            'cute-input w-full px-4 py-3 border-2 border-pink-300 rounded-3xl',
            'focus:ring-2 focus:ring-pink-400 focus:border-violet-400',
            'transition-all duration-300 text-violet-900 font-medium',
            'placeholder-violet-400',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            error && 'border-pink-500 focus:ring-pink-500 animate-pulse',
            className
          )}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <div className="text-violet-400 animate-twinkle">{rightIcon}</div>
          </div>
        )}
      </div>
      
      {error && <p className="text-sm text-pink-600 font-medium animate-pulse">💔 {error}</p>}
      {helperText && !error && <p className="text-sm text-violet-500 font-medium">✨ {helperText}</p>}
    </div>
  );
};

export default Input;