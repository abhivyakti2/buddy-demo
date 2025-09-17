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
    <Card hoverable className="overflow-hidden animate-float">
      {showTimer && (
        <div className={`p-4 text-center font-bold text-lg ${
          timeLeft <= 10 ? 'bg-red-100 text-red-700' : 
          timeLeft <= 20 ? 'bg-yellow-100 text-yellow-700' : 
          'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700'
        }`}>
          <Clock className="w-5 h-5 inline mr-2 animate-twinkle" />
          {timeLeft}s remaining ⏰
        </div>
      )}
      
      {place.photos.length > 0 && (
        <div className="h-48 overflow-hidden relative">
          <img
            src={place.photos[0]}
            alt={place.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
      )}
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold gradient-text">{place.name}</h3>
          <div className="flex items-center text-yellow-500 bg-yellow-50 px-2 py-1 rounded-full">
            <Star className="w-4 h-4 fill-current animate-twinkle" />
            <span className="ml-1 text-sm font-bold">{place.rating}</span>
          </div>
        </div>
        
        <div className="flex items-center text-violet-600 mb-3">
          <MapPin className="w-4 h-4 mr-2 animate-twinkle" />
          <span className="text-sm font-medium">{place.address}</span>
        </div>
        
        <p className="text-violet-700 mb-4 font-medium">{place.description}</p>
        
        {place.reasons.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-bold text-pink-800 mb-2">✨ AI Recommendation:</h4>
            <ul className="text-sm text-violet-600 space-y-1">
              {place.reasons.map((reason, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-2 h-2 bg-gradient-to-r from-pink-400 to-violet-500 rounded-full mt-1.5 mr-3 flex-shrink-0 animate-twinkle"></span>
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm font-medium">
            <span className="flex items-center">
              <Heart className="w-4 h-4 mr-1 text-red-500 animate-heartbeat" />
              {voteCount.love}
            </span>
            <span className="flex items-center">
              <ThumbsUp className="w-4 h-4 mr-1 text-green-500 animate-twinkle" />
              {voteCount.like}
            </span>
            <span className="flex items-center">
              <ThumbsDown className="w-4 h-4 mr-1 text-gray-500 animate-twinkle" />
              {voteCount.dislike}
            </span>
          </div>
          
          <div className="text-sm font-bold text-pink-600 bg-pink-50 px-2 py-1 rounded-full">
            AI Score: {Math.round(place.aiScore * 100)}% ✨
          </div>
        </div>
        
        {hasVoted && showTimer && (
          <div className="mb-4 p-4 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-2xl text-center font-bold shadow-sparkle">
            ✓ Vote recorded! Moving to next place... 💕
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
            <Heart className="w-4 h-4 mr-1 animate-heartbeat" />
            Love 💕
          </Button>
          <Button
            size="sm"
            variant={userVote?.value === 'like' ? 'secondary' : 'outline'}
            onClick={() => onVote(place.id, 'like')}
            className="flex-1"
            disabled={hasVoted && showTimer}
          >
            <ThumbsUp className="w-4 h-4 mr-1 animate-twinkle" />
            Like ✨
          </Button>
          <Button
            size="sm"
            variant={userVote?.value === 'dislike' ? 'outline' : 'ghost'}
            onClick={() => onVote(place.id, 'dislike')}
            className="flex-1"
            disabled={hasVoted && showTimer}
          >
            <ThumbsDown className="w-4 h-4 mr-1 animate-twinkle" />
            Pass 🤷‍♀️
          </Button>
        </div>
        
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" onClick={openInMaps} className="flex-1">
            <MapPin className="w-4 h-4 mr-1 animate-twinkle" />
            Maps 🗺️
          </Button>
          <Button size="sm" variant="outline" onClick={shareLocation} className="flex-1">
            <ExternalLink className="w-4 h-4 mr-1 animate-twinkle" />
            Share 💕
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default PlaceCard;