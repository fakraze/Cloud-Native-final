import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CartService } from './cart.service';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { MenuItem } from '../menu-item/entities/menu-item.entity';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

describe('CartService', () => {
  let service: CartService;
  let cartRepository: jest.Mocked<Repository<Cart>>;
  let cartItemRepository: jest.Mocked<Repository<CartItem>>;
  let menuItemRepository: jest.Mocked<Repository<MenuItem>>;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    role: 'employee' as const,
    phone: '1234567890',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCart: Cart = {
    id: 1,
    userId: 1,
    user: mockUser,
    items: [],
    totalAmount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockMenuItem: MenuItem = {
    id: 1,
    name: 'Test Pizza',
    description: 'Test Description',
    price: 1500,
    imageUrl: 'test.jpg',
    category: 'Main Course',
    isAvailable: true,
    preparationTime: 20,
    allergens: ['gluten'],
    nutritionInfo: {
      calories: 300,
      protein: 12,
      carbs: 35,
      fat: 10
    },
    restaurantId: 1,
    restaurant: { id: 1 } as any,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockCartItem: CartItem = {
    id: 1,
    cart: mockCart,
    menuItem: mockMenuItem,
    quantity: 2,
    customizations: {},
    specialInstructions: 'No onions',
    subtotal: 3000,
  };

  beforeEach(async () => {
    const mockCartRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };

    const mockCartItemRepository = {
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
      delete: jest.fn(),
      findOne: jest.fn(),
    };

    const mockMenuItemRepository = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: getRepositoryToken(Cart),
          useValue: mockCartRepository,
        },
        {
          provide: getRepositoryToken(CartItem),
          useValue: mockCartItemRepository,
        },
        {
          provide: getRepositoryToken(MenuItem),
          useValue: mockMenuItemRepository,
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    cartRepository = module.get(getRepositoryToken(Cart));
    cartItemRepository = module.get(getRepositoryToken(CartItem));
    menuItemRepository = module.get(getRepositoryToken(MenuItem));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByUserId', () => {
    it('should return existing cart for user', async () => {
      const cartWithItems = { ...mockCart, items: [mockCartItem] };
      cartRepository.findOne.mockResolvedValue(cartWithItems);

      const result = await service.findByUserId(1);

      expect(cartRepository.findOne).toHaveBeenCalledWith({
        where: { userId: 1 },
        relations: ['items', 'items.menuItem'],
      });
      expect(result).toEqual(cartWithItems);
    });

    it('should create new cart if none exists', async () => {
      const newCart = { ...mockCart, items: [] };
      cartRepository.findOne.mockResolvedValue(null);
      cartRepository.create.mockReturnValue(newCart);
      cartRepository.save.mockResolvedValue(newCart);

      const result = await service.findByUserId(1);

      expect(cartRepository.create).toHaveBeenCalledWith({
        userId: 1,
        items: []
      });
      expect(cartRepository.save).toHaveBeenCalledWith(newCart);
      expect(result).toEqual(newCart);
    });
  });

  describe('addItem', () => {
    const createCartItemDto: CreateCartItemDto = {
      userId: 1,
      menuItemId: 1,
      quantity: 2,
      customizations: { size: 'large' },
      specialInstructions: 'Extra cheese'
    };

    it('should add new item to cart', async () => {
      const cartWithoutItem = { ...mockCart, items: [] };
      cartRepository.findOne.mockResolvedValue(cartWithoutItem);
      menuItemRepository.findOne.mockResolvedValue(mockMenuItem);
      cartItemRepository.create.mockReturnValue(mockCartItem);
      cartItemRepository.save.mockResolvedValue(mockCartItem);

      const result = await service.addItem(createCartItemDto);

      expect(menuItemRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(cartItemRepository.create).toHaveBeenCalledWith({
        cart: cartWithoutItem,
        menuItem: mockMenuItem,
        quantity: 2,
        customizations: { size: 'large' },
        specialInstructions: 'Extra cheese',
        subtotal: 3000, // 2 * 1500
      });
      expect(result).toEqual(cartWithoutItem);
    });

    it('should update quantity if item already exists with same customizations', async () => {
      const existingCartItem = { 
        ...mockCartItem, 
        quantity: 1,
        customizations: { size: 'large' }
      };
      const cartWithItem = { ...mockCart, items: [existingCartItem] };
      
      cartRepository.findOne.mockResolvedValue(cartWithItem);
      menuItemRepository.findOne.mockResolvedValue(mockMenuItem);
      cartItemRepository.save.mockResolvedValue(existingCartItem);

      await service.addItem(createCartItemDto);

      expect(existingCartItem.quantity).toBe(3); // 1 + 2
      expect(cartItemRepository.save).toHaveBeenCalledWith(existingCartItem);
    });

    it('should throw NotFoundException if menu item not found', async () => {
      cartRepository.findOne.mockResolvedValue(mockCart);
      menuItemRepository.findOne.mockResolvedValue(null);

      await expect(service.addItem(createCartItemDto))
        .rejects.toThrow(new NotFoundException('Menu item not found'));
    });

    it('should throw BadRequestException if menu item not available', async () => {
      const unavailableMenuItem = { ...mockMenuItem, isAvailable: false };
      cartRepository.findOne.mockResolvedValue(mockCart);
      menuItemRepository.findOne.mockResolvedValue(unavailableMenuItem);

      await expect(service.addItem(createCartItemDto))
        .rejects.toThrow(new BadRequestException('Menu item is not available'));
    });
  });

  describe('updateCartItem', () => {
    const updateCartItemDto: UpdateCartItemDto = {
      quantity: 3,
      customizations: { size: 'medium' },
      specialInstructions: 'No sauce'
    };

    it('should update cart item successfully', async () => {
      const cartItemWithCart = { ...mockCartItem, cart: mockCart };
      cartItemRepository.findOne.mockResolvedValue(cartItemWithCart);
      cartItemRepository.save.mockResolvedValue(cartItemWithCart);
      
      // Mock findByUserId for return value
      const updatedCart = { ...mockCart, items: [cartItemWithCart] };
      cartRepository.findOne.mockResolvedValue(updatedCart);

      const result = await service.updateCartItem(1, updateCartItemDto);

      expect(cartItemRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['cart', 'menuItem'],
      });
      expect(cartItemWithCart.quantity).toBe(3);
      expect(cartItemWithCart.customizations).toEqual({ size: 'medium' });
      expect(cartItemWithCart.specialInstructions).toBe('No sauce');
      expect(result).toEqual(updatedCart);
    });

    it('should throw NotFoundException if cart item not found', async () => {
      cartItemRepository.findOne.mockResolvedValue(null);

      await expect(service.updateCartItem(999, updateCartItemDto))
        .rejects.toThrow(new NotFoundException('Cart item not found'));
    });
  });

  describe('removeCartItem', () => {
    it('should remove cart item successfully', async () => {
      const cartItemWithCart = { ...mockCartItem, cart: mockCart };
      cartItemRepository.findOne.mockResolvedValue(cartItemWithCart);
      cartItemRepository.remove.mockResolvedValue(cartItemWithCart);
      
      // Mock findByUserId for return value
      const updatedCart = { ...mockCart, items: [] };
      cartRepository.findOne.mockResolvedValue(updatedCart);

      const result = await service.removeCartItem(1);

      expect(cartItemRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['cart'],
      });
      expect(cartItemRepository.remove).toHaveBeenCalledWith(cartItemWithCart);
      expect(result).toEqual(updatedCart);
    });

    it('should throw NotFoundException if cart item not found', async () => {
      cartItemRepository.findOne.mockResolvedValue(null);

      await expect(service.removeCartItem(999))
        .rejects.toThrow(new NotFoundException('Cart item not found'));
    });
  });
});
