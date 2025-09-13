import React, { useState } from 'react';
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
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Preferences</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Favorite Cuisines
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {cuisineOptions.map((cuisine) => (
              <label key={cuisine} className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.cuisineTypes.includes(cuisine)}
                  onChange={() => handleCuisineChange(cuisine)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">{cuisine}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Price Range
          </label>
          <div className="flex space-x-4">
            {['budget', 'moderate', 'expensive'].map((range) => (
              <label key={range} className="flex items-center">
                <input
                  type="radio"
                  name="priceRange"
                  value={range}
                  checked={preferences.priceRange === range}
                  onChange={(e) => setPreferences(prev => ({
                    ...prev,
                    priceRange: e.target.value as UserPreferences['priceRange'],
                  }))}
                  className="border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 capitalize">{range}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Preferred Atmosphere
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {atmosphereOptions.map((atmosphere) => (
              <label key={atmosphere} className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.atmosphere.includes(atmosphere)}
                  onChange={() => handleAtmosphereChange(atmosphere)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">{atmosphere}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Dietary Restrictions
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {dietaryOptions.map((dietary) => (
              <label key={dietary} className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.dietaryRestrictions.includes(dietary)}
                  onChange={() => handleDietaryChange(dietary)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">{dietary}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Maximum Distance (miles)
          </label>
          <input
            type="range"
            min="1"
            max="50"
            value={preferences.maxDistance}
            onChange={(e) => setPreferences(prev => ({
              ...prev,
              maxDistance: parseInt(e.target.value),
            }))}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>1 mile</span>
            <span className="font-medium">{preferences.maxDistance} miles</span>
            <span>50 miles</span>
          </div>
        </div>

        <div className="flex space-x-4">
          <Button type="submit" className="flex-1">
            Save Preferences
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
};

export default PreferencesForm;