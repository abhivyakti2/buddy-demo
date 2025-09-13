import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Share2, Copy, Clock, Trophy, RefreshCw } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store';
import { addVote, setCurrentRoom } from '../store/slices/roomSlice';
import { setPlaces } from '../store/slices/placesSlice';
import { addNotification } from '../store/slices/uiSlice';
import { roomAPI, placesAPI } from '../services/api';
import socketService from '../services/socket';
import { Vote } from '../types';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import PlaceCard from '../components/room/PlaceCard';
import RoomMembersList from '../components/room/RoomMembersList';

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

  useEffect(() => {
    if (!user || !roomId) {
      navigate('/');
      return;
    }

    const loadRoom = async () => {
      try {
        setLoading(true);
        const roomResponse = await roomAPI.getRoom(roomId);
        dispatch(setCurrentRoom(roomResponse.data));

        // Connect to socket
        socketService.connect(user.id);
        socketService.joinRoom(roomId);

        // Get AI suggestions
        const placesResponse = await placesAPI.getSuggestions(roomId, user.preferences);
        dispatch(setPlaces(placesResponse.data));

        // Set up socket listeners
        socketService.onVoteUpdate((vote) => {
          dispatch(addVote(vote));
        });

        socketService.onNewSuggestions((newPlaces) => {
          dispatch(setPlaces(newPlaces));
        });

      } catch (err) {
        setError('Failed to load room. Please try again.');
        dispatch(addNotification({
          type: 'error',
          message: 'Failed to load room. Please try again.'
        }));
      } finally {
        setLoading(false);
      }
    };

    loadRoom();

    return () => {
      socketService.disconnect();
    };
  }, [roomId, user, navigate, dispatch]);

  useEffect(() => {
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
  }, [currentRoom?.expiresAt]);

  const handleVote = async (placeId: string, value: Vote['value']) => {
    if (!user || !currentRoom) return;

    const vote: Vote = {
      userId: user.id,
      placeId,
      value,
      timestamp: new Date(),
    };

    try {
      await placesAPI.vote(vote);
      socketService.submitVote(vote);
    } catch (err) {
      console.error('Failed to submit vote:', err);
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
    if (!user || !roomId) return;

    try {
      setLoading(true);
      const response = await placesAPI.getSuggestions(roomId, user.preferences);
      dispatch(setPlaces(response.data));
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentRoom.name}</h1>
            <p className="text-gray-600">Room Code: <span className="font-mono font-semibold">{currentRoom.code}</span></p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            {timeLeft > 0 && (
              <div className="flex items-center text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
                <Clock className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">{formatTime(timeLeft)}</span>
              </div>
            )}
            
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share Room
            </Button>
            
            <Button variant="outline" onClick={getNewSuggestions} loading={loading}>
              <RefreshCw className="w-4 h-4 mr-2" />
              New Suggestions
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <RoomMembersList members={currentRoom.members} />
            
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
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Place Suggestions</h2>
              <p className="text-gray-600">{places.length} suggestions</p>
            </div>

            {places.length === 0 && !loading ? (
              <Card className="p-8 text-center">
                <p className="text-gray-600 mb-4">No suggestions yet. Click "New Suggestions" to get AI-powered recommendations!</p>
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
      </div>
    </div>
  );
};

export default Room;