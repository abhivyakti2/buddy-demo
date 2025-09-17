import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Share2, Copy, Clock, Trophy, RefreshCw, Settings, Users as UsersIcon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store';
import { addVote, setCurrentRoom, updateRoomStatus } from '../store/slices/roomSlice';
import { setPlaces } from '../store/slices/placesSlice';
import { addNotification } from '../store/slices/uiSlice';
import { Vote } from '../types';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import PlaceCard from '../components/room/PlaceCard';
import RoomMembersList from '../components/room/RoomMembersList';
import VotingCarousel from '../components/room/VotingCarousel';
import PreferencesDisplay from '../components/preferences/PreferencesDisplay';
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

  const startVotingMode = () => {
    setViewMode('voting');
    dispatch(updateRoomStatus('voting'));
    dispatch(addNotification({
      type: 'info',
      message: 'Starting voting session! Vote on each place.'
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentRoom.name}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Room Code: <span className="font-mono font-semibold text-primary-600">{currentRoom.code}</span></span>
              {currentRoom.occasion && (
                <span>• {currentRoom.occasion} ({currentRoom.mood})</span>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            {timeLeft > 0 && (
              <div className="flex items-center text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
                <Clock className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">{formatTime(timeLeft)}</span>
              </div>
            )}
            
            <Button variant="outline" size="sm" onClick={() => setShowOccasionSelector(true)}>
              <Settings className="w-4 h-4 mr-2" />
              Occasion
            </Button>
            
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            
            <Button variant="outline" size="sm" onClick={getNewSuggestions} loading={loading}>
              <RefreshCw className="w-4 h-4 mr-2" />
              More Places
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* View Mode Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl p-1 shadow-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'grid'
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <UsersIcon className="w-4 h-4 mr-2 inline" />
              Browse Mode
            </button>
            <button
              onClick={startVotingMode}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'voting'
                  ? 'bg-secondary-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Trophy className="w-4 h-4 mr-2 inline" />
              Voting Mode
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
                  onEdit={() => setShowPreferences(false)}
                  showEditButton={false}
                />
              )}
              
              {topPlace && (
                <Card className="p-4">
                  <div className="flex items-center mb-3">
                    <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                    <h3 className="text-lg font-semibold text-gray-900">Top Choice</h3>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">{topPlace.name}</h4>
                    <p className="text-sm text-gray-600">{topPlace.address}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-green-600 font-medium">
                        Score: {Math.round(topPlace.score)}
                      </span>
                      <span className="text-gray-500">
                        {currentRoom.votes.filter(v => v.placeId === topPlace.id).length} votes
                      </span>
                    </div>
                  </div>
                </Card>
              )}

              <div className="text-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreferences(!showPreferences)}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  {showPreferences ? 'Hide' : 'Show'} Preferences
                </Button>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Place Suggestions</h2>
                <div className="flex items-center space-x-4">
                  <p className="text-gray-600">{places.length} suggestions</p>
                  <Button onClick={startVotingMode} size="sm">
                    <Trophy className="w-4 h-4 mr-2" />
                    Start Voting
                  </Button>
                </div>
              </div>

              {places.length === 0 && !loading ? (
                <Card className="p-8 text-center">
                  <p className="text-gray-600 mb-4">No suggestions yet. Click "More Places" to get AI-powered recommendations!</p>
                  <Button onClick={getNewSuggestions} loading={loading}>Get Suggestions</Button>
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