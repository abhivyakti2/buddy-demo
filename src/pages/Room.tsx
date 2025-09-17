@@ .. @@
 import React, { useEffect, useState } from 'react';
 import { useParams, useNavigate } from 'react-router-dom';
-import { Share2, Copy, Clock, Trophy, RefreshCw } from 'lucide-react';
+import { Share2, Copy, Clock, Trophy, RefreshCw, Settings } from 'lucide-react';
 import { useAppDispatch, useAppSelector } from '../store';
-import { addVote, setCurrentRoom } from '../store/slices/roomSlice';
+import { addVote, setCurrentRoom, startVotingSession } from '../store/slices/roomSlice';
 import { setPlaces } from '../store/slices/placesSlice';
 import { addNotification } from '../store/slices/uiSlice';
+import { updatePreferences } from '../store/slices/userSlice';
 import { roomAPI, placesAPI } from '../services/api';
 import socketService from '../services/socket';
-import { Vote } from '../types';
+import { Vote, UserPreferences } from '../types';
 import Button from '../components/common/Button';
 import Card from '../components/common/Card';
-import PlaceCard from '../components/room/PlaceCard';
+import VotingCarousel from '../components/room/VotingCarousel';
 import RoomMembersList from '../components/room/RoomMembersList';
+import OccasionSelector from '../components/room/OccasionSelector';
+import PreferencesDisplay from '../components/preferences/PreferencesDisplay';
+import PreferencesForm from '../components/preferences/PreferencesForm';

 const Room: React.FC = () => {
@@ .. @@
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState('');
-  const [timeLeft, setTimeLeft] = useState(0);
+  const [showOccasionSelector, setShowOccasionSelector] = useState(false);
+  const [showPreferencesEditor, setShowPreferencesEditor] = useState(false);
+  const [currentOutingPreferences, setCurrentOutingPreferences] = useState<UserPreferences | null>(null);

   useEffect(() => {
@@ .. @@
     loadRoom();

     return () => {
       socketService.disconnect();
     };
   }, [roomId, user, navigate, dispatch]);

-  useEffect(() => {
-    if (currentRoom?.expiresAt) {
-      const timer = setInterval(() => {
-        const now = new Date().getTime();
-        const expiry = new Date(currentRoom.expiresAt).getTime();
-        const diff = expiry - now;
-        
-        if (diff > 0) {
-          setTimeLeft(Math.floor(diff / 1000));
-        } else {
-          setTimeLeft(0);
-        }
-      }, 1000);
-
-      return () => clearInterval(timer);
-    }
-  }, [currentRoom?.expiresAt]);
+  const handleOccasionSelect = (occasion: string, mood: string) => {
+    if (currentRoom) {
+      const updatedRoom = { ...currentRoom, occasion, mood };
+      dispatch(setCurrentRoom(updatedRoom));
+    }
+    setShowOccasionSelector(false);
+  };
+
+  const handlePreferencesUpdate = (preferences: UserPreferences) => {
+    setCurrentOutingPreferences(preferences);
+    dispatch(updatePreferences(preferences));
+    setShowPreferencesEditor(false);
+    dispatch(addNotification({
+      type: 'success',
+      message: 'Preferences updated for this outing!'
+    }));
+  };

   const handleVote = async (placeId: string, value: Vote['value']) => {
@@ .. @@
     }
   };

-  const formatTime = (seconds: number) => {
-    const mins = Math.floor(seconds / 60);
-    const secs = seconds % 60;
-    return `${mins}:${secs.toString().padStart(2, '0')}`;
-  };
-
   if (!currentRoom || !user) {
     return (
       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
@@ .. @@
     );
   }

-  const topPlace = places
-    .map(place => ({
-      ...place,
-      score: currentRoom.votes
-        .filter(v => v.placeId === place.id)
-        .reduce((acc, vote) => {
-          switch (vote.value) {
-            case 'love': return acc + 3;
-            case 'like': return acc + 1;
-            case 'dislike': return acc - 1;
-            default: return acc;
-          }
-        }, 0) + place.aiScore * 10
-    }))
-    .sort((a, b) => b.score - a.score)[0];
+  // Show occasion selector if room is new and no occasion set
+  if (showOccasionSelector) {
+    return (
+      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
+        <OccasionSelector
+          onSelect={handleOccasionSelect}
+          onSkip={() => setShowOccasionSelector(false)}
+        />
+      </div>
+    );
+  }
+
+  // Show preferences editor
+  if (showPreferencesEditor) {
+    return (
+      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-4">
+        <div className="max-w-2xl mx-auto py-8">
+          <PreferencesForm
+            initialPreferences={currentOutingPreferences || user.preferences}
+            onSave={handlePreferencesUpdate}
+            onCancel={() => setShowPreferencesEditor(false)}
+          />
+        </div>
+      </div>
+    );
+  }

   return (
@@ .. @@
         {/* Header */}
         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
           <div>
-            <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentRoom.name}</h1>
+            <div className="flex items-center space-x-3 mb-2">
+              <h1 className="text-3xl font-bold text-gray-900">{currentRoom.name}</h1>
+              {currentRoom.occasion && (
+                <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
+                  {currentRoom.occasion}
+                </span>
+              )}
+              {currentRoom.mood && (
+                <span className="px-3 py-1 bg-secondary-100 text-secondary-800 rounded-full text-sm font-medium">
+                  {currentRoom.mood}
+                </span>
+              )}
+            </div>
             <p className="text-gray-600">Room Code: <span className="font-mono font-semibold">{currentRoom.code}</span></p>
           </div>
           
           <div className="flex items-center space-x-4 mt-4 sm:mt-0">
-            {timeLeft > 0 && (
-              <div className="flex items-center text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
-                <Clock className="w-4 h-4 mr-1" />
-                <span className="text-sm font-medium">{formatTime(timeLeft)}</span>
-              </div>
-            )}
-            
+            <Button variant="outline" size="sm" onClick={() => setShowOccasionSelector(true)}>
+              Set Occasion
+            </Button>
+
             <Button variant="outline" onClick={handleShare}>
               <Share2 className="w-4 h-4 mr-2" />
               Share Room
@@ .. @@
         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           {/* Sidebar */}
           <div className="lg:col-span-1 space-y-6">
             <RoomMembersList members={currentRoom.members} />
             
-            {topPlace && (
-              <Card className="p-4">
-                <div className="flex items-center mb-3">
-                  <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
-                  <h3 className="text-lg font-semibold text-gray-900">Top Choice</h3>
-                </div>
-                <div className="space-y-2">
-                  <h4 className="font-medium text-gray-900">{topPlace.name}</h4>
-                  <p className="text-sm text-gray-600">{topPlace.address}</p>
-                  <div className="flex items-center justify-between text-sm">
-                    <span className="text-green-600 font-medium">
-                      Score: {Math.round(topPlace.score)}
-                    </span>
-                    <span className="text-gray-500">
-                      {currentRoom.votes.filter(v => v.placeId === topPlace.id).length} votes
-                    </span>
-                  </div>
-                </div>
-              </Card>
-            )}
+            <PreferencesDisplay
+              preferences={currentOutingPreferences || user.preferences}
+              onEdit={() => setShowPreferencesEditor(true)}
+              title="Current Outing Preferences"
+            />
           </div>

           {/* Main Content */}
           <div className="lg:col-span-3">
-            <div className="flex items-center justify-between mb-6">
-              <h2 className="text-2xl font-bold text-gray-900">Place Suggestions</h2>
-              <p className="text-gray-600">{places.length} suggestions</p>
-            </div>
-
-            {places.length === 0 && !loading ? (
-              <Card className="p-8 text-center">
-                <p className="text-gray-600 mb-4">No suggestions yet. Click "New Suggestions" to get AI-powered recommendations!</p>
-                <Button onClick={getNewSuggestions} loading={loading}>Get Suggestions</Button>
-              </Card>
-            ) : (
-              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
-                {places.map((place) => (
-                  <PlaceCard
-                    key={place.id}
-                    place={place}
-                    votes={currentRoom.votes}
-                    currentUserId={user.id}
-                    onVote={handleVote}
-                  />
-                ))}
-              </div>
-            )}
+            <VotingCarousel
+              places={places}
+              onVote={handleVote}
+            />
           </div>
         </div>
       </div>