@@ .. @@
 interface PlaceCardProps {
   place: Place;
   votes: Vote[];
   currentUserId: string;
   onVote: (placeId: string, value: Vote['value']) => void;
+  showTimer?: boolean;
+  timeLeft?: number;
+  hasVoted?: boolean;
 }

-const PlaceCard: React.FC<PlaceCardProps> = ({ place, votes, currentUserId, onVote }) => {
+const PlaceCard: React.FC<PlaceCardProps> = ({ 
+  place, 
+  votes, 
+  currentUserId, 
+  onVote, 
+  showTimer = false, 
+  timeLeft = 0,
+  hasVoted = false 
+}) => {
   const placeVotes = votes.filter(v => v.placeId === place.id);
   const userVote = placeVotes.find(v => v.userId === currentUserId);
   
@@ .. @@
   };

   return (
-    <Card hoverable className="overflow-hidden">
+    <Card hoverable className={`overflow-hidden ${showTimer ? 'ring-2 ring-primary-500' : ''}`}>
+      {showTimer && (
+        <div className={`px-6 py-3 ${
+          timeLeft <= 10 ? 'bg-red-50 border-b border-red-200' : 
+          timeLeft <= 20 ? 'bg-yellow-50 border-b border-yellow-200' : 
+          'bg-green-50 border-b border-green-200'
+        }`}>
+          <div className="flex items-center justify-between">
+            <span className={`text-sm font-medium ${
+              timeLeft <= 10 ? 'text-red-700' : 
+              timeLeft <= 20 ? 'text-yellow-700' : 
+              'text-green-700'
+            }`}>
+              {hasVoted ? 'Vote recorded! Moving to next...' : `Time remaining: ${timeLeft}s`}
+            </span>
+            {hasVoted && (
+              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
+            )}
+          </div>
+        </div>
+      )}
+      
       {place.photos.length > 0 && (
         <div className="h-48 overflow-hidden">
           <img
@@ .. @@
         <div className="flex space-x-2 mb-4">
           <Button
             size="sm"
-            variant={userVote?.value === 'love' ? 'primary' : 'outline'}
+            variant={userVote?.value === 'love' ? 'primary' : 'outline'}
             onClick={() => onVote(place.id, 'love')}
             className="flex-1"
+            disabled={showTimer && hasVoted}
           >
             <Heart className="w-4 h-4 mr-1" />
             Love
@@ .. @@
           <Button
             size="sm"
-            variant={userVote?.value === 'like' ? 'secondary' : 'outline'}
+            variant={userVote?.value === 'like' ? 'secondary' : 'outline'}
             onClick={() => onVote(place.id, 'like')}
             className="flex-1"
+            disabled={showTimer && hasVoted}
           >
             <ThumbsUp className="w-4 h-4 mr-1" />
             Like
@@ .. @@
           <Button
             size="sm"
-            variant={userVote?.value === 'dislike' ? 'outline' : 'ghost'}
+            variant={userVote?.value === 'dislike' ? 'outline' : 'ghost'}
             onClick={() => onVote(place.id, 'dislike')}
             className="flex-1"
+            disabled={showTimer && hasVoted}
           >
             <ThumbsDown className="w-4 h-4 mr-1" />
             Pass