import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';

describe('OrderController', () => {
  let controller: OrderController;
  let service: jest.Mocked<OrderService>;

  const mockUser = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    role: 'employee' as const,
    phone: '123-456-7890',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRestaurant = {
    id: 1,
    name: 'Test Restaurant',
    address: '123 Test St',
    phone: '987-654-3210',
    description: 'Test description',
    imageUrl: 'test-image.jpg',
    menuItems: [],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockOrder: Order = {
    id: 1,
    userId: 1,
    restaurantId: 1,
    status: 'pending' as any,
    paymentStatus: 'pending' as any,
    totalAmount: 2500,
    notes: 'Test order',
    deliveryType: 'pickup' as any,
    items: [],
    user: mockUser as any,
    restaurant: mockRestaurant as any,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockOrderService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    updateStatus: jest.fn(),
    updatePaymentStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get(OrderService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an order', async () => {
      const createOrderDto: CreateOrderDto = {
        userId: 1,
        restaurantId: 1,
        totalAmount: 2500,
        deliveryType: 'pickup' as any,
        items: []
      };

      service.create.mockResolvedValue(mockOrder);

      const result = await controller.create(createOrderDto);

      expect(service.create).toHaveBeenCalledWith(createOrderDto);
      expect(result).toEqual(mockOrder);
    });
  });

  describe('findAll', () => {
    it('should return all orders', async () => {
      const orders = [mockOrder];
      service.findAll.mockResolvedValue(orders);

      const result = await controller.findAll({});

      expect(service.findAll).toHaveBeenCalledWith({});
      expect(result).toEqual(orders);
    });

    it('should return orders with query parameters', async () => {
      const query = { userId: 1 };
      const orders = [mockOrder];
      service.findAll.mockResolvedValue(orders);

      const result = await controller.findAll(query);

      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(orders);
    });
  });

  describe('findOne', () => {
    it('should return an order by id', async () => {
      service.findOne.mockResolvedValue(mockOrder);

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockOrder);
    });
  });

  describe('remove', () => {
    it('should remove an order', async () => {
      service.remove.mockResolvedValue(undefined);

      await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
