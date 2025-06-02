import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, User, Calendar, MessageSquare, ChevronDown } from 'lucide-react';
import { useRestaurant } from '../hooks/useRestaurant';
import { useRatings } from '../hooks/useRating';
import { RestaurantRating } from '../types/rating';

const RestaurantRatings: React.FC = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<'date' | 'taste' | 'value' | 'overall'>('date');

  const { data: restaurant, isLoading: restaurantLoading } = useRestaurant(restaurantId!);
  const { data: allRatings, isLoading: ratingsLoading, error } = useRatings(restaurantId!);

  // Filter to only restaurant ratings and cast the type
  const ratings: RestaurantRating[] = (allRatings || []).filter(
    (rating): rating is RestaurantRating => rating.type === 'restaurant'
  );

  const isLoading = restaurantLoading || ratingsLoading;

  const calculateAverageRating = (ratings: RestaurantRating[], type: 'taste' | 'value' | 'overall') => {
    if (!ratings || ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, rating) => {
      switch (type) {
        case 'taste':
          return acc + rating.tasteRating;
        case 'value':
          return acc + rating.valueRating;
        case 'overall':
          return acc + rating.overallRating;
        default:
          return acc;
      }
    }, 0);
    return sum / ratings.length;
  };

  const StarDisplay: React.FC<{ rating: number; size?: 'sm' | 'md' | 'lg' }> = ({ 
    rating, 
    size = 'md' 
  }) => {
    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6'
    };

    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const sortRatings = (ratings: RestaurantRating[], sortBy: 'date' | 'taste' | 'value' | 'overall') => {
    const sorted = [...ratings];
    switch (sortBy) {
      case 'date':
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'taste':
        return sorted.sort((a, b) => b.tasteRating - a.tasteRating);
      case 'value':
        return sorted.sort((a, b) => b.valueRating - a.valueRating);
      case 'overall':
        return sorted.sort((a, b) => b.overallRating - a.overallRating);
      default:
        return sorted;
    }
  };

  const sortedRatings = sortRatings(ratings, sortBy);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-6"></div>
            <div className="bg-white rounded-2xl p-6 mb-6">
              <div className="h-32 bg-gray-200 rounded mb-4"></div>
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-4 mb-4">
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Failed to Load Ratings</h2>
          <p className="text-gray-600 mb-4">We couldn't load the ratings for this restaurant.</p>
          <button
            onClick={() => navigate(-1)}
            className="btn-primary"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 hover:bg-white/50 rounded-full transition-colors duration-200"
          >
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Customer Reviews
          </h1>
        </div>

        {/* Restaurant Info & Rating Summary */}
        {restaurant && (
          <div className="glass-card p-6 mb-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-start space-x-4">
              <img
                src={restaurant.imageUrl}
                alt={restaurant.name}
                className="w-20 h-20 rounded-xl object-cover shadow-md"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{restaurant.name}</h2>
                <p className="text-gray-600 mb-4">{restaurant.description}</p>
                
                {ratings && ratings.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-500 mb-1">Taste Rating</div>
                      <div className="flex items-center justify-center space-x-2">
                        <StarDisplay rating={calculateAverageRating(ratings, 'taste')} />
                        <span className="text-lg font-semibold text-gray-700">
                          {calculateAverageRating(ratings, 'taste').toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500 mb-1">Value Rating</div>
                      <div className="flex items-center justify-center space-x-2">
                        <StarDisplay rating={calculateAverageRating(ratings, 'value')} />
                        <span className="text-lg font-semibold text-gray-700">
                          {calculateAverageRating(ratings, 'value').toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500 mb-1">Overall Rating</div>
                      <div className="flex items-center justify-center space-x-2">
                        <StarDisplay rating={calculateAverageRating(ratings, 'overall')} />
                        <span className="text-lg font-semibold text-gray-700">
                          {calculateAverageRating(ratings, 'overall').toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-xl font-bold text-gray-800">
              Customer Reviews ({ratings?.length || 0})
            </h3>
            
            {ratings && ratings.length > 0 && (
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  Avg: ⭐ {calculateAverageRating(ratings, 'overall').toFixed(1)}
                </div>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'date' | 'taste' | 'value' | 'overall')}
                    className="appearance-none bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                  >
                    <option value="date">📅 Sort by Date</option>
                    <option value="overall">⭐ Sort by Overall Rating</option>
                    <option value="taste">🍴 Sort by Taste Rating</option>
                    <option value="value">💰 Sort by Value Rating</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                </div>
              </div>
            )}
          </div>

          {ratings && ratings.length > 0 ? (
            <div className="space-y-4">
              {sortedRatings.map((rating) => (
                <div
                  key={rating.id}
                  className="glass-card p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(rating.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Taste</div>
                      <div className="flex items-center space-x-2">
                        <StarDisplay rating={rating.tasteRating} size="sm" />
                        <span className="text-sm font-medium">{rating.tasteRating}/5</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Value</div>
                      <div className="flex items-center space-x-2">
                        <StarDisplay rating={rating.valueRating} size="sm" />
                        <span className="text-sm font-medium">{rating.valueRating}/5</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Overall</div>
                      <div className="flex items-center space-x-2">
                        <StarDisplay rating={rating.overallRating} size="sm" />
                        <span className="text-sm font-medium">{rating.overallRating}/5</span>
                      </div>
                    </div>
                  </div>

                  {rating.comment && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start space-x-2">
                        <MessageSquare className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                        <p className="text-gray-700 leading-relaxed">{rating.comment}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">⭐</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Reviews Yet</h3>
              <p className="text-gray-500">Be the first to leave a review for this restaurant!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { RestaurantRatings };
