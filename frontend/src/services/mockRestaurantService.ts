// Mock restaurant service for frontend testing
import { Restaurant, MenuItem, MenuCategory } from '../types/restaurant';

// Mock restaurant data
const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: '1',
    name: 'Pizza Palace',
    description: 'Authentic Italian pizzas made with fresh ingredients',
    cuisine: 'Italian',
    address: '123 Main St, Downtown',
    phone: '+1-555-0101',
    email: 'info@pizzapalace.com',
    rating: 4.5,
    totalRatings: 234,
    deliveryTime: '25-35 min',
    isActive: true,
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-03-20T14:30:00Z'
  },
  {
    id: '2',
    name: 'Burger Barn',
    description: 'Gourmet burgers and crispy fries',
    cuisine: 'American',
    address: '456 Oak Ave, Midtown',
    phone: '+1-555-0102',
    email: 'hello@burgerbarn.com',
    rating: 4.2,
    totalRatings: 189,
    deliveryTime: '20-30 min',
    isActive: true,
    createdAt: '2024-02-01T09:15:00Z',
    updatedAt: '2024-03-18T16:45:00Z'
  },
  {
    id: '3',
    name: 'Sushi Zen',
    description: 'Fresh sushi and Japanese cuisine',
    cuisine: 'Japanese',
    address: '789 Pine St, Uptown',
    phone: '+1-555-0103',
    email: 'orders@sushizen.com',
    rating: 4.8,
    totalRatings: 156,
    deliveryTime: '30-40 min',
    isActive: true,
    createdAt: '2024-01-20T10:30:00Z',
    updatedAt: '2024-03-22T11:20:00Z'
  }
];

// Mock menu items
const MOCK_MENU_ITEMS: { [restaurantId: string]: MenuItem[] } = {  '1': [
    {
      id: '1',
      restaurantId: '1',
      name: 'Margherita Pizza',
      description: 'Classic pizza with fresh mozzarella, basil, and tomato sauce',
      price: 18.99,
      category: 'pizza' as MenuCategory,
      isAvailable: true,
      preparationTime: 15,
      image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=400',
      allergens: ['gluten', 'dairy'],
      nutritionInfo: {
        calories: 320,
        protein: 12,
        carbs: 35,
        fat: 14
      },
      customizations: [
        {
          id: 'size',
          name: 'Pizza Size',
          type: 'radio',
          required: true,
          options: ['Small (10")', 'Medium (12")', 'Large (14")', 'Extra Large (16")']
        },
        {
          id: 'crust',
          name: 'Crust Type',
          type: 'radio',
          required: true,
          options: ['Thin Crust', 'Regular Crust', 'Thick Crust', 'Stuffed Crust']
        },
        {
          id: 'extra_toppings',
          name: 'Extra Toppings',
          type: 'checkbox',
          required: false,
          options: ['Extra Cheese', 'Fresh Basil', 'Garlic', 'Olives', 'Cherry Tomatoes', 'Arugula']
        },
        {
          id: 'spice_level',
          name: 'Spice Level',
          type: 'radio',
          required: false,
          options: ['Mild', 'Medium', 'Spicy', 'Extra Spicy']
        }
      ]
    },
    {
      id: '2',
      restaurantId: '1',
      name: 'Pepperoni Pizza',
      description: 'Traditional pepperoni pizza with mozzarella cheese',
      price: 21.99,
      category: 'pizza' as MenuCategory,
      isAvailable: true,
      preparationTime: 15,
      image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400',
      allergens: ['gluten', 'dairy'],
      nutritionInfo: {
        calories: 380,
        protein: 16,
        carbs: 36,
        fat: 18
      },
      customizations: [
        {
          id: 'size',
          name: 'Pizza Size',
          type: 'radio',
          required: true,
          options: ['Small (10")', 'Medium (12")', 'Large (14")', 'Extra Large (16")']
        },
        {
          id: 'crust',
          name: 'Crust Type',
          type: 'radio',
          required: true,
          options: ['Thin Crust', 'Regular Crust', 'Thick Crust', 'Stuffed Crust']
        },
        {
          id: 'pepperoni_amount',
          name: 'Pepperoni Amount',
          type: 'radio',
          required: false,
          options: ['Regular', 'Extra Pepperoni', 'Light Pepperoni']
        },
        {
          id: 'extra_toppings',
          name: 'Additional Toppings',
          type: 'checkbox',
          required: false,
          options: ['Extra Cheese', 'Mushrooms', 'Bell Peppers', 'Onions', 'Black Olives', 'Jalapeños']
        },
        {
          id: 'cheese_type',
          name: 'Cheese Preference',
          type: 'radio',
          required: false,
          options: ['Regular Mozzarella', 'Extra Cheese', 'Mixed Cheese', 'Vegan Cheese']
        }
      ]
    }
  ],
  '2': [    {
      id: '3',
      restaurantId: '2',
      name: 'Classic Cheeseburger',
      description: 'Beef patty with cheddar cheese, lettuce, tomato, and special sauce',
      price: 14.99,
      category: 'main' as MenuCategory,
      isAvailable: true,
      preparationTime: 12,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
      allergens: ['gluten', 'dairy'],
      nutritionInfo: {
        calories: 520,
        protein: 28,
        carbs: 42,
        fat: 26
      },
      customizations: [
        {
          id: 'patty_doneness',
          name: 'How would you like your patty cooked?',
          type: 'radio',
          required: true,
          options: ['Rare', 'Medium Rare', 'Medium', 'Medium Well', 'Well Done']
        },
        {
          id: 'cheese_type',
          name: 'Cheese Selection',
          type: 'radio',
          required: false,
          options: ['Cheddar', 'Swiss', 'American', 'Pepper Jack', 'Blue Cheese', 'No Cheese']
        },
        {
          id: 'extra_toppings',
          name: 'Additional Toppings',
          type: 'checkbox',
          required: false,
          options: ['Bacon', 'Avocado', 'Fried Onions', 'Pickles', 'Mushrooms', 'Extra Lettuce', 'Tomato']
        },
        {
          id: 'sauce',
          name: 'Sauce Options',
          type: 'checkbox',
          required: false,
          options: ['Special Sauce', 'Ketchup', 'Mustard', 'Mayo', 'BBQ Sauce', 'Hot Sauce']
        },
        {
          id: 'bun_type',
          name: 'Bun Choice',
          type: 'radio',
          required: false,
          options: ['Regular Sesame', 'Brioche', 'Whole Wheat', 'Gluten-Free', 'Lettuce Wrap']
        }
      ]
    },    {
      id: '4',
      restaurantId: '2',
      name: 'Crispy Fries',
      description: 'Golden crispy french fries with sea salt',
      price: 6.99,
      category: 'side' as MenuCategory,
      isAvailable: true,
      preparationTime: 8,
      image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400',
      allergens: [],
      nutritionInfo: {
        calories: 280,
        protein: 4,
        carbs: 36,
        fat: 14
      },
      customizations: [
        {
          id: 'size',
          name: 'Fries Size',
          type: 'radio',
          required: true,
          options: ['Small', 'Medium', 'Large', 'Extra Large']
        },
        {
          id: 'seasoning',
          name: 'Seasoning Options',
          type: 'checkbox',
          required: false,
          options: ['Sea Salt', 'Garlic Powder', 'Parmesan Cheese', 'Cajun Spice', 'Truffle Oil', 'Herbs']
        },
        {
          id: 'cooking_style',
          name: 'Cooking Preference',
          type: 'radio',
          required: false,
          options: ['Regular Crispy', 'Extra Crispy', 'Light Golden', 'Well Done']
        },
        {
          id: 'dipping_sauce',
          name: 'Dipping Sauces',
          type: 'checkbox',
          required: false,
          options: ['Ketchup', 'Mayo', 'BBQ Sauce', 'Ranch', 'Honey Mustard', 'Aioli']
        }
      ]
    }
  ],
  '3': [    {
      id: '5',
      restaurantId: '3',
      name: 'Salmon Sashimi',
      description: 'Fresh Norwegian salmon, expertly sliced',
      price: 24.99,
      category: 'main' as MenuCategory,
      isAvailable: true,
      preparationTime: 5,
      image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
      allergens: ['fish'],
      nutritionInfo: {
        calories: 180,
        protein: 25,
        carbs: 0,
        fat: 8
      },
      customizations: [
        {
          id: 'portion_size',
          name: 'Portion Size',
          type: 'radio',
          required: true,
          options: ['Small (6 pieces)', 'Regular (8 pieces)', 'Large (12 pieces)', 'Deluxe (16 pieces)']
        },
        {
          id: 'cut_style',
          name: 'Cut Style',
          type: 'radio',
          required: false,
          options: ['Traditional Thick', 'Thin Sliced', 'Cubed (Poke Style)', 'Butterfly Cut']
        },
        {
          id: 'accompaniments',
          name: 'Accompaniments',
          type: 'checkbox',
          required: false,
          options: ['Wasabi', 'Pickled Ginger', 'Soy Sauce', 'Ponzu', 'Spicy Mayo', 'Sesame Seeds']
        },
        {
          id: 'presentation',
          name: 'Presentation Style',
          type: 'radio',
          required: false,
          options: ['Traditional Plate', 'Wooden Board', 'Sushi Boat', 'Ice Bed']
        },
        {
          id: 'freshness_preference',
          name: 'Freshness Preference',
          type: 'radio',
          required: false,
          options: ['Ultra Fresh (Today)', 'Standard Fresh', 'Slightly Aged (More Flavor)']
        }
      ]
    }
  ]
};

export const mockRestaurantService = {
  getRestaurants: async (params?: any): Promise<{ restaurants: Restaurant[]; total: number }> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    let filteredRestaurants = [...MOCK_RESTAURANTS];
      // Apply filters if provided
    if (params?.search) {
      const search = params.search.toLowerCase();
      filteredRestaurants = filteredRestaurants.filter(r => 
        r.name.toLowerCase().includes(search) ||
        (r.cuisine && r.cuisine.toLowerCase().includes(search)) ||
        r.description.toLowerCase().includes(search)
      );
    }
    
    if (params?.cuisine && params.cuisine !== 'all') {
      filteredRestaurants = filteredRestaurants.filter(r => 
        r.cuisine && r.cuisine.toLowerCase() === params.cuisine.toLowerCase()
      );
    }
    
    return {
      restaurants: filteredRestaurants,
      total: filteredRestaurants.length
    };
  },

  getRestaurantById: async (id: string): Promise<Restaurant> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const restaurant = MOCK_RESTAURANTS.find(r => r.id === id);
    if (!restaurant) {
      throw new Error('Restaurant not found');
    }
    
    return restaurant;
  },

  getMenuItems: async (restaurantId: string): Promise<MenuItem[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return MOCK_MENU_ITEMS[restaurantId] || [];
  },

  getMenuItem: async (restaurantId: string, itemId: string): Promise<MenuItem> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const items = MOCK_MENU_ITEMS[restaurantId] || [];
    const item = items.find(i => i.id === itemId);
    
    if (!item) {
      throw new Error('Menu item not found');
    }
    
    return item;
  },

  createRestaurant: async (data: Omit<Restaurant, 'id' | 'createdAt' | 'updatedAt'>): Promise<Restaurant> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newRestaurant: Restaurant = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    MOCK_RESTAURANTS.push(newRestaurant);
    return newRestaurant;
  },

  updateRestaurant: async (id: string, data: Partial<Restaurant>): Promise<Restaurant> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const index = MOCK_RESTAURANTS.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error('Restaurant not found');
    }
    
    MOCK_RESTAURANTS[index] = {
      ...MOCK_RESTAURANTS[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    return MOCK_RESTAURANTS[index];
  },

  deleteRestaurant: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const index = MOCK_RESTAURANTS.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error('Restaurant not found');
    }
    
    MOCK_RESTAURANTS.splice(index, 1);
  }
};
