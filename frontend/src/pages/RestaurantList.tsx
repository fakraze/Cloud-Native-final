import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, MapPin } from 'lucide-react';
import { useRestaurants } from '../hooks/useRestaurant';

const RestaurantList: React.FC = () => {
  const { data: restaurants, isLoading, error } = useRestaurants();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Failed to load restaurants. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Restaurants</h1>
        <p className="text-gray-600 mt-2">Choose from our partner restaurants</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants?.map((restaurant) => (
          <Link
            key={restaurant.id}
            to={`/restaurant/${restaurant.id}`}
            className="card hover:shadow-lg transition-shadow duration-200 overflow-hidden"
          >
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={restaurant.imageUrl || '/placeholder-restaurant.jpg'}
                alt={restaurant.name}
                className="w-full h-48 object-cover"
              />
            </div>
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-semibold text-gray-900 line-clamp-1">
                  {restaurant.name}
                </h3>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600">{restaurant.rating.toFixed(1)}</span>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {restaurant.description}
              </p>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>15-30 min</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>Pickup available</span>
                </div>
              </div>
              
              {!restaurant.isActive && (
                <div className="mt-3 bg-red-50 border border-red-200 rounded px-3 py-1">
                  <span className="text-xs text-red-600 font-medium">Currently Closed</span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {restaurants?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No restaurants available at the moment.</p>
        </div>
      )}
    </div>
  );
};

export { RestaurantList };
