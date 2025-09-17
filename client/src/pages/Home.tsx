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

const Home: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [step, setStep] = useState<'welcome' | 'preferences' | 'action'>('welcome');
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('');
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
      setStep('action');
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

  const handleCreateRoom = async () => {
    try {
      setLoading(true);
      const response = await roomAPI.createRoom({ 
        name: `${name}'s Outing`, 
        creatorId: 'user-id' // This would come from user state
      });
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
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-600 rounded-full mb-4 animate-bounce-subtle">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">OutingAI</h1>
            <p className="text-gray-600">Find the perfect spot for your group with AI-powered suggestions</p>
          </div>

          <Card className="p-6">
            <form onSubmit={handleNameSubmit}>
              <Input
                label="What's your name?"
                value={name}
               onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
                className="mb-6"
              />
              
              {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
              
              <Button type="submit" fullWidth loading={loading}>
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </Card>

          <div className="mt-8 text-center">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="inline-flex items-center justify-center w-10 h-10 bg-primary-100 rounded-full mb-2">
                  <Sparkles className="w-5 h-5 text-primary-600" />
                </div>
                <p className="text-xs text-gray-600">AI Suggestions</p>
              </div>
              <div>
                <div className="inline-flex items-center justify-center w-10 h-10 bg-accent-100 rounded-full mb-2">
                  <Users className="w-5 h-5 text-accent-600" />
                </div>
                <p className="text-xs text-gray-600">Group Voting</p>
              </div>
              <div>
                <div className="inline-flex items-center justify-center w-10 h-10 bg-secondary-100 rounded-full mb-2">
                  <MapPin className="w-5 h-5 text-secondary-600" />
                </div>
                <p className="text-xs text-gray-600">Smart Matching</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'preferences') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-4">
        <div className="max-w-2xl mx-auto py-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome, {name}!</h1>
            <p className="text-gray-600">Tell us your preferences so we can suggest the perfect places</p>
          </div>
          
          <PreferencesForm
            onSave={handlePreferencesSubmit}
            onCancel={() => setStep('welcome')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Ready to find your spot, {name}?</h1>
          <p className="text-gray-600">Create a new room or join an existing one</p>
        </div>

        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Room</h3>
            <p className="text-gray-600 mb-4">Start a new outing and invite your friends</p>
            <Button onClick={handleCreateRoom} fullWidth loading={loading}>
              Create Room
            </Button>
          </Card>

          <div className="text-center">
            <span className="px-3 py-1 bg-white rounded-full text-sm text-gray-500">or</span>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Join Existing Room</h3>
            <Input
              value={roomCode}
              onChange={setRoomCode}
              placeholder="Enter room code"
              className="mb-4"
            />
            <Button onClick={handleJoinRoom} variant="secondary" fullWidth loading={loading}>
              Join Room
            </Button>
          </Card>
        </div>

        {error && <p className="text-red-600 text-sm text-center mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default Home;