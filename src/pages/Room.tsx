import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Share2, Copy, Clock, Trophy, RefreshCw, Settings, Users as UsersIcon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store';
import { addVote, setCurrentRoom, updateRoomStatus } from '../store/slices/roomSlice';
import { setPlaces } from '../store/slices/placesSlice';
import { addNotification } from '../store/slices/uiSlice';
import { updatePreferences } from '../store/slices/userSlice';
import { Vote, UserPreferences } from '../types';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import PlaceCard from '../components/room/PlaceCard';
import RoomMembersList from '../components/room/RoomMembersList';
import VotingCarousel from '../components/room/VotingCarousel';
import PreferencesDisplay from '../components/preferences/PreferencesDisplay';
import PreferencesForm from '../components/preferences/PreferencesForm';
import OccasionSelector from '../components/room/OccasionSelector';

const Room: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { user } = useAppSelector((state) => state.user);
  const { currentRoom } = useAppSelector((state) => state.room);
  const { places } = useAppSelector((state) => state.places);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [showPreferences, setShowPreferences] = useState(false);
  const [showPreferencesForm, setShowPreferencesForm] = useState(false);
  const [showOccasionSelector, setShowOccasionSelector] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'voting'>('grid');

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    // Mock data is already loaded in App.tsx, so we don't need to fetch anything
    if (currentRoom?.expiresAt) {
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const expiry = new Date(currentRoom.expiresAt).getTime();
        const diff = expiry - now;
        
        if (diff > 0) {
          setTimeLeft(Math.floor(diff / 1000));
        } else {
          setTimeLeft(0);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [user, navigate, currentRoom?.expiresAt]);

  const handleVote = async (placeId: string, value: Vote['value']) => {
    if (!user || !currentRoom) return;

    const vote: Vote = {
      userId: user.id,
      placeId,
      value,
      timestamp: new Date(),
    };

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      dispatch(addVote(vote));
      dispatch(addNotification({
        type: 'success',
        message: `Vote recorded: ${value} for this place!`
      }));
    } catch (err) {
      console.error('Failed to submit vote:', err);
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to submit vote. Please try again.'
      }));
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/join/${currentRoom?.code}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join our outing planning!',
          text: `Help us decide where to go! Room: ${currentRoom?.name}`,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        dispatch(addNotification({
          type: 'success',
          message: 'Room link copied to clipboard!'
        }));
      } catch (err) {
        console.error('Failed to copy:', err);
        dispatch(addNotification({
          type: 'error',
          message: 'Failed to copy link to clipboard'
        }));
      }
    }
  };

  const getNewSuggestions = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Simulate API call with new mock data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newMockPlaces = [
        {
          id: 'place-5',
          name: "Ocean Breeze Café",
          address: "321 Seaside Blvd, Waterfront",
          location: { lat: 40.7282, lng: -73.9942 },
          rating: 4.6,
          priceLevel: 2,
          cuisineType: "Seafood",
          photos: ["https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg"],
          description: "Fresh seafood with stunning ocean views. Perfect for a memorable dining experience.",
          aiScore: 0.89,
          reasons: [
            "Beautiful waterfront location",
            "Fresh seafood options",
            "Great for special occasions",
            "Accommodates dietary preferences"
          ]
        },
        {
          id: 'place-6',
          name: "The Cozy Corner",
          address: "789 Elm Street, Old Town",
          location: { lat: 40.7505, lng: -73.9934 },
          rating: 4.4,
          priceLevel: 1,
          cuisineType: "American",
          photos: ["https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg"],
          description: "Intimate neighborhood bistro with comfort food and friendly service.",
          aiScore: 0.84,
          reasons: [
            "Cozy, intimate atmosphere",
            "Budget-friendly pricing",
            "Great for conversation",
            "Local favorite spot"
          ]
        }
      ];
      
      dispatch(setPlaces([...places, ...newMockPlaces]));
      dispatch(addNotification({
        type: 'success',
        message: 'New suggestions loaded!'
      }));
    } catch (err) {
      setError('Failed to get new suggestions.');
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to get new suggestions.'
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleOccasionSelect = (occasion: string, mood: string) => {
    if (currentRoom) {
      const updatedRoom = {
        ...currentRoom,
        occasion,
        mood
      };
      dispatch(setCurrentRoom(updatedRoom));
      dispatch(addNotification({
        type: 'success',
        message: `Set occasion to ${occasion} with ${mood} mood!`
      }));
    }
    setShowOccasionSelector(false);
  };

  const handlePreferencesUpdate = (preferences: UserPreferences) => {
    dispatch(updatePreferences(preferences));
    setShowPreferencesForm(false);
    dispatch(addNotification({
      type: 'success',
      message: 'Preferences updated for this outing!'
    }));
  };

  const startVotingMode = () => {
    setViewMode('voting');
    dispatch(updateRoomStatus('waiting'));
    dispatch(addNotification({
      type: 'info',
      message: 'Ready to start voting! Click "Start Voting Session" when ready.'
    }));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentRoom || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading room...</p>
        </div>
      </div>
    );
  }

  const topPlace = places
    .map(place => ({
      ...place,
      score: currentRoom.votes
        .filter(v => v.placeId === place.id)
        .reduce((acc, vote) => {
          switch (vote.value) {
            case 'love': return acc + 3;
            case 'like': return acc + 1;
            case 'dislike': return acc - 1;
            default: return acc;
          }
        }, 0) + place.aiScore * 10
    }))
    .sort((a, b) => b.score - a.score)[0];

  // Show occasion selector if not set
  if (showOccasionSelector) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
        <OccasionSelector
          onSelect={handleOccasionSelect}
          onSkip={() => setShowOccasionSelector(false)}
        />
      </div>
    );
  }

  // Show preferences form
  if (showPreferencesForm && user.preferences) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-4">
        <div className="max-w-2xl mx-auto py-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Update Preferences for This Outing</h1>
            <p className="text-gray-600">Customize your preferences just for this session</p>
          </div>
          
          <PreferencesForm
            initialPreferences={user.preferences}
            onSave={handlePreferencesUpdate}
            onCancel={() => setShowPreferencesForm(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative z-10">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold glitter-text mb-4 animate-shimmer">✨ {currentRoom.name} ✨</h1>
            <div className="flex items-center space-x-4 text-sm text-violet-700 font-medium">
              <span>Room Code: <span className="font-mono font-bold text-pink-600 bg-pink-100 px-2 py-1 rounded-lg">{currentRoom.code}</span></span>
              {currentRoom.occasion && (
                <span>• {currentRoom.occasion} ({currentRoom.mood}) 💕</span>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            {timeLeft > 0 && (
              <div className="flex items-center text-pink-600 bg-gradient-to-r from-pink-100 to-violet-100 px-4 py-2 rounded-full shadow-sparkle animate-pulse">
                <Clock className="w-4 h-4 mr-2 animate-twinkle" />
                <span className="text-sm font-bold">{formatTime(timeLeft)} ⏰</span>
              </div>
            )}
            
            <Button variant="outline" size="sm" onClick={() => setShowOccasionSelector(true)}>
              <Settings className="w-4 h-4 mr-2 animate-twinkle" />
              Occasion ✨
            </Button>
            
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2 animate-twinkle" />
              Share 💕
            </Button>
            
            <Button variant="outline" size="sm" onClick={getNewSuggestions} loading={loading}>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin-slow" />
              More Magic ✨
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-gradient-to-r from-pink-100 to-rose-100 border-2 border-pink-300 text-pink-800 px-6 py-4 rounded-2xl mb-6 shadow-sparkle font-medium">
            {error}
          </div>
        )}

        {/* View Mode Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-2 shadow-magical border-2 border-pink-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-8 py-3 rounded-xl font-bold transition-all duration-300 ${
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-pink-400 to-violet-500 text-white shadow-sparkle transform scale-105'
                  : 'text-violet-600 hover:text-violet-800 hover:bg-violet-50'
              }`}
            >
              <UsersIcon className="w-5 h-5 mr-2 inline animate-twinkle" />
              Browse Mode 💕
            </button>
            <button
              onClick={startVotingMode}
              className={`px-8 py-3 rounded-xl font-bold transition-all duration-300 ${
                viewMode === 'voting'
                  ? 'bg-gradient-to-r from-violet-400 to-purple-500 text-white shadow-sparkle transform scale-105'
                  : 'text-violet-600 hover:text-violet-800 hover:bg-violet-50'
              }`}
            >
              <Trophy className="w-5 h-5 mr-2 inline animate-twinkle" />
              Voting Mode ✨
            </button>
          </div>
        </div>

        {/* Voting Mode */}
        {viewMode === 'voting' ? (
          <VotingCarousel places={places} onVote={handleVote} />
        ) : (
          /* Browse Mode */
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <RoomMembersList members={currentRoom.members} />
              
              {showPreferences && user.preferences && (
                <PreferencesDisplay
                  preferences={user.preferences}
                  onEdit={() => setShowPreferencesForm(true)}
                  title="Current Outing Preferences"
                />
              )}
              
              {topPlace && (
                <Card className="p-4">
                  <div className="flex items-center mb-3">
                    <Trophy className="w-6 h-6 mr-2 text-yellow-500 animate-heartbeat" />
                    <h3 className="text-lg font-bold gradient-text">Top Choice ✨</h3>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-violet-900">{topPlace.name}</h4>
                    <p className="text-sm text-violet-600 font-medium">{topPlace.address}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-pink-600 font-bold">
                        Score: {Math.round(topPlace.score)} 🌟
                      </span>
                      <span className="text-violet-500 font-medium">
                        {currentRoom.votes.filter(v => v.placeId === topPlace.id).length} votes 💕
                      </span>
                    </div>
                  </div>
                </Card>
              )}

              <div className="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreferences(!showPreferences)}
                  fullWidth
                >
                  <Settings className="w-4 h-4 mr-2 animate-twinkle" />
                  {showPreferences ? 'Hide' : 'Show'} Preferences ✨
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreferencesForm(true)}
                  fullWidth
                >
                  <Settings className="w-4 h-4 mr-2 animate-twinkle" />
                  Change Preferences 💕
                </Button>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold glitter-text">✨ Place Suggestions ✨</h2>
                <div className="flex items-center space-x-4">
                  <p className="text-violet-600 font-semibold">{places.length} magical suggestions 🌟</p>
                  <Button onClick={startVotingMode} size="sm">
                    <Trophy className="w-4 h-4 mr-2 animate-heartbeat" />
                    Start Voting ✨
                  </Button>
                </div>
              </div>

              {places.length === 0 && !loading ? (
                <Card className="p-8 text-center">
                  <p className="text-violet-600 mb-4 font-medium text-lg">No suggestions yet. Click "More Magic" to get AI-powered recommendations! ✨</p>
                  <Button onClick={getNewSuggestions} loading={loading}>Get Magical Suggestions 🌟</Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {places.map((place) => (
                    <PlaceCard
                      key={place.id}
                      place={place}
                      votes={currentRoom.votes}
                      currentUserId={user.id}
                      onVote={handleVote}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Room;