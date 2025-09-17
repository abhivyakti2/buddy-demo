@@ .. @@
 const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
   size = 'md', 
   className,
   text 
 }) => {
   const sizeClasses = {
     sm: 'w-4 h-4',
     md: 'w-8 h-8',
     lg: 'w-12 h-12',
   };

   return (
     <div className={cn('flex flex-col items-center justify-center space-y-2', className)}>
-      <Loader2 className={cn('animate-spin text-primary-600', sizeClasses[size])} />
-      {text && <p className="text-sm text-gray-600">{text}</p>}
+      <div className={cn('magic-spinner rounded-full', sizeClasses[size])}></div>
+      {text && <p className="text-sm text-violet-600 font-medium animate-pulse">{text}</p>}
     </div>
   );
 };

 export default LoadingSpinner;