@@ .. @@
         <input
           className={cn(
-            'w-full px-4 py-3 border border-gray-300 rounded-xl',
-            'focus:ring-2 focus:ring-primary-500 focus:border-transparent',
-            'transition-all duration-200 bg-white',
-            'placeholder-gray-400 text-gray-900',
+            'w-full px-6 py-3 cute-input',
+            'focus:ring-2 focus:ring-pink-400 focus:border-violet-400',
+            'transition-all duration-300',
+            'placeholder-violet-400 text-violet-900 font-medium',
             leftIcon && 'pl-10',
             rightIcon && 'pr-10',
-            error && 'border-red-500 focus:ring-red-500',
+            error && 'border-pink-500 focus:ring-pink-500',
             className
           )}
           {...props}
         />
         
         {rightIcon && (
           <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
-            <div className="text-gray-400">{rightIcon}</div>
+            <div className="text-violet-400">{rightIcon}</div>
           </div>
         )}
       </div>
       
-      {error && <p className="text-sm text-red-600">{error}</p>}
-      {helperText && !error && <p className="text-sm text-gray-500">{helperText}</p>}
+      {error && <p className="text-sm text-pink-600 font-medium">{error}</p>}
+      {helperText && !error && <p className="text-sm text-violet-500">{helperText}</p>}
     </div>
   );
 };

 export default Input;