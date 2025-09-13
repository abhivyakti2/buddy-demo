import axios from 'axios';
import { User, Room, Place, UserPreferences, Vote } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Auth endpoints
export const authAPI = {
  register: (userData: { name: string; email: string; preferences: UserPreferences }) =>
    api.post<{ user: User; token: string }>('/auth/register', userData),
  
  login: (credentials: { email: string; password: string }) =>
    api.post<{ user: User; token: string }>('/auth/login', credentials),
  
  createGuest: (guestData: { name: string; preferences: UserPreferences }) =>
    api.post<{ user: User }>('/auth/guest', guestData),
};

// Room endpoints
export const roomAPI = {
  createRoom: (roomData: { name: string; creatorId: string }) =>
    api.post<Room>('/rooms/create', roomData),
  
  joinRoom: (code: string, userId: string) =>
    api.post<Room>('/rooms/join', { code, userId }),
  
  getRoom: (roomId: string) =>
    api.get<Room>(`/rooms/${roomId}`),
  
  leaveRoom: (roomId: string, userId: string) =>
    api.post(`/rooms/${roomId}/leave`, { userId }),
};

// Places endpoints
export const placesAPI = {
  getSuggestions: (roomId: string, preferences: any) =>
    api.post<Place[]>('/places/suggest', { roomId, preferences }),
  
  vote: (voteData: Vote) =>
    api.post('/places/vote', voteData),
  
  getVotes: (roomId: string) =>
    api.get<Vote[]>(`/places/votes/${roomId}`),
};

// User preferences endpoints
export const preferencesAPI = {
  updatePreferences: (userId: string, preferences: UserPreferences) =>
    api.put(`/preferences/${userId}`, preferences),
  
  getPreferences: (userId: string) =>
    api.get<UserPreferences>(`/preferences/${userId}`),
};

export default api;