@@ .. @@
 const Card: React.FC<CardProps> = ({ 
   children, 
   className, 
   hoverable = false, 
   padding = 'md',
   variant = 'default'
 }) => {
   const baseClasses = cn(
-    'bg-white rounded-2xl border border-gray-100 transition-all duration-300',
-    hoverable && 'hover:shadow-xl hover:scale-[1.02] cursor-pointer'
+    'magic-card rounded-3xl transition-all duration-500',
+    hoverable && 'hover:shadow-glow hover:scale-105 cursor-pointer animate-float'
   );

   const variantClasses = {
-    default: 'shadow-lg',
-    elevated: 'shadow-xl',
-    outlined: 'border-2 border-gray-200 shadow-sm',
+    default: 'shadow-magical',
+    elevated: 'shadow-glow',
+    outlined: 'border-2 border-pink-200 shadow-sparkle',
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