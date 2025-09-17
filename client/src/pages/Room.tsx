import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Share2, Clock, Trophy, RefreshCw, ChevronLeft, ChevronRight, Play, Square } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store';
import { addVote, setCurrentRoom } from '../store/slices/roomSlice';
import { setPlaces } from '../store/slices/placesSlice';
import { addNotification } from '../store/slices/uiSlice';
import { roomAPI, placesAPI } from '../services/api';
import socketService from '../services/socket';
import { Vote, UserPreferences, Place } from '../types';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import PlaceCard from '../components/room/PlaceCard';
import RoomMembersList from '../components/room/RoomMembersList';
import PreferencesForm from '../components/preferences/PreferencesForm';

const PER_CARD_SECONDS = 30;

const Room: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { user } = useAppSelector((state) => state.user);
  const { currentRoom } = useAppSelector((state) => state.room);
  const { places } = useAppSelector((state) => state.places);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(0); // room expiry (kept)

  // Outing preference override (can be passed from Home via navigation state)
  const initialOutingPrefs = (location.state as any)?.outingPreferences as UserPreferences | undefined;
  const [outingPreferences, setOutingPreferences] = useState<UserPreferences | null>(initialOutingPrefs || null);
  const [showPrefEditor, setShowPrefEditor] = useState(false);

  // Voting carousel state
  const [isVoting, setIsVoting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardTimeLeft, setCardTimeLeft] = useState(PER_CARD_SECONDS);

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

        // Get AI suggestions (use outing override if provided)
        const prefToUse = outingPreferences || user.preferences;
        const placesResponse = await placesAPI.getSuggestions(roomId, prefToUse);
        dispatch(setPlaces(placesResponse.data));

        // Socket listeners
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

  // Room expiration timer (existing)
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

  // Per-card timer for voting carousel
  useEffect(() => {
    if (!isVoting || showResults || places.length === 0) return;
    setCardTimeLeft(PER_CARD_SECONDS); // reset whenever index changes while voting
    const interval = setInterval(() => {
      setCardTimeLeft((prev) => {
        if (prev <= 1) {
          // advance automatically
          if (currentIndex < places.length - 1) {
            setCurrentIndex((i) => i + 1);
            return PER_CARD_SECONDS; // next card reset
          } else {
            // finished
            clearInterval(interval);
            setIsVoting(false);
            setShowResults(true);
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVoting, currentIndex, places.length, showResults]);

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
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Join our outing planning!',
          text: `Help us decide where to go! Room: ${currentRoom?.name}`,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        dispatch(addNotification({ type: 'success', message: 'Room link copied to clipboard!' }));
      }
    } catch (err) {
      dispatch(addNotification({ type: 'error', message: 'Share failed. Try copy link instead.' }));
    }
  };

  const getNewSuggestions = async () => {
    if (!user || !roomId) return;

    try {
      setLoading(true);
      const response = await placesAPI.getSuggestions(roomId, outingPreferences || user.preferences);
      dispatch(setPlaces(response.data));
      dispatch(addNotification({ type: 'success', message: 'New suggestions loaded!' }));
    } catch (err) {
      setError('Failed to get new suggestions.');
      dispatch(addNotification({ type: 'error', message: 'Failed to get new suggestions.' }));
    } finally {
      setLoading(false);
    }
  };

  const startVoting = () => {
    if (places.length === 0) {
      dispatch(addNotification({ type: 'warning', message: 'No suggestions to vote on yet.' }));
      return;
    }
    setShowResults(false);
    setIsVoting(true);
    setCurrentIndex(0);
    setCardTimeLeft(PER_CARD_SECONDS);
  };

  const endVoting = () => {
    setIsVoting(false);
    setShowResults(true);
  };

  const nextCard = () => {
    if (currentIndex < places.length - 1) {
      setCurrentIndex((i) => i + 1);
      setCardTimeLeft(PER_CARD_SECONDS);
    } else {
      endVoting();
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setCardTimeLeft(PER_CARD_SECONDS);
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

  const scoredPlaces = useMemo(() => {
    return places
      .map((place) => {
        const base = currentRoom.votes
          .filter((v) => v.placeId === place.id)
          .reduce((acc, vote) => {
            switch (vote.value) {
              case 'love':
                return acc + 3;
              case 'like':
                return acc + 1;
              case 'dislike':
                return acc - 1;
              default:
                return acc;
            }
          }, 0);
        const score = base + place.aiScore * 10;
        return { ...place, score } as Place & { score: number };
      })
      .sort((a, b) => b.score - a.score);
  }, [places, currentRoom.votes]);

  const topPlace = scoredPlaces[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentRoom.name}</h1>
            <p className="text-gray-600">Room Code: <span className="font-mono font-semibold">{currentRoom.code}</span></p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            {isVoting && (
              <div className="flex items-center text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
                <Clock className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">{formatTime(cardTimeLeft)}</span>
              </div>
            )}
            {!isVoting && timeLeft > 0 && (
              <div className="hidden sm:flex items-center text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                <Clock className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">Room {formatTime(timeLeft)} left</span>
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
            {!isVoting && !showResults && (
              <Button onClick={startVoting}>
                <Play className="w-4 h-4 mr-2" /> Start Voting
              </Button>
            )}
            {isVoting && (
              <Button variant="secondary" onClick={endVoting}>
                <Square className="w-4 h-4 mr-2" /> End Voting
              </Button>
            )}
            <Button variant="outline" onClick={() => setShowPrefEditor((v) => !v)}>
              Adjust Outing Preferences
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">{error}</div>
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
                    <span className="text-green-600 font-medium">Score: {Math.round((topPlace as any).score)}</span>
                    <span className="text-gray-500">{currentRoom.votes.filter((v) => v.placeId === topPlace.id).length} votes</span>
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

            {showPrefEditor && (
              <Card className="p-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Outing Preferences (this session only)</h3>
                <PreferencesForm
                  initialPreferences={outingPreferences || user.preferences}
                  onSave={async (prefs) => {
                    setOutingPreferences(prefs);
                    setShowPrefEditor(false);
                    try {
                      setLoading(true);
                      const resp = await placesAPI.getSuggestions(roomId!, prefs);
                      dispatch(setPlaces(resp.data));
                      dispatch(addNotification({ type: 'success', message: 'Updated suggestions for this outing.' }));
                    } catch (err) {
                      dispatch(addNotification({ type: 'error', message: 'Failed to update suggestions.' }));
                    } finally {
                      setLoading(false);
                    }
                  }}
                  onCancel={() => setShowPrefEditor(false)}
                />
              </Card>
            )}

            {places.length === 0 && !loading ? (
              <Card className="p-8 text-center">
                <p className="text-gray-600 mb-4">No suggestions yet. Click "New Suggestions" to get AI-powered recommendations!</p>
                <Button onClick={getNewSuggestions} loading={loading}>Get Suggestions</Button>
              </Card>
            ) : showResults ? (
              // Results carousel
              <div className="relative">
                {scoredPlaces.length > 0 && (
                  <div>
                    <div className="mb-3 text-sm text-gray-600 text-center">Results ranked by votes + AI score</div>
                    <div className="relative">
                      <PlaceCard
                        key={scoredPlaces[currentIndex]?.id}
                        place={scoredPlaces[currentIndex]}
                        votes={currentRoom.votes}
                        currentUserId={user.id}
                        onVote={handleVote}
                      />
                      <div className="flex items-center justify-between mt-3">
                        <Button variant="outline" onClick={prevCard} disabled={currentIndex === 0}>
                          <ChevronLeft className="w-4 h-4 mr-1" /> Prev
                        </Button>
                        <div className="flex items-center space-x-1">
                          {scoredPlaces.map((_, i) => (
                            <span
                              key={i}
                              className={`w-2 h-2 rounded-full ${i === currentIndex ? 'bg-blue-600' : 'bg-gray-300'}`}
                            />
                          ))}
                        </div>
                        <Button variant="outline" onClick={nextCard} disabled={currentIndex === scoredPlaces.length - 1}>
                          Next <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Voting carousel
              <div className="relative">
                {places[currentIndex] && (
                  <div>
                    <div className="flex items-center justify-between mb-3 text-sm text-gray-600">
                      <span>
                        Suggestion {currentIndex + 1} of {places.length}
                      </span>
                      {isVoting && (
                        <span className="text-orange-600 font-medium">Time left: {formatTime(cardTimeLeft)}</span>
                      )}
                    </div>
                    <PlaceCard
                      key={places[currentIndex].id}
                      place={places[currentIndex]}
                      votes={currentRoom.votes}
                      currentUserId={user.id}
                      onVote={handleVote}
                    />
                    <div className="flex items-center justify-between mt-3">
                      <Button variant="outline" onClick={prevCard} disabled={currentIndex === 0}>
                        <ChevronLeft className="w-4 h-4 mr-1" /> Prev
                      </Button>
                      <div className="flex items-center space-x-1">
                        {places.map((_, i) => (
                          <span key={i} className={`w-2 h-2 rounded-full ${i === currentIndex ? 'bg-blue-600' : 'bg-gray-300'}`} />
                        ))}
                      </div>
                      <Button variant="outline" onClick={nextCard}>
                        {currentIndex === places.length - 1 ? (
                          <>Finish <ChevronRight className="w-4 h-4 ml-1" /></>
                        ) : (
                          <>Next <ChevronRight className="w-4 h-4 ml-1" /></>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Room;