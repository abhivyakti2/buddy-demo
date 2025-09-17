@@ .. @@
   return (
     <Card className="p-6">
-      <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Preferences</h2>
+      <h2 className="text-3xl font-bold glitter-text mb-6 text-center">✨ Your Preferences ✨</h2>
       
       <form onSubmit={handleSubmit} className="space-y-6">
         <div>
-          <label className="block text-sm font-medium text-gray-700 mb-3">
-            Favorite Cuisines
+          <label className="block text-sm font-bold text-violet-700 mb-3">
+            Favorite Cuisines 🍽️
           </label>
           <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
             {cuisineOptions.map((cuisine) => (
-              <label key={cuisine} className="flex items-center">
+              <label key={cuisine} className="flex items-center p-2 rounded-lg hover:bg-violet-50 transition-all duration-300">
                 <input
                   type="checkbox"
                   checked={preferences.cuisineTypes.includes(cuisine)}
                   onChange={() => handleCuisineChange(cuisine)}
-                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
+                  className="rounded border-violet-300 text-pink-600 focus:ring-pink-500 w-4 h-4"
                 />
-                <span className="ml-2 text-sm text-gray-700">{cuisine}</span>
+                <span className="ml-3 text-sm text-violet-700 font-medium">{cuisine}</span>
               </label>
             ))}
           </div>
         </div>

         <div>
-          <label className="block text-sm font-medium text-gray-700 mb-3">
-            Price Range
+          <label className="block text-sm font-bold text-violet-700 mb-3">
+            Price Range 💰
           </label>
           <div className="flex space-x-4">
             {['budget', 'moderate', 'expensive'].map((range) => (
-              <label key={range} className="flex items-center">
+              <label key={range} className="flex items-center p-3 rounded-xl hover:bg-violet-50 transition-all duration-300">
                 <input
                   type="radio"
                   name="priceRange"
                   value={range}
                   checked={preferences.priceRange === range}
                   onChange={(e) => setPreferences(prev => ({
                     ...prev,
                     priceRange: e.target.value as UserPreferences['priceRange'],
                   }))}
-                  className="border-gray-300 text-blue-600 focus:ring-blue-500"
+                  className="border-violet-300 text-pink-600 focus:ring-pink-500 w-4 h-4"
                 />
-                <span className="ml-2 text-sm text-gray-700 capitalize">{range}</span>
+                <span className="ml-3 text-sm text-violet-700 font-medium capitalize">{range}</span>
               </label>
             ))}
           </div>
         </div>

         <div>
-          <label className="block text-sm font-medium text-gray-700 mb-3">
-            Preferred Atmosphere
+          <label className="block text-sm font-bold text-violet-700 mb-3">
+            Preferred Atmosphere 🌟
           </label>
           <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
             {atmosphereOptions.map((atmosphere) => (
-              <label key={atmosphere} className="flex items-center">
+              <label key={atmosphere} className="flex items-center p-2 rounded-lg hover:bg-violet-50 transition-all duration-300">
                 <input
                   type="checkbox"
                   checked={preferences.atmosphere.includes(atmosphere)}
                   onChange={() => handleAtmosphereChange(atmosphere)}
-                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
+                  className="rounded border-violet-300 text-pink-600 focus:ring-pink-500 w-4 h-4"
                 />
-                <span className="ml-2 text-sm text-gray-700">{atmosphere}</span>
+                <span className="ml-3 text-sm text-violet-700 font-medium">{atmosphere}</span>
               </label>
             ))}
           </div>
         </div>

         <div>
-          <label className="block text-sm font-medium text-gray-700 mb-3">
-            Dietary Restrictions
+          <label className="block text-sm font-bold text-violet-700 mb-3">
+            Dietary Restrictions 🥗
           </label>
           <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
             {dietaryOptions.map((dietary) => (
-              <label key={dietary} className="flex items-center">
+              <label key={dietary} className="flex items-center p-2 rounded-lg hover:bg-violet-50 transition-all duration-300">
                 <input
                   type="checkbox"
                   checked={preferences.dietaryRestrictions.includes(dietary)}
                   onChange={() => handleDietaryChange(dietary)}
-                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
+                  className="rounded border-violet-300 text-pink-600 focus:ring-pink-500 w-4 h-4"
                 />
-                <span className="ml-2 text-sm text-gray-700">{dietary}</span>
+                <span className="ml-3 text-sm text-violet-700 font-medium">{dietary}</span>
               </label>
             ))}
           </div>
         </div>

         <div>
-          <label className="block text-sm font-medium text-gray-700 mb-3">
-            Maximum Distance (miles)
+          <label className="block text-sm font-bold text-violet-700 mb-3">
+            Maximum Distance (miles) 📍
           </label>
           <input
             type="range"
             min="1"
             max="50"
             value={preferences.maxDistance}
             onChange={(e) => setPreferences(prev => ({
               ...prev,
               maxDistance: parseInt(e.target.value),
             }))}
-            className="w-full"
+            className="w-full h-2 bg-gradient-to-r from-pink-200 to-violet-200 rounded-lg appearance-none cursor-pointer"
           />
-          <div className="flex justify-between text-sm text-gray-500 mt-1">
+          <div className="flex justify-between text-sm text-violet-500 font-medium mt-2">
             <span>1 mile</span>
-            <span className="font-medium">{preferences.maxDistance} miles</span>
+            <span className="font-bold text-pink-600">{preferences.maxDistance} miles ✨</span>
             <span>50 miles</span>
           </div>
         </div>

         <div className="flex space-x-4">
           <Button type="submit" className="flex-1">
-            Save Preferences
+            Save Preferences ✨
           </Button>
           {onCancel && (
             <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
-              Cancel
+              Cancel 💕
             </Button>
           )}
         </div>
       </form>
     </Card>
   );
 };

 export default PreferencesForm;