import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Clock, MapPin } from 'lucide-react';
import { useRestaurant, useMenu } from '../hooks/useRestaurant';

const RestaurantDetail: React.FC = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const { data: restaurant, isLoading: restaurantLoading } = useRestaurant(restaurantId!);
  const { data: menu, isLoading: menuLoading } = useMenu(restaurantId!);

  const isLoading = restaurantLoading || menuLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Restaurant not found.</p>
      </div>
    );
  }

  const categories = [...new Set(menu?.map(item => item.category) || [])];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Back button */}
      <Link 
        to="/restaurant" 
        className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Restaurants</span>
      </Link>

      {/* Restaurant Header */}
      <div className="card mb-8">
        <div className="md:flex">
          <div className="md:w-1/3">
            <img
              src={restaurant.imageUrl || '/placeholder-restaurant.jpg'}
              alt={restaurant.name}
              className="w-full h-64 md:h-48 object-cover rounded-lg"
            />
          </div>
          <div className="md:w-2/3 md:pl-8 mt-6 md:mt-0">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{restaurant.name}</h1>
              <div className="flex items-center space-x-1">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="text-lg font-medium">{restaurant.rating.toFixed(1)}</span>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6">{restaurant.description}</p>
            
            <div className="flex items-center space-x-6 text-sm text-gray-500">
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
              <div className="mt-4 bg-red-50 border border-red-200 rounded px-4 py-2">
                <span className="text-red-600 font-medium">Currently Closed</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="space-y-8">
        {categories.map(category => {
          const categoryItems = menu?.filter(item => item.category === category && item.isAvailable) || [];
          
          if (categoryItems.length === 0) return null;
          
          return (
            <div key={category}>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryItems.map(item => (
                  <Link
                    key={item.id}
                    to={`/restaurant/${restaurantId}/menu/${item.id}`}
                    className="card hover:shadow-lg transition-shadow duration-200 overflow-hidden"
                  >
                    <img
                      src={item.imageUrl || '/placeholder-food.jpg'}
                      alt={item.name}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{item.name}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-blue-600">${item.price.toFixed(2)}</span>
                        <button className="btn-primary text-sm px-3 py-1">
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {menu?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No menu items available.</p>
        </div>
      )}
    </div>
  );
};

export { RestaurantDetail };
