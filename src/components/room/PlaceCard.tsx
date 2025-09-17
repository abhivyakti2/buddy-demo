import React from 'react';
import { MapPin, Star, Heart, ThumbsUp, ThumbsDown, ExternalLink, Clock } from 'lucide-react';
import { Place, Vote } from '../../types';
import Button from '../common/Button';
import Card from '../common/Card';

interface PlaceCardProps {
  place: Place;
  votes: Vote[];
  currentUserId: string;
  onVote: (placeId: string, value: Vote['value']) => void;
  showTimer?: boolean;
  timeLeft?: number;
  hasVoted?: boolean;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ 
  place, 
  votes, 
  currentUserId, 
  onVote, 
  showTimer = false, 
  timeLeft = 0,
  hasVoted = false 
}) => {
  const placeVotes = votes.filter(v => v.placeId === place.id);
  const userVote = placeVotes.find(v => v.userId === currentUserId);
  
  const voteCount = {
    love: placeVotes.filter(v => v.value === 'love').length,
    like: placeVotes.filter(v => v.value === 'like').length,
    dislike: placeVotes.filter(v => v.value === 'dislike').length,
  };

  const openInMaps = () => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      place.name + ' ' + place.address
    )}`;
    window.open(mapsUrl, '_blank');
  };

  const shareLocation = () => {
    const shareText = `Let's meet at ${place.name}! ${place.address}`;
    if (navigator.share) {
      navigator.share({
        title: place.name,
        text: shareText,
        url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          place.name + ' ' + place.address
        )}`,
      });
    } else {
      navigator.clipboard.writeText(shareText);
    }
  };

  return (
    <Card hoverable className="overflow-hidden">
      {showTimer && (
        <div className={`p-3 text-center font-mono font-bold ${
          timeLeft <= 10 ? 'bg-red-100 text-red-700' : 
          timeLeft <= 20 ? 'bg-yellow-100 text-yellow-700' : 
          'bg-green-100 text-green-700'
        }`}>
          <Clock className="w-4 h-4 inline mr-2" />
          {timeLeft}s remaining
        </div>
      )}
      
      {place.photos.length > 0 && (
        <div className="h-48 overflow-hidden">
          <img
            src={place.photos[0]}
            alt={place.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-900">{place.name}</h3>
          <div className="flex items-center text-yellow-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="ml-1 text-sm font-medium">{place.rating}</span>
          </div>
        </div>
        
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{place.address}</span>
        </div>
        
        <p className="text-gray-700 mb-4">{place.description}</p>
        
        {place.reasons.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-800 mb-2">AI Recommendation:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {place.reasons.map((reason, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span className="flex items-center">
              <Heart className="w-4 h-4 mr-1 text-red-500" />
              {voteCount.love}
            </span>
            <span className="flex items-center">
              <ThumbsUp className="w-4 h-4 mr-1 text-green-500" />
              {voteCount.like}
            </span>
            <span className="flex items-center">
              <ThumbsDown className="w-4 h-4 mr-1 text-red-500" />
              {voteCount.dislike}
            </span>
          </div>
          
          <div className="text-sm font-medium text-blue-600">
            AI Score: {Math.round(place.aiScore * 100)}%
          </div>
        </div>
        
        {hasVoted && showTimer && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg text-center">
            ✓ Vote recorded! Moving to next place...
          </div>
        )}
        
        <div className="flex space-x-2 mb-4">
          <Button
            size="sm"
            variant={userVote?.value === 'love' ? 'primary' : 'outline'}
            onClick={() => onVote(place.id, 'love')}
            className="flex-1"
            disabled={hasVoted && showTimer}
          >
            <Heart className="w-4 h-4 mr-1" />
            Love
          </Button>
          <Button
            size="sm"
            variant={userVote?.value === 'like' ? 'secondary' : 'outline'}
            onClick={() => onVote(place.id, 'like')}
            className="flex-1"
            disabled={hasVoted && showTimer}
          >
            <ThumbsUp className="w-4 h-4 mr-1" />
            Like
          </Button>
          <Button
            size="sm"
            variant={userVote?.value === 'dislike' ? 'outline' : 'ghost'}
            onClick={() => onVote(place.id, 'dislike')}
            className="flex-1"
            disabled={hasVoted && showTimer}
          >
            <ThumbsDown className="w-4 h-4 mr-1" />
            Pass
          </Button>
        </div>
        
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" onClick={openInMaps} className="flex-1">
            <MapPin className="w-4 h-4 mr-1" />
            Maps
          </Button>
          <Button size="sm" variant="outline" onClick={shareLocation} className="flex-1">
            <ExternalLink className="w-4 h-4 mr-1" />
            Share
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default PlaceCard;