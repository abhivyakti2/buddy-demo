import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, Play, Square, Trophy } from 'lucide-react';
import { Place, Vote } from '../../types';
import { useAppDispatch, useAppSelector } from '../../store';
import { startVotingSession, endVotingSession, updateVotingTimer, nextPlace, addVote } from '../../store/slices/roomSlice';
import Button from '../common/Button';
import Card from '../common/Card';
import PlaceCard from './PlaceCard';

interface VotingCarouselProps {
  places: Place[];
  onVote: (placeId: string, value: Vote['value']) => void;
}

const VotingCarousel: React.FC<VotingCarouselProps> = ({ places, onVote }) => {
  const dispatch = useAppDispatch();
  const { currentRoom } = useAppSelector((state) => state.room);
  const { user } = useAppSelector((state) => state.user);
  
  const [hasVotedCurrent, setHasVotedCurrent] = useState(false);

  const votingSession = currentRoom?.votingSession;
  const currentPlaceIndex = votingSession?.currentPlaceIndex || 0;
  const timeLeft = votingSession?.timeLeft || 30;
  const isVotingActive = votingSession?.isActive || false;
  const currentPlace = places[currentPlaceIndex];

  // Timer effect
  useEffect(() => {
    if (!isVotingActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      if (timeLeft > 1) {
        dispatch(updateVotingTimer(timeLeft - 1));
      } else {
        // Time's up - auto vote or move to next
        handleTimeUp();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isVotingActive, timeLeft, dispatch]);

  // Check if user has voted for current place
  useEffect(() => {
    if (currentPlace && user) {
      const userVote = currentRoom?.votes.find(
        v => v.userId === user.id && v.placeId === currentPlace.id
      );
      setHasVotedCurrent(!!userVote);
    }
  }, [currentPlace, user, currentRoom?.votes]);

  const handleTimeUp = () => {
    if (currentPlace && user && !hasVotedCurrent) {
      // Auto-vote as "like" if no vote was cast
      const autoVote: Vote = {
        userId: user.id,
        placeId: currentPlace.id,
        value: 'like',
        timestamp: new Date(),
      };
      dispatch(addVote(autoVote));
      onVote(currentPlace.id, 'like');
    }
    
    // Move to next place or end session
    if (currentPlaceIndex < places.length - 1) {
      dispatch(nextPlace());
      setHasVotedCurrent(false);
    } else {
      dispatch(endVotingSession());
    }
  };

  const handleVote = (placeId: string, value: Vote['value']) => {
    onVote(placeId, value);
    setHasVotedCurrent(true);
    
    // Auto-advance after voting
    setTimeout(() => {
      if (currentPlaceIndex < places.length - 1) {
        dispatch(nextPlace());
        setHasVotedCurrent(false);
      } else {
        dispatch(endVotingSession());
      }
    }, 1000);
  };

  const handleStartVoting = () => {
    dispatch(startVotingSession());
    setHasVotedCurrent(false);
  };

  const handleEndVoting = () => {
    dispatch(endVotingSession());
  };

  const getVotingResults = () => {
    if (!currentRoom) return [];
    
    return places
      .map(place => ({
        ...place,
        voteCount: currentRoom.votes.filter(v => v.placeId === place.id).length,
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
      .sort((a, b) => b.score - a.score);
  };

  // Waiting state - before voting starts
  if (currentRoom?.status === 'waiting') {
    return (
      <div className="text-center py-12">
        <Card className="p-8 max-w-md mx-auto">
          <div className="mb-6">
            <Play className="w-16 h-16 mx-auto text-primary-600 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to Vote?</h3>
            <p className="text-gray-600">
              We'll show you {places.length} suggestions one at a time. You'll have 30 seconds to vote on each place.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="text-sm text-gray-500 space-y-1">
              <p>• Each place gets 30 seconds</p>
              <p>• Vote or we'll auto-like it for you</p>
              <p>• See results after all places</p>
            </div>
            
            <Button onClick={handleStartVoting} size="lg" fullWidth>
              <Play className="w-5 h-5 mr-2" />
              Start Voting Session
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Results state - after voting ends
  if (currentRoom?.status === 'results') {
    const results = getVotingResults();
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <Trophy className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Voting Results</h2>
          <p className="text-gray-600">Here are your group's top choices!</p>
        </div>

        <div className="grid gap-6">
          {results.map((place, index) => (
            <Card key={place.id} className="p-6">
              <div className="flex items-start space-x-4">
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                  index === 0 ? 'bg-yellow-500' : 
                  index === 1 ? 'bg-gray-400' : 
                  index === 2 ? 'bg-amber-600' : 'bg-gray-300'
                }`}>
                  {index + 1}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{place.name}</h3>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary-600">
                        {Math.round(place.score)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {place.voteCount} votes
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-2">{place.address}</p>
                  <p className="text-gray-700">{place.description}</p>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="flex items-center text-red-500">
                        ❤️ {currentRoom?.votes.filter(v => v.placeId === place.id && v.value === 'love').length}
                      </span>
                      <span className="flex items-center text-green-500">
                        👍 {currentRoom?.votes.filter(v => v.placeId === place.id && v.value === 'like').length}
                      </span>
                      <span className="flex items-center text-gray-500">
                        👎 {currentRoom?.votes.filter(v => v.placeId === place.id && v.value === 'dislike').length}
                      </span>
                    </div>
                    
                    <div className="text-sm text-blue-600">
                      AI Score: {Math.round(place.aiScore * 100)}%
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline"
          >
            Start New Session
          </Button>
        </div>
      </div>
    );
  }

  // Voting state - show current place
  if (!currentPlace) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No places to vote on.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Voting Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Place {currentPlaceIndex + 1} of {places.length}
          </h2>
          
          <div className={`flex items-center px-4 py-2 rounded-full ${
            timeLeft <= 10 ? 'bg-red-100 text-red-700' : 
            timeLeft <= 20 ? 'bg-yellow-100 text-yellow-700' : 
            'bg-green-100 text-green-700'
          }`}>
            <Clock className="w-4 h-4 mr-2" />
            <span className="font-mono font-bold">{timeLeft}s</span>
          </div>
        </div>

        <Button 
          onClick={handleEndVoting} 
          variant="outline" 
          size="sm"
        >
          <Square className="w-4 h-4 mr-2" />
          End Voting
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentPlaceIndex + 1) / places.length) * 100}%` }}
        />
      </div>

      {/* Current Place Card */}
      <div className="max-w-2xl mx-auto">
        <PlaceCard
          place={currentPlace}
          votes={currentRoom?.votes || []}
          currentUserId={user?.id || ''}
          onVote={handleVote}
          showTimer={true}
          timeLeft={timeLeft}
          hasVoted={hasVotedCurrent}
        />
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center space-x-2">
        {places.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentPlaceIndex ? 'bg-primary-600' : 
              index < currentPlaceIndex ? 'bg-green-500' : 
              'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default VotingCarousel;