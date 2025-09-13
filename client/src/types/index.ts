export interface User {
  id: string;
  name: string;
  email?: string;
  preferences: UserPreferences;
  history: OutingHistory[];
}

export interface UserPreferences {
  cuisineTypes: string[];
  priceRange: 'budget' | 'moderate' | 'expensive';
  atmosphere: string[];
  dietaryRestrictions: string[];
  maxDistance: number;
}

export interface Room {
  id: string;
  code: string;
  name: string;
  creator: string;
  members: RoomMember[];
  places: Place[];
  votes: Vote[];
  status: 'waiting' | 'voting' | 'decided';
  expiresAt: Date;
  finalDecision?: Place;
}

export interface RoomMember {
  id: string;
  name: string;
  isOnline: boolean;
  location?: {
    lat: number;
    lng: number;
  };
}

export interface Place {
  id: string;
  name: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  rating: number;
  priceLevel: number;
  cuisineType: string;
  photos: string[];
  description: string;
  googlePlaceId?: string;
  aiScore: number;
  reasons: string[];
}

export interface Vote {
  userId: string;
  placeId: string;
  value: 'like' | 'dislike' | 'love';
  timestamp: Date;
}

export interface OutingHistory {
  roomId: string;
  placeName: string;
  date: Date;
  rating: number;
  notes?: string;
}

export interface AppState {
  user: User | null;
  currentRoom: Room | null;
  rooms: Room[];
  loading: boolean;
  error: string | null;
}