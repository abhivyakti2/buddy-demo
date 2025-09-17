import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { setUser } from './store/slices/userSlice';
import { setCurrentRoom } from './store/slices/roomSlice';
import { setPlaces } from './store/slices/placesSlice';
import NotificationToast from './components/common/NotificationToast';
import Home from './pages/Home';
import Room from './pages/Room';
import { Heart } from 'lucide-react';

// Mock data for preview
const mockUser = {
  id: 'user-1',
  name: 'Alex Johnson',
  preferences: {
    cuisineTypes: ['Italian', 'Japanese'],
    priceRange: 'moderate' as const,
    atmosphere: ['Casual', 'Romantic'],
    dietaryRestrictions: ['Vegetarian'],
    maxDistance: 15,
  },
  history: [],
};

const mockRoom = {
  id: 'room-1',
  code: 'ABC123',
  name: "Alex's Weekend Dinner",
  occasion: 'friends',
  mood: 'relaxed',
  creator: 'user-1',
  members: [
    { id: 'user-1', name: 'Alex Johnson', isOnline: true },
    { id: 'user-2', name: 'Sarah Chen', isOnline: true },
    { id: 'user-3', name: 'Mike Rodriguez', isOnline: false },
    { id: 'user-4', name: 'Emma Wilson', isOnline: true },
  ],
  places: [],
  votes: [
    { userId: 'user-1', placeId: 'place-1', value: 'love' as const, timestamp: new Date() },
    { userId: 'user-2', placeId: 'place-1', value: 'like' as const, timestamp: new Date() },
    { userId: 'user-3', placeId: 'place-2', value: 'love' as const, timestamp: new Date() },
    { userId: 'user-4', placeId: 'place-1', value: 'like' as const, timestamp: new Date() },
    { userId: 'user-2', placeId: 'place-3', value: 'dislike' as const, timestamp: new Date() },
  ],
  status: 'waiting' as const,
  votingSession: {
    isActive: false,
    currentPlaceIndex: 0,
    timeLeft: 30,
    autoVoteEnabled: true,
  },
  expiresAt: new Date(Date.now() + 25 * 60 * 1000), // 25 minutes from now
};

const mockPlaces = [
  {
    id: 'place-1',
    name: "Bella Vista Restaurant",
    address: "123 Main St, Downtown",
    location: { lat: 40.7589, lng: -73.9851 },
    rating: 4.5,
    priceLevel: 2,
    cuisineType: "Italian",
    photos: ["https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg"],
    description: "Authentic Italian cuisine with a modern twist. Perfect for groups with excellent wine selection and romantic ambiance.",
    aiScore: 0.92,
    reasons: [
      "Highly rated for group dining",
      "Matches your Italian cuisine preference",
      "Great ambiance for social gatherings",
      "Excellent vegetarian options available"
    ]
  },
  {
    id: 'place-2',
    name: "Sakura Sushi House",
    address: "789 First St, Midtown",
    location: { lat: 40.7505, lng: -73.9934 },
    rating: 4.7,
    priceLevel: 3,
    cuisineType: "Japanese",
    photos: ["https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg"],
    description: "Premium sushi experience with fresh ingredients and artistic presentation. Known for accommodating dietary restrictions.",
    aiScore: 0.85,
    reasons: [
      "Matches your Japanese cuisine preference",
      "Highest rated in the area",
      "Excellent vegetarian sushi options",
      "Perfect for special occasions"
    ]
  },
  {
    id: 'place-3',
    name: "The Garden Terrace",
    address: "456 Park Ave, Uptown",
    location: { lat: 40.7614, lng: -73.9776 },
    rating: 4.3,
    priceLevel: 2,
    cuisineType: "Mediterranean",
    photos: ["https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg"],
    description: "Beautiful outdoor seating with fresh Mediterranean dishes. Family-friendly atmosphere with extensive vegetarian menu.",
    aiScore: 0.88,
    reasons: [
      "Beautiful outdoor seating",
      "Mediterranean cuisine with healthy options",
      "Accommodates all dietary restrictions",
      "Great for casual group dining"
    ]
  },
  {
    id: 'place-4',
    name: "Spice Route",
    address: "654 Curry Lane, Little India",
    location: { lat: 40.7420, lng: -73.9897 },
    rating: 4.4,
    priceLevel: 2,
    cuisineType: "Indian",
    photos: ["https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg"],
    description: "Authentic Indian flavors with extensive vegetarian and vegan options. Perfect for sharing dishes family-style.",
    aiScore: 0.90,
    reasons: [
      "Excellent vegetarian options",
      "Accommodates all dietary restrictions",
      "Great for sharing dishes family-style",
      "Moderate pricing perfect for groups"
    ]
  }
];

// Initialize mock data
store.dispatch(setUser(mockUser));
store.dispatch(setCurrentRoom(mockRoom));
store.dispatch(setPlaces(mockPlaces));

// Floating Hearts Component
const FloatingHearts = () => {
  return (
    <div className="floating-hearts">
      {[...Array(9)].map((_, i) => (
        <Heart 
          key={i} 
          className={`floating-heart w-6 h-6 fill-current`}
          style={{
            top: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${6 + Math.random() * 4}s`
          }}
        />
      ))}
    </div>
  );
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen relative">
          <FloatingHearts />
          <NotificationToast />
          <Routes>
            <Route path="/" element={<Room />} />
            <Route path="/room/:roomId" element={<Room />} />
            <Route path="/join/:code" element={<Home />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;