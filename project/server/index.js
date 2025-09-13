import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import OpenAI from 'openai';
import axios from 'axios';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (replace with proper database in production)
const users = new Map();
const rooms = new Map();
const votes = new Map();

// Mock OpenAI for demo (replace with real API key)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'demo-key'
});

// Helper function to generate room code
const generateRoomCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Helper function to get mock place data
const getMockPlaces = (preferences) => {
  const mockPlaces = [
    {
      id: uuidv4(),
      name: "Bella Vista Restaurant",
      address: "123 Main St, Downtown",
      location: { lat: 40.7589, lng: -73.9851 },
      rating: 4.5,
      priceLevel: 2,
      cuisineType: "Italian",
      photos: ["https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg"],
      description: "Authentic Italian cuisine with a modern twist. Perfect for groups with excellent wine selection.",
      aiScore: 0.92,
      reasons: [
        "Highly rated for group dining",
        "Matches your Italian cuisine preference",
        "Great ambiance for social gatherings"
      ]
    },
    {
      id: uuidv4(),
      name: "The Garden Terrace",
      address: "456 Park Ave, Uptown",
      location: { lat: 40.7614, lng: -73.9776 },
      rating: 4.3,
      priceLevel: 2,
      cuisineType: "Mediterranean",
      photos: ["https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg"],
      description: "Beautiful outdoor seating with fresh Mediterranean dishes. Family-friendly atmosphere.",
      aiScore: 0.88,
      reasons: [
        "Outdoor seating matches your preferences",
        "Mediterranean cuisine with healthy options",
        "Accommodates dietary restrictions"
      ]
    },
    {
      id: uuidv4(),
      name: "Sakura Sushi House",
      address: "789 First St, Midtown",
      location: { lat: 40.7505, lng: -73.9934 },
      rating: 4.7,
      priceLevel: 3,
      cuisineType: "Japanese",
      photos: ["https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg"],
      description: "Premium sushi experience with fresh ingredients and artistic presentation.",
      aiScore: 0.85,
      reasons: [
        "Highest rated in the area",
        "Known for accommodating groups",
        "Fresh, high-quality ingredients"
      ]
    },
    {
      id: uuidv4(),
      name: "Café Luna",
      address: "321 Oak St, Arts District",
      location: { lat: 40.7282, lng: -73.9942 },
      rating: 4.2,
      priceLevel: 1,
      cuisineType: "American",
      photos: ["https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg"],
      description: "Cozy coffee shop with light meals and pastries. Great for casual meetups.",
      aiScore: 0.78,
      reasons: [
        "Budget-friendly option",
        "Casual atmosphere perfect for friends",
        "Good for longer conversations"
      ]
    },
    {
      id: uuidv4(),
      name: "Spice Route",
      address: "654 Curry Lane, Little India",
      location: { lat: 40.7420, lng: -73.9897 },
      rating: 4.4,
      priceLevel: 2,
      cuisineType: "Indian",
      photos: ["https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg"],
      description: "Authentic Indian flavors with extensive vegetarian and vegan options.",
      aiScore: 0.90,
      reasons: [
        "Excellent vegetarian options",
        "Accommodates all dietary restrictions",
        "Great for sharing dishes family-style"
      ]
    },
    {
      id: uuidv4(),
      name: "The Local Brewery",
      address: "987 Craft St, Brewery District",
      location: { lat: 40.7311, lng: -73.9878 },
      rating: 4.1,
      priceLevel: 2,
      cuisineType: "American",
      photos: ["https://images.pexels.com/photos/1267697/pexels-photo-1267697.jpeg"],
      description: "Craft beer and pub food in a lively atmosphere. Perfect for groups who enjoy nightlife.",
      aiScore: 0.82,
      reasons: [
        "Lively atmosphere for groups",
        "Wide beer selection",
        "Good for evening gatherings"
      ]
    }
  ];

  // Filter based on preferences
  let filteredPlaces = mockPlaces;

  if (preferences.cuisineTypes && preferences.cuisineTypes.length > 0) {
    filteredPlaces = filteredPlaces.filter(place => 
      preferences.cuisineTypes.some(cuisine => 
        place.cuisineType.toLowerCase().includes(cuisine.toLowerCase())
      )
    );
  }

  if (preferences.priceRange) {
    const priceMap = { budget: 1, moderate: 2, expensive: 3 };
    const maxPrice = priceMap[preferences.priceRange];
    filteredPlaces = filteredPlaces.filter(place => place.priceLevel <= maxPrice);
  }

  // Return top suggestions or all if filtered list is too small
  return filteredPlaces.length >= 3 ? filteredPlaces.slice(0, 6) : mockPlaces.slice(0, 6);
};

// Auth routes
app.post('/api/auth/guest', (req, res) => {
  const { name, preferences } = req.body;
  
  const user = {
    id: uuidv4(),
    name,
    preferences,
    history: []
  };
  
  users.set(user.id, user);
  res.json({ user });
});

// Room routes
app.post('/api/rooms/create', (req, res) => {
  const { name, creatorId } = req.body;
  
  const room = {
    id: uuidv4(),
    code: generateRoomCode(),
    name,
    creator: creatorId,
    members: [{
      id: creatorId,
      name: users.get(creatorId)?.name || 'Unknown',
      isOnline: true
    }],
    places: [],
    votes: [],
    status: 'waiting',
    expiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
  };
  
  rooms.set(room.id, room);
  res.json(room);
});

app.post('/api/rooms/join', (req, res) => {
  const { code, userId } = req.body;
  
  const room = Array.from(rooms.values()).find(r => r.code === code);
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }
  
  const user = users.get(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  // Add user to room if not already a member
  const existingMember = room.members.find(m => m.id === userId);
  if (!existingMember) {
    room.members.push({
      id: userId,
      name: user.name,
      isOnline: true
    });
  }
  
  res.json(room);
});

app.get('/api/rooms/:roomId', (req, res) => {
  const room = rooms.get(req.params.roomId);
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }
  
  res.json(room);
});

// Places routes
app.post('/api/places/suggest', async (req, res) => {
  const { roomId, preferences } = req.body;
  
  const room = rooms.get(roomId);
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }
  
  try {
    // Get suggestions based on preferences
    const places = getMockPlaces(preferences);
    
    // In a real implementation, you would:
    // 1. Get locations from all room members
    // 2. Find equidistant places using Google Places API
    // 3. Use OpenAI to analyze preferences and rank suggestions
    // 4. Consider group size, dietary restrictions, etc.
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Store places in room
    room.places = places;
    
    res.json(places);
  } catch (error) {
    console.error('Error getting suggestions:', error);
    res.status(500).json({ error: 'Failed to get suggestions' });
  }
});

app.post('/api/places/vote', (req, res) => {
  const vote = req.body;
  
  // Store vote
  const voteKey = `${vote.userId}-${vote.placeId}`;
  votes.set(voteKey, vote);
  
  // Find room and add vote
  const room = Array.from(rooms.values()).find(r => 
    r.members.some(m => m.id === vote.userId)
  );
  
  if (room) {
    // Remove existing vote from same user for same place
    room.votes = room.votes.filter(v => 
      !(v.userId === vote.userId && v.placeId === vote.placeId)
    );
    room.votes.push(vote);
  }
  
  res.json({ success: true });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });
  
  socket.on('leave-room', (roomId) => {
    socket.leave(roomId);
    console.log(`User ${socket.id} left room ${roomId}`);
  });
  
  socket.on('submit-vote', (vote) => {
    // Find the room this user belongs to
    const room = Array.from(rooms.values()).find(r => 
      r.members.some(m => m.id === vote.userId)
    );
    
    if (room) {
      // Remove existing vote from same user for same place
      room.votes = room.votes.filter(v => 
        !(v.userId === vote.userId && v.placeId === vote.placeId)
      );
      room.votes.push(vote);
      
      // Broadcast vote update to all room members
      io.to(room.id).emit('vote-update', vote);
      io.to(room.id).emit('room-update', room);
    }
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});