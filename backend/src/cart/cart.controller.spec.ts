import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';

describe('CartController', () => {
  let controller: CartController;
  let service: jest.Mocked<CartService>;

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

  const mockCartItem: CartItem = {
    id: 1,
    cart: mockCart,
    menuItem: {
      id: 1,
      name: 'Test Pizza',
      price: 1500,
    } as any,
    quantity: 2,
    customizations: {},
    specialInstructions: 'No onions',
    subtotal: 3000,
  };

  const mockCartService = {
    findByUserId: jest.fn(),
    addItem: jest.fn(),
    updateCartItem: jest.fn(),
    removeCartItem: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        {
          provide: CartService,
          useValue: mockCartService,
        },
      ],
    }).compile();

    controller = module.get<CartController>(CartController);
    service = module.get(CartService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findByUserId', () => {
    it('should return cart for user', async () => {
      const cartWithItems = { ...mockCart, items: [mockCartItem] };
      service.findByUserId.mockResolvedValue(cartWithItems);

      const result = await controller.findByUserId(1);

      expect(service.findByUserId).toHaveBeenCalledWith(1);
      expect(result).toEqual(cartWithItems);
    });
  });

  describe('addItem', () => {
    it('should add item to cart', async () => {
      const createCartItemDto: CreateCartItemDto = {
        userId: 1,
        menuItemId: 1,
        quantity: 2,
        customizations: { size: 'large' },
        specialInstructions: 'Extra cheese'
      };

      const updatedCart = { ...mockCart, items: [mockCartItem] };
      service.addItem.mockResolvedValue(updatedCart);

      const result = await controller.addItem(createCartItemDto);

      expect(service.addItem).toHaveBeenCalledWith(createCartItemDto);
      expect(result).toEqual(updatedCart);
    });
  });

  describe('updateCartItem', () => {
    it('should update cart item', async () => {
      const updateCartItemDto: UpdateCartItemDto = {
        quantity: 3,
        customizations: { size: 'medium' },
      };

      const updatedCart = { ...mockCart, items: [{ ...mockCartItem, quantity: 3 }] };
      service.updateCartItem.mockResolvedValue(updatedCart);

      const result = await controller.updateCartItem(1, updateCartItemDto);

      expect(service.updateCartItem).toHaveBeenCalledWith(1, updateCartItemDto);
      expect(result).toEqual(updatedCart);
    });
  });

  describe('removeCartItem', () => {
    it('should remove cart item', async () => {
      const emptyCart = { ...mockCart, items: [] };
      service.removeCartItem.mockResolvedValue(emptyCart);

      const result = await controller.removeCartItem(1);

      expect(service.removeCartItem).toHaveBeenCalledWith(1);
      expect(result).toEqual(emptyCart);
    });
  });
});
