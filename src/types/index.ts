@@ .. @@
 export interface Room {
   id: string;
   code: string;
   name: string;
+  occasion?: string;
+  mood?: string;
   creator: string;
   members: RoomMember[];
   places: Place[];
   votes: Vote[];
-  status: 'waiting' | 'voting' | 'decided';
+  status: 'waiting' | 'voting' | 'decided' | 'results';
+  votingSession?: {
+    isActive: boolean;
+    currentPlaceIndex: number;
+    timeLeft: number;
+    autoVoteEnabled: boolean;
+  };
   expiresAt: Date;
   finalDecision?: Place;
 }