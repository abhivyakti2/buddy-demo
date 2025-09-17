@@ .. @@
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
-    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200',
-    'focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
-    'transform hover:scale-[1.02] active:scale-[0.98]',
+    'inline-flex items-center justify-center font-medium rounded-3xl transition-all duration-300',
+    'focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
+    'cute-button transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-sparkle',
+    'backdrop-blur-sm border border-white/20',
     fullWidth && 'w-full'
   );
   
   const variantClasses = {
     primary: cn(
-      'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700',
-      'text-white shadow-lg hover:shadow-xl focus:ring-primary-500'
+      'bg-gradient-to-r from-pink-400 via-violet-500 to-purple-600 hover:from-pink-500 hover:via-violet-600 hover:to-purple-700',
+      'text-white shadow-magical hover:shadow-glow focus:ring-pink-400 animate-shimmer'
     ),
     secondary: cn(
-      'bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700',
-      'text-white shadow-lg hover:shadow-xl focus:ring-secondary-500'
+      'bg-gradient-to-r from-violet-400 to-purple-500 hover:from-violet-500 hover:to-purple-600',
+      'text-white shadow-magical hover:shadow-glow focus:ring-violet-400'
     ),
     outline: cn(
-      'border-2 border-primary-500 text-primary-600 hover:bg-primary-500 hover:text-white',
-      'focus:ring-primary-500 bg-white'
+      'border-2 border-pink-400 text-pink-600 hover:bg-gradient-to-r hover:from-pink-400 hover:to-violet-500 hover:text-white',
+      'focus:ring-pink-400 bg-white/80 backdrop-blur-sm'
     ),
     ghost: cn(
-      'text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500'
+      'text-violet-600 hover:text-white hover:bg-gradient-to-r hover:from-pink-300 hover:to-violet-400 focus:ring-violet-400',
+      'bg-white/50 backdrop-blur-sm'
     ),
     danger: cn(
-      'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
-      'text-white shadow-lg hover:shadow-xl focus:ring-red-500'
+      'bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600',
+      'text-white shadow-magical hover:shadow-glow focus:ring-pink-500'
     ),
   };
   
   const sizeClasses = {
-    sm: 'px-4 py-2 text-sm',
-    md: 'px-6 py-3 text-base',
-    lg: 'px-8 py-4 text-lg',
+    sm: 'px-6 py-2 text-sm',
+    md: 'px-8 py-3 text-base',
+    lg: 'px-10 py-4 text-lg',
   };

   return (
     <button
       disabled={disabled || loading}
       className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
       {...props}
     >
-      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
+      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin text-white" />}
       {children}
     </button>
   );
 };

 export default Button;