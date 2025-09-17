@@ .. @@
   return (
     <Card className="p-4">
       <div className="flex items-center mb-4">
-        <Users className="w-5 h-5 mr-2 text-blue-600" />
+        <Users className="w-6 h-6 mr-2 text-violet-600 animate-twinkle" />
         <h3 className="text-lg font-semibold text-gray-900">
-          Room Members ({members.length})
+          <span className="gradient-text">Room Members ({members.length}) 💕</span>
         </h3>
       </div>
       
       <div className="space-y-3">
         {members.map((member) => (
-          <div key={member.id} className="flex items-center justify-between">
+          <div key={member.id} className="flex items-center justify-between p-2 rounded-xl bg-gradient-to-r from-violet-50 to-pink-50 hover:from-violet-100 hover:to-pink-100 transition-all duration-300">
             <div className="flex items-center">
-              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
-                <span className="text-white text-sm font-medium">
+              <div className="w-10 h-10 bg-gradient-to-r from-pink-400 via-violet-500 to-purple-600 rounded-full flex items-center justify-center shadow-sparkle animate-float">
+                <span className="text-white text-sm font-bold">
                   {member.name.charAt(0).toUpperCase()}
                 </span>
               </div>
-              <span className="ml-3 text-gray-900 font-medium">{member.name}</span>
+              <span className="ml-3 text-violet-900 font-bold">{member.name}</span>
             </div>
             
             <div className="flex items-center">
               <Circle
-                className={`w-3 h-3 mr-2 ${
+                className={`w-3 h-3 mr-2 animate-twinkle ${
                   member.isOnline
                     ? 'text-green-500 fill-current'
-                    : 'text-gray-400 fill-current'
+                    : 'text-pink-400 fill-current'
                 }`}
               />
-              <span className={`text-sm ${
-                member.isOnline ? 'text-green-600' : 'text-gray-500'
+              <span className={`text-sm font-semibold ${
+                member.isOnline ? 'text-green-600' : 'text-pink-500'
               }`}>
-                {member.isOnline ? 'Online' : 'Offline'}
+                {member.isOnline ? 'Online ✨' : 'Away 💤'}
               </span>
             </div>
           </div>
         ))}
       </div>
     </Card>
   );
 };

 export default RoomMembersList;