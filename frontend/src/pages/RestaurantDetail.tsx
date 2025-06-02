import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Clock, MapPin, Heart, Award, ChefHat, Plus } from 'lucide-react';
import { useRestaurant, useMenu } from '../hooks/useRestaurant';
import { useDishAverageRating } from '../hooks/useRating';

const RestaurantDetail: React.FC = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const { data: restaurant, isLoading: restaurantLoading } = useRestaurant(restaurantId!);
  const { data: menu, isLoading: menuLoading } = useMenu(restaurantId!);

  const isLoading = restaurantLoading || menuLoading;
  // Component to display dish rating
  const DishRating: React.FC<{ dishId: string }> = ({ dishId }) => {
    const { data: rating, isLoading } = useDishAverageRating(dishId);

    if (isLoading) {
      return (
        <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-2">
          <div className="animate-pulse flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <div key={star} className="h-4 w-4 bg-gray-200 rounded"></div>
            ))}
          </div>
          <span className="text-xs text-gray-400">Loading...</span>
        </div>
      );
    }

    if (!rating || rating.count === 0) {
      return (
        <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-2">
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="h-4 w-4 text-gray-300" />
            ))}
          </div>
          <span className="text-xs text-gray-500">No ratings yet</span>
        </div>
      );
    }    return (
      <div className={`flex items-center space-x-2 rounded-lg p-2 border ${
        rating.rating >= 4.5 
          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
          : rating.rating >= 4.0 
          ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200'
          : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-4 w-4 ${
                star <= rating.rating
                  ? rating.rating >= 4.5 
                    ? 'text-green-500 fill-current' 
                    : 'text-yellow-500 fill-current'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className={`text-xs font-semibold ${
          rating.rating >= 4.5 ? 'text-green-700' : 'text-gray-700'
        }`}>
          {rating.rating.toFixed(1)} ({rating.count} review{rating.count !== 1 ? 's' : ''})
        </span>
        {rating.rating >= 4.5 && (
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
            ⭐ Top Rated
          </span>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="loading-skeleton h-8 w-48 mb-8"></div>
        
        <div className="glass-card p-8 mb-8">
          <div className="md:flex gap-8">
            <div className="md:w-1/3">
              <div className="loading-skeleton h-64 rounded-xl"></div>
            </div>
            <div className="md:w-2/3 mt-6 md:mt-0 space-y-4">
              <div className="loading-skeleton h-8 w-3/4"></div>
              <div className="loading-skeleton h-6 w-full"></div>
              <div className="loading-skeleton h-6 w-2/3"></div>
              <div className="flex gap-4">
                <div className="loading-skeleton h-10 w-24"></div>
                <div className="loading-skeleton h-10 w-24"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-8">
          {[...Array(3)].map((_, i) => (
            <div key={i}>
              <div className="loading-skeleton h-8 w-32 mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, j) => (
                  <div key={j} className="card p-4 space-y-4">
                    <div className="loading-skeleton h-32 rounded-lg"></div>
                    <div className="loading-skeleton h-6 w-3/4"></div>
                    <div className="loading-skeleton h-4 w-full"></div>
                    <div className="loading-skeleton h-4 w-2/3"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="glass-card p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ChefHat className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Restaurant not found</h3>
          <p className="text-gray-600 mb-4">The restaurant you're looking for doesn't exist.</p>
          <Link to="/restaurant" className="btn-primary">
            Browse Restaurants
          </Link>
        </div>
      </div>
    );
  }

  const categories = [...new Set(menu?.map(item => item.category) || [])];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <Link 
        to="/restaurant" 
        className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors group"
      >
        <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Back to Restaurants</span>
      </Link>

      {/* Restaurant Header */}
      <div className="glass-card p-8 mb-8 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-100/50 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
        
        <div className="md:flex gap-8 relative z-10">
          <div className="md:w-1/3">
            <div className="relative">
              <img
                src={restaurant.imageUrl || '/placeholder-restaurant.jpg'}
                alt={restaurant.name}
                className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-xl"
              />
              <button className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all duration-300">
                <Heart className="h-6 w-6 text-gray-600 hover:text-red-500 transition-colors" />
              </button>
            </div>
          </div>
          
          <div className="md:w-2/3 mt-8 md:mt-0">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{restaurant.name}</h1>                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1 bg-yellow-50 px-3 py-1 rounded-xl">
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <span className="text-lg font-bold text-yellow-700">{restaurant.rating.toFixed(1)}</span>
                    <span className="text-sm text-yellow-600">(150+ reviews)</span>
                  </div>
                  <Link
                    to={`/restaurant/${restaurantId}/rate`}
                    className="flex items-center space-x-1 bg-blue-50 px-3 py-1 rounded-xl hover:bg-blue-100 transition-colors duration-200"
                  >
                    <Star className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">View Reviews</span>
                  </Link>
                  <div className="flex items-center space-x-1 bg-green-50 px-3 py-1 rounded-xl">
                    <Award className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-green-700">Verified</span>
                  </div>
                </div>
              </div>
              
              {!restaurant.isActive && (
                <div className="badge-danger">
                  Currently Closed
                </div>
              )}
            </div>
            
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">{restaurant.description}</p>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="flex items-center space-x-3 bg-blue-50 p-4 rounded-xl">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Delivery Time</div>
                  <div className="text-blue-600 font-medium">15-30 minutes</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 bg-green-50 p-4 rounded-xl">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Pickup</div>
                  <div className="text-green-600 font-medium">Available</div>
                </div>
              </div>
            </div>
            
            {/* Cuisine Tags */}
            <div className="flex flex-wrap gap-2">
              <span className="badge bg-purple-100 text-purple-800">Italian</span>
              <span className="badge bg-orange-100 text-orange-800">Pizza</span>
              <span className="badge bg-red-100 text-red-800">Pasta</span>
              <span className="badge bg-green-100 text-green-800">Vegetarian Options</span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Categories */}
      <div className="space-y-12">
        {categories.map(category => {
          const categoryItems = menu?.filter(item => item.category === category && item.isAvailable) || [];
          
          if (categoryItems.length === 0) return null;
          
          return (
            <div key={category} className="space-y-6">
              <div className="flex items-center space-x-4">
                <h2 className="text-3xl font-bold text-gray-900">{category}</h2>
                <div className="h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex-1 max-w-24"></div>
                <span className="text-sm text-gray-500 font-medium">{categoryItems.length} items</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryItems.map(item => (
                  <Link
                    key={item.id}
                    to={`/restaurant/${restaurantId}/menu/${item.id}`}
                    className="card-hover group overflow-hidden"
                  >
                    <div className="relative">
                      <img
                        src={item.imageUrl || '/placeholder-food.jpg'}
                        alt={item.name}
                        className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Quick Add Button */}
                      <button className="absolute bottom-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110">
                        <Plus className="h-5 w-5 text-gray-700" />
                      </button>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors line-clamp-1">
                          {item.name}
                        </h3>
                        <div className="text-xl font-bold gradient-text">${item.price.toFixed(2)}</div>
                      </div>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                      
                      {/* Dish Rating */}
                      <div className="mb-3">
                        <DishRating dishId={item.id} />
                      </div>
                      
                      {/* Item Tags */}
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          <span className="badge bg-blue-50 text-blue-700 text-xs">Popular</span>
                          <span className="badge bg-green-50 text-green-700 text-xs">Healthy</span>
                        </div>
                        
                        <button className="btn-primary !py-2 !px-4 text-sm">
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
      </div>      {/* Empty Menu State */}
      {menu?.length === 0 && (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ChefHat className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No menu available</h3>
          <p className="text-gray-600 text-lg max-w-md mx-auto">
            This restaurant hasn't uploaded their menu yet. Please check back later!
          </p>
        </div>
      )}
    </div>
  );
};

export { RestaurantDetail };
