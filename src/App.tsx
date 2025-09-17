@@ .. @@
-import React from 'react';
-import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
-import { Provider } from 'react-redux';
-import { store } from './store';
-import NotificationToast from './components/common/NotificationToast';
-import Home from './pages/Home';
-import Room from './pages/Room';
-
-function App() {
-  return (
-    <Provider store={store}>
-      <Router>
-        <div className="min-h-screen bg-gray-100">
-          <NotificationToast />
-          <Routes>
-            <Route path="/" element={<Home />} />
-            <Route path="/room/:roomId" element={<Room />} />
-            <Route path="/join/:code" element={<Home />} />
-          </Routes>
-        </div>
-      </Router>
-    </Provider>
-  );
-}
-
-export default App;
+import React from 'react';
+
+function App() {
+  return (
+    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
+      <div className="max-w-md w-full">
+        <div className="text-center mb-8">
+          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
+            <span className="text-white text-2xl">🗺️</span>
+          </div>
+          <h1 className="text-3xl font-bold text-gray-900 mb-2">OutingAI</h1>
+          <p className="text-gray-600">Find the perfect spot for your group with AI-powered suggestions</p>
+        </div>
+
+        <div className="bg-white rounded-2xl shadow-lg p-6">
+          <h2 className="text-xl font-semibold text-gray-900 mb-4">Welcome!</h2>
+          <p className="text-gray-600 mb-6">
+            This is a collaborative outing planner that helps groups find the perfect place to meet using AI-powered suggestions and real-time voting.
+          </p>
+          
+          <div className="space-y-4">
+            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
+              <span className="text-blue-600 mr-3">✨</span>
+              <span className="text-sm text-gray-700">AI-powered place suggestions</span>
+            </div>
+            <div className="flex items-center p-3 bg-green-50 rounded-lg">
+              <span className="text-green-600 mr-3">👥</span>
+              <span className="text-sm text-gray-700">Real-time group voting</span>
+            </div>
+            <div className="flex items-center p-3 bg-purple-50 rounded-lg">
+              <span className="text-purple-600 mr-3">🎯</span>
+              <span className="text-sm text-gray-700">Smart preference matching</span>
+            </div>
+          </div>
+          
+          <button className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.02]">
+            Get Started
+          </button>
+        </div>
+      </div>
+    </div>
+  );
+}
+
+export default App;