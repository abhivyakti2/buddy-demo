import React from 'react';
import { Settings, Edit3 } from 'lucide-react';
import { UserPreferences } from '../../types';
import Button from '../common/Button';
import Card from '../common/Card';

interface PreferencesDisplayProps {
  preferences: UserPreferences;
  onEdit: () => void;
  title?: string;
  showEditButton?: boolean;
}

const PreferencesDisplay: React.FC<PreferencesDisplayProps> = ({ 
  preferences, 
  onEdit, 
  title = "Your Preferences",
  showEditButton = true 
}) => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Settings className="w-5 h-5 mr-2 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        {showEditButton && (
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit3 className="w-4 h-4 mr-1" />
            Edit
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Favorite Cuisines</h4>
          <div className="flex flex-wrap gap-2">
            {preferences.cuisineTypes.length > 0 ? (
              preferences.cuisineTypes.map((cuisine) => (
                <span
                  key={cuisine}
                  className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                >
                  {cuisine}
                </span>
              ))
            ) : (
              <span className="text-gray-500 text-sm">No preferences set</span>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Price Range</h4>
          <span className="px-3 py-1 bg-secondary-100 text-secondary-800 rounded-full text-sm capitalize">
            {preferences.priceRange}
          </span>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Preferred Atmosphere</h4>
          <div className="flex flex-wrap gap-2">
            {preferences.atmosphere.length > 0 ? (
              preferences.atmosphere.map((atm) => (
                <span
                  key={atm}
                  className="px-3 py-1 bg-accent-100 text-accent-800 rounded-full text-sm"
                >
                  {atm}
                </span>
              ))
            ) : (
              <span className="text-gray-500 text-sm">No preferences set</span>
            )}
          </div>
        </div>

        {preferences.dietaryRestrictions.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Dietary Restrictions</h4>
            <div className="flex flex-wrap gap-2">
              {preferences.dietaryRestrictions.map((dietary) => (
                <span
                  key={dietary}
                  className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                >
                  {dietary}
                </span>
              ))}
            </div>
          </div>
        )}

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Maximum Distance</h4>
          <span className="text-gray-900 font-medium">{preferences.maxDistance} miles</span>
        </div>
      </div>
    </Card>
  );
};

export default PreferencesDisplay;