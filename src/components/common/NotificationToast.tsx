@@ .. @@
   const colorMap = {
-    success: 'bg-accent-50 border-accent-200 text-accent-800',
-    error: 'bg-red-50 border-red-200 text-red-800',
-    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
-    info: 'bg-blue-50 border-blue-200 text-blue-800',
+    success: 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-300 text-green-800 shadow-sparkle',
+    error: 'bg-gradient-to-r from-pink-100 to-rose-100 border-pink-300 text-pink-800 shadow-sparkle',
+    warning: 'bg-gradient-to-r from-yellow-100 to-amber-100 border-yellow-300 text-yellow-800 shadow-sparkle',
+    info: 'bg-gradient-to-r from-violet-100 to-purple-100 border-violet-300 text-violet-800 shadow-sparkle',
   };

   useEffect(() => {
@@ .. @@
           <div
             key={notification.id}
             className={cn(
-              'flex items-center p-4 rounded-xl border shadow-lg animate-slide-up',
-              'max-w-sm w-full',
+              'flex items-center p-4 rounded-2xl border-2 shadow-magical animate-slide-up backdrop-blur-sm',
+              'max-w-sm w-full transform hover:scale-105 transition-all duration-300',
               colorMap[notification.type]
             )}
           >
-            <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
-            <p className="text-sm font-medium flex-1">{notification.message}</p>
+            <Icon className="w-5 h-5 mr-3 flex-shrink-0 animate-twinkle" />
+            <p className="text-sm font-semibold flex-1">{notification.message}</p>
             <button
               onClick={() => dispatch(removeNotification(notification.id))}
-              className="ml-2 flex-shrink-0 hover:opacity-70 transition-opacity"
+              className="ml-2 flex-shrink-0 hover:opacity-70 transition-all duration-300 hover:scale-110 rounded-full p-1"
             >
               <X className="w-4 h-4" />
             </button>
           </div>
         );
       })}
     </div>
   );
 };

 export default NotificationToast;