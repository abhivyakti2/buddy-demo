import React, { useState } from 'react';
import { Calendar, Heart, Users, Briefcase, Coffee, Music, Gift, Star } from 'lucide-react';
import Button from '../common/Button';
import Card from '../common/Card';

interface OccasionSelectorProps {
  onSelect: (occasion: string, mood: string) => void;
  onSkip: () => void;
}

const OccasionSelector: React.FC<OccasionSelectorProps> = ({ onSelect, onSkip }) => {
  const [selectedOccasion, setSelectedOccasion] = useState('');
  const [selectedMood, setSelectedMood] = useState('');

  const occasions = [
    { id: 'date', label: 'Date Night', icon: Heart, color: 'text-red-500' },
    { id: 'friends', label: 'Friends Hangout', icon: Users, color: 'text-blue-500' },
    { id: 'business', label: 'Business Meeting', icon: Briefcase, color: 'text-gray-600' },
    { id: 'casual', label: 'Casual Meal', icon: Coffee, color: 'text-amber-600' },
    { id: 'celebration', label: 'Celebration', icon: Gift, color: 'text-purple-500' },
    { id: 'family', label: 'Family Gathering', icon: Users, color: 'text-green-500' },
  ];

  const moods = [
    { id: 'romantic', label: 'Romantic', icon: Heart, color: 'text-pink-500' },
    { id: 'energetic', label: 'Energetic', icon: Music, color: 'text-orange-500' },
    { id: 'relaxed', label: 'Relaxed', icon: Coffee, color: 'text-blue-400' },
    { id: 'sophisticated', label: 'Sophisticated', icon: Star, color: 'text-purple-600' },
    { id: 'fun', label: 'Fun & Lively', icon: Music, color: 'text-yellow-500' },
    { id: 'intimate', label: 'Intimate', icon: Heart, color: 'text-red-400' },
  ];

  const handleSubmit = () => {
    if (selectedOccasion && selectedMood) {
      onSelect(selectedOccasion, selectedMood);
    }
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <Calendar className="w-12 h-12 mx-auto text-primary-600 mb-3" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">What's the Occasion?</h2>
        <p className="text-gray-600">Help us suggest the perfect places for your outing</p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Type of Outing</h3>
          <div className="grid grid-cols-2 gap-3">
            {occasions.map((occasion) => {
              const Icon = occasion.icon;
              return (
                <button
                  key={occasion.id}
                  onClick={() => setSelectedOccasion(occasion.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    selectedOccasion === occasion.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-5 h-5 ${occasion.color}`} />
                    <span className="font-medium text-gray-900">{occasion.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Desired Mood</h3>
          <div className="grid grid-cols-2 gap-3">
            {moods.map((mood) => {
              const Icon = mood.icon;
              return (
                <button
                  key={mood.id}
                  onClick={() => setSelectedMood(mood.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    selectedMood === mood.id
                      ? 'border-secondary-500 bg-secondary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-5 h-5 ${mood.color}`} />
                    <span className="font-medium text-gray-900">{mood.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex space-x-3">
          <Button
            onClick={handleSubmit}
            disabled={!selectedOccasion || !selectedMood}
            className="flex-1"
          >
            Continue with Selection
          </Button>
          <Button
            onClick={onSkip}
            variant="outline"
            className="flex-1"
          >
            Skip for Now
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default OccasionSelector;