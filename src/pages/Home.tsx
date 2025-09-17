import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Users, Sparkles, ArrowRight } from 'lucide-react';
import { useAppDispatch } from '../store';
import { setUser } from '../store/slices/userSlice';
import { setCurrentRoom } from '../store/slices/roomSlice';
import { addNotification } from '../store/slices/uiSlice';
import { authAPI, roomAPI } from '../services/api';
import { UserPreferences } from '../types';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';
import PreferencesForm from '../components/preferences/PreferencesForm';
import OccasionSelector from '../components/room/OccasionSelector';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [step, setStep] = useState<'welcome' | 'preferences' | 'occasion' | 'action'>('welcome');
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [occasion, setOccasion] = useState('');
  const [mood, setMood] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setStep('preferences');
    }
  };

  const handlePreferencesSubmit = async (preferences: UserPreferences) => {
    try {
      setLoading(true);
      const response = await authAPI.createGuest({ name: name.trim(), preferences });
      dispatch(setUser(response.data.user));
      setStep('occasion');
      dispatch(addNotification({
        type: 'success',
        message: 'Profile created successfully!'
      }));
    } catch (err) {
      setError('Failed to create user profile. Please try again.');
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to create profile. Please try again.'
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleOccasionSelect = (selectedOccasion: string, selectedMood: string) => {
    setOccasion(selectedOccasion);
    setMood(selectedMood);
    setStep('action');
    dispatch(addNotification({
      type: 'success',
      message: `Set occasion to ${selectedOccasion} with ${selectedMood} mood!`
    }));
  };

  const handleCreateRoom = async () => {
    try {
      setLoading(true);
      const response = await roomAPI.createRoom({ 
        name: `${name}'s ${occasion || 'Outing'}`, 
        creatorId: 'user-id' // This would come from user state
      });
      
      // Add occasion and mood to room
      const roomWithOccasion = {
        ...response.data,
        occasion,
        mood
      };
      
      dispatch(setCurrentRoom(response.data));
      navigate(`/room/${response.data.id}`);
      dispatch(addNotification({
        type: 'success',
        message: 'Room created successfully!'
      }));
    } catch (err) {
      setError('Failed to create room. Please try again.');
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to create room. Please try again.'
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!roomCode.trim()) {
      setError('Please enter a room code.');
      return;
    }
    
    try {
      setLoading(true);
      const response = await roomAPI.joinRoom(roomCode.trim(), 'user-id');
      dispatch(setCurrentRoom(response.data));
      navigate(`/room/${response.data.id}`);
      dispatch(addNotification({
        type: 'success',
        message: 'Joined room successfully!'
      }));
    } catch (err) {
      setError('Failed to join room. Please check the code and try again.');
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to join room. Please check the code.'
      }));
    } finally {
      setLoading(false);
    }
  };

  if (step === 'welcome') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-pink-400 via-violet-500 to-purple-600 rounded-full mb-6 animate-heartbeat shadow-glow">
              <MapPin className="w-10 h-10 text-white animate-twinkle" />
            </div>
            <h1 className="text-4xl font-bold glitter-text mb-4 animate-shimmer">✨ OutingAI ✨</h1>
            <p className="text-violet-700 font-medium text-lg">Find the perfect spot for your group with AI-powered suggestions 💖</p>
          </div>

          <Card className="p-6">
            <form onSubmit={handleNameSubmit}>
              <Input
                label="What's your name? 💕"
                value={name}
               onChange={(e) => setName(e.target.value)}
                placeholder="Enter your lovely name ✨"
                required
                className="mb-6"
              />
              
              {error && <p className="text-pink-600 text-sm mb-4 font-medium">{error}</p>}
              
              <Button type="submit" fullWidth loading={loading}>
                Get Started ✨
                <ArrowRight className="w-4 h-4 ml-2 animate-bounce" />
              </Button>
            </form>
          </Card>

          <div className="mt-8 text-center">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-pink-200 to-violet-200 rounded-full mb-3 animate-float shadow-sparkle">
                  <Sparkles className="w-6 h-6 text-violet-600 animate-twinkle" />
                </div>
                <p className="text-sm text-violet-700 font-semibold">AI Magic ✨</p>
              </div>
              <div>
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-violet-200 to-purple-200 rounded-full mb-3 animate-float shadow-sparkle" style={{animationDelay: '0.5s'}}>
                  <Users className="w-6 h-6 text-purple-600 animate-twinkle" />
                </div>
                <p className="text-sm text-violet-700 font-semibold">Group Fun 💕</p>
              </div>
              <div>
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full mb-3 animate-float shadow-sparkle" style={{animationDelay: '1s'}}>
                  <MapPin className="w-6 h-6 text-pink-600 animate-twinkle" />
                </div>
                <p className="text-sm text-violet-700 font-semibold">Perfect Spots 🌟</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'preferences') {
    return (
      <div className="min-h-screen p-4 relative z-10">
        <div className="max-w-2xl mx-auto py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold glitter-text mb-4">Welcome, {name}! 💖</h1>
            <p className="text-violet-700 font-medium text-lg">Tell us your preferences so we can suggest the perfect places ✨</p>
          </div>
          
          <PreferencesForm
            onSave={handlePreferencesSubmit}
            onCancel={() => setStep('welcome')}
          />
        </div>
      </div>
    );
  }

  if (step === 'occasion') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <OccasionSelector
          onSelect={handleOccasionSelect}
          onSkip={() => setStep('action')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold glitter-text mb-4">Ready to find your spot, {name}? ✨</h1>
          <p className="text-violet-700 font-medium text-lg">Create a new room or join an existing one 💕</p>
          {occasion && mood && (
            <p className="text-sm text-pink-600 mt-3 font-semibold animate-pulse">
              Planning a {occasion} with {mood} mood 🌟
            </p>
          )}
        </div>

        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="text-xl font-bold gradient-text mb-4">✨ Create New Room</h3>
            <p className="text-violet-600 mb-4 font-medium">Start a new outing and invite your friends 💖</p>
            <Button onClick={handleCreateRoom} fullWidth loading={loading}>
              Create Magical Room ✨
            </Button>
          </Card>

          <div className="text-center">
            <span className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm text-violet-500 font-semibold shadow-sparkle">or 💕</span>
          </div>

          <Card className="p-6">
            <h3 className="text-xl font-bold gradient-text mb-4">💕 Join Existing Room</h3>
            <Input
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              placeholder="Enter magical room code ✨"
              className="mb-4"
            />
            <Button onClick={handleJoinRoom} variant="secondary" fullWidth loading={loading}>
              Join the Fun 🌟
            </Button>
          </Card>
        </div>

        {error && <p className="text-pink-600 text-sm text-center mt-4 font-medium">{error}</p>}
      </div>
    </div>
  );
};

export default Home;