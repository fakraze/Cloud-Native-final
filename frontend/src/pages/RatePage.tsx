import React, { useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Send } from 'lucide-react';
import { useRestaurant } from '../hooks/useRestaurant';
import { useCreateRating } from '../hooks/useRating';
import { useOrder } from '../hooks/useOrder';

const RatePage: React.FC = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const navigate = useNavigate();

  const { data: restaurant } = useRestaurant(restaurantId!);
  const { data: order } = useOrder(orderId!);
  const createRatingMutation = useCreateRating();

  const [tasteRating, setTasteRating] = useState(0);
  const [valueRating, setValueRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmitRating = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderId || !restaurantId || tasteRating === 0 || valueRating === 0) {
      return;
    }

    try {
      await createRatingMutation.mutateAsync({
        orderId,
        restaurantId,
        tasteRating,
        valueRating,
        comment: comment.trim() || undefined,
      });
      
      navigate('/order-history', {
        state: { message: 'Thank you for your rating!' }
      });
    } catch (error) {
      console.error('Failed to submit rating:', error);
    }
  };

  const StarRating: React.FC<{
    value: number;
    onChange: (value: number) => void;
    label: string;
  }> = ({ value, onChange, label }) => {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              className="focus:outline-none"
            >
              <Star
                className={`h-8 w-8 ${
                  star <= value
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    );
  };

  if (!restaurant || !order) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back button */}
      <button 
        onClick={() => navigate(-1)}
        className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back</span>
      </button>

      <div className="card">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Rate Your Experience</h1>
          <p className="text-gray-600">
            How was your order from <span className="font-medium">{restaurant.name}</span>?
          </p>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-gray-900 mb-2">Order #{order.id.slice(-8)}</h3>
          <div className="text-sm text-gray-600">
            <p>Date: {new Date(order.orderDate).toLocaleDateString()}</p>
            <p>Items: {order.items.map(item => `${item.quantity}x ${item.menuItemName}`).join(', ')}</p>
            <p>Total: ${order.totalAmount.toFixed(2)}</p>
          </div>
        </div>

        <form onSubmit={handleSubmitRating} className="space-y-6">
          {/* Taste Rating */}
          <StarRating
            value={tasteRating}
            onChange={setTasteRating}
            label="How was the taste?"
          />

          {/* Value Rating */}
          <StarRating
            value={valueRating}
            onChange={setValueRating}
            label="How was the value for money?"
          />

          {/* Comment */}
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
              Additional Comments (Optional)
            </label>
            <textarea
              id="comment"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us more about your experience..."
              className="input-field resize-none"
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              {comment.length}/500 characters
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={tasteRating === 0 || valueRating === 0 || createRatingMutation.isPending}
              className={`btn-primary flex-1 flex items-center justify-center space-x-2 ${
                (tasteRating === 0 || valueRating === 0 || createRatingMutation.isPending)
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
            >
              <Send className="h-4 w-4" />
              <span>
                {createRatingMutation.isPending ? 'Submitting...' : 'Submit Rating'}
              </span>
            </button>
          </div>

          {createRatingMutation.error && (
            <div className="bg-red-50 border border-red-200 rounded p-3">
              <p className="text-sm text-red-600">
                Failed to submit rating. Please try again.
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export { RatePage };
