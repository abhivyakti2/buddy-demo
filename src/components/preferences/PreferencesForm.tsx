import React, { useState } from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { UserPreferences } from '../../types';
import Button from '../common/Button';
import Card from '../common/Card';

interface PreferencesFormProps {
  initialPreferences?: UserPreferences;
  onSave: (preferences: UserPreferences) => void;
  onCancel?: () => void;
}

const PreferencesForm: React.FC<PreferencesFormProps> = ({
  initialPreferences,
  onSave,
  onCancel,
}) => {
  const [preferences, setPreferences] = useState<UserPreferences>(
    initialPreferences || {
      cuisineTypes: [],
      priceRange: 'moderate',
      atmosphere: [],
      dietaryRestrictions: [],
      maxDistance: 10,
    }
  );

  const cuisineOptions = [
    'Italian', 'Mexican', 'Chinese', 'Japanese', 'Indian', 'Thai', 
    'Mediterranean', 'American', 'French', 'Greek', 'Korean', 'Vietnamese'
  ];

  const atmosphereOptions = [
    'Casual', 'Fine Dining', 'Family Friendly', 'Romantic', 'Lively', 'Quiet', 'Outdoor Seating'
  ];

  const dietaryOptions = [
    'Vegetarian', 'Vegan', 'Gluten Free', 'Halal', 'Kosher', 'Dairy Free', 'Nut Free'
  ];

  const handleCuisineChange = (cuisine: string) => {
    setPreferences(prev => ({
      ...prev,
      cuisineTypes: prev.cuisineTypes.includes(cuisine)
        ? prev.cuisineTypes.filter(c => c !== cuisine)
        : [...prev.cuisineTypes, cuisine],
    }));
  };

  const handleAtmosphereChange = (atmosphere: string) => {
    setPreferences(prev => ({
      ...prev,
      atmosphere: prev.atmosphere.includes(atmosphere)
        ? prev.atmosphere.filter(a => a !== atmosphere)
        : [...prev.atmosphere, atmosphere],
    }));
  };

  const handleDietaryChange = (dietary: string) => {
    setPreferences(prev => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.includes(dietary)
        ? prev.dietaryRestrictions.filter(d => d !== dietary)
        : [...prev.dietaryRestrictions, dietary],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(preferences);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center mb-6">
        <Sparkles className="w-8 h-8 mr-3 text-pink-500 animate-twinkle" />
        <h2 className="text-3xl font-bold glitter-text">✨ Your Magical Preferences ✨</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-violet-800 mb-4 flex items-center">
            <Heart className="w-5 h-5 mr-2 text-pink-500 animate-heartbeat" />
            Favorite Cuisines 💕
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {cuisineOptions.map((cuisine) => (
              <label key={cuisine} className="flex items-center p-3 rounded-2xl bg-white/20 backdrop-blur-sm border border-pink-200 hover:bg-white/30 transition-all duration-300 cursor-pointer hover:scale-105 shadow-sparkle">
                <input
                  type="checkbox"
                  checked={preferences.cuisineTypes.includes(cuisine)}
                  onChange={() => handleCuisineChange(cuisine)}
                  className="rounded-lg border-pink-300 text-pink-600 focus:ring-pink-500 mr-3"
                />
                <span className="text-sm font-semibold text-violet-800">{cuisine}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-violet-800 mb-4 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-violet-500 animate-twinkle" />
            Price Range 💰
          </label>
          <div className="flex space-x-4 flex-wrap gap-3">
            {['budget', 'moderate', 'expensive'].map((range) => (
              <label key={range} className="flex items-center p-4 rounded-2xl bg-white/20 backdrop-blur-sm border border-violet-200 hover:bg-white/30 transition-all duration-300 cursor-pointer hover:scale-105 shadow-sparkle">
                <input
                  type="radio"
                  name="priceRange"
                  value={range}
                  checked={preferences.priceRange === range}
                  onChange={(e) => setPreferences(prev => ({
                    ...prev,
                    priceRange: e.target.value as UserPreferences['priceRange'],
                  }))}
                  className="border-violet-300 text-violet-600 focus:ring-violet-500 mr-3"
                />
                <span className="text-sm font-semibold text-violet-800 capitalize">{range}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-violet-800 mb-4 flex items-center">
            <Heart className="w-5 h-5 mr-2 text-pink-500 animate-heartbeat" />
            Preferred Atmosphere 🌟
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {atmosphereOptions.map((atmosphere) => (
              <label key={atmosphere} className="flex items-center p-3 rounded-2xl bg-white/20 backdrop-blur-sm border border-pink-200 hover:bg-white/30 transition-all duration-300 cursor-pointer hover:scale-105 shadow-sparkle">
                <input
                  type="checkbox"
                  checked={preferences.atmosphere.includes(atmosphere)}
                  onChange={() => handleAtmosphereChange(atmosphere)}
                  className="rounded-lg border-pink-300 text-pink-600 focus:ring-pink-500 mr-3"
                />
                <span className="text-sm font-semibold text-violet-800">{atmosphere}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-violet-800 mb-4 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-violet-500 animate-twinkle" />
            Dietary Restrictions 🥗
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {dietaryOptions.map((dietary) => (
              <label key={dietary} className="flex items-center p-3 rounded-2xl bg-white/20 backdrop-blur-sm border border-pink-200 hover:bg-white/30 transition-all duration-300 cursor-pointer hover:scale-105 shadow-sparkle">
                <input
                  type="checkbox"
                  checked={preferences.dietaryRestrictions.includes(dietary)}
                  onChange={() => handleDietaryChange(dietary)}
                  className="rounded-lg border-pink-300 text-pink-600 focus:ring-pink-500 mr-3"
                />
                <span className="text-sm font-semibold text-violet-800">{dietary}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-violet-800 mb-4 flex items-center">
            <Heart className="w-5 h-5 mr-2 text-pink-500 animate-heartbeat" />
            Maximum Distance (miles) 🗺️
          </label>
          <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm border border-violet-200 shadow-sparkle">
            <input
              type="range"
              min="1"
              max="50"
              value={preferences.maxDistance}
              onChange={(e) => setPreferences(prev => ({
                ...prev,
                maxDistance: parseInt(e.target.value),
              }))}
              className="w-full h-3 bg-gradient-to-r from-pink-300 to-violet-400 rounded-full appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-violet-700 font-semibold mt-3">
              <span>1 mile 📍</span>
              <span className="font-bold text-pink-600 bg-pink-100 px-3 py-1 rounded-full">{preferences.maxDistance} miles ✨</span>
              <span>50 miles 🌍</span>
            </div>
          </div>
        </div>

        <div className="flex space-x-4 pt-4">
          <Button type="submit" className="flex-1">
            Save Magical Preferences ✨
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel 💕
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
};

export default PreferencesForm;