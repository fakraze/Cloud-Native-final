import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';

// Import enums from entity
enum OrderStatus {
  pending = 'pending',
  confirmed = 'confirmed',
  preparing = 'preparing',
  ready = 'ready',
  completed = 'completed',
  cancelled = 'cancelled',
  delivered = 'delivered',
}

enum PaymentStatus {
  pending = 'pending',
  paid = 'paid',
  unpaid = 'unpaid',
}

enum DeliveryType {
  pickup = 'pickup',
  dineIn = 'dine-in',
}

describe('OrderService', () => {
  let service: OrderService;
  let orderRepository: jest.Mocked<Repository<Order>>;
  let orderItemRepository: jest.Mocked<Repository<OrderItem>>;

  const mockOrder: Order = {
    id: 1,
    userId: 1,
    restaurantId: 1,
    status: OrderStatus.pending,
    paymentStatus: PaymentStatus.pending,
    totalAmount: 2500,
    deliveryType: DeliveryType.pickup,
    items: [],
    user: {
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
      role: 'employee' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    restaurant: {
      id: 1,
      name: 'Test Restaurant',
    } as any,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockOrderItem: OrderItem = {
    id: 1,
    order: mockOrder,
    menuItem: {
      id: 1,
      name: 'Test Pizza',
      price: 1500,
    } as any,
    menuItemId: 1,
    quantity: 2,
    price: 1500,
    customizations: {},
    notes: 'Extra cheese',
  };

  const mockOrderRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockOrderItemRepository = {
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrderRepository,
        },
        {
          provide: getRepositoryToken(OrderItem),
          useValue: mockOrderItemRepository,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    orderRepository = module.get(getRepositoryToken(Order));
    orderItemRepository = module.get(getRepositoryToken(OrderItem));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an order with items', async () => {
      const createOrderDto: CreateOrderDto = {
        userId: 1,
        restaurantId: 1,
        totalAmount: 3000,
        deliveryType: DeliveryType.pickup,
        items: [{
          menuItemId: 1,
          quantity: 2,
          price: 1500,
          customizations: {}
        }] as any
      };

      const { items, ...orderData } = createOrderDto;
      const createdOrder = { ...mockOrder, id: 1 };
      const orderWithItems = { ...createdOrder, items: [mockOrderItem] };

      orderRepository.create.mockReturnValue(createdOrder);
      orderRepository.save.mockResolvedValue(createdOrder);
      orderItemRepository.create.mockReturnValue(mockOrderItem);
      orderItemRepository.save.mockResolvedValue(mockOrderItem);
      orderRepository.findOne.mockResolvedValue(orderWithItems);

      const result = await service.create(createOrderDto);

      expect(orderRepository.create).toHaveBeenCalledWith(orderData);
      expect(orderRepository.save).toHaveBeenCalledWith(createdOrder);
      expect(orderItemRepository.create).toHaveBeenCalled();
      expect(orderItemRepository.save).toHaveBeenCalled();
      expect(result).toEqual(orderWithItems);
    });

    it('should create an order without items', async () => {
      const createOrderDto: CreateOrderDto = {
        userId: 1,
        restaurantId: 1,
        totalAmount: 0,
        deliveryType: DeliveryType.pickup,
        items: []
      };

      const { items, ...orderData } = createOrderDto;
      const createdOrder = { ...mockOrder, id: 1 };

      orderRepository.create.mockReturnValue(createdOrder);
      orderRepository.save.mockResolvedValue(createdOrder);
      orderRepository.findOne.mockResolvedValue(createdOrder);

      const result = await service.create(createOrderDto);

      expect(orderRepository.create).toHaveBeenCalledWith(orderData);
      expect(orderItemRepository.create).not.toHaveBeenCalled();
      expect(result).toEqual(createdOrder);
    });
  });

  describe('findAll', () => {
    it('should return all orders', async () => {
      const orders = [mockOrder];
      orderRepository.find.mockResolvedValue(orders);

      const result = await service.findAll();

      expect(orderRepository.find).toHaveBeenCalledWith({
        where: {},
        relations: ['user', 'restaurant', 'items', 'items.menuItem'],
      });
      expect(result).toEqual(orders);
    });

    it('should return orders with query filters', async () => {
      const query = { userId: 1, restaurantId: 1 };
      const orders = [mockOrder];
      orderRepository.find.mockResolvedValue(orders);

      const result = await service.findAll(query);

      expect(orderRepository.find).toHaveBeenCalledWith({
        where: query,
        relations: ['user', 'restaurant', 'items', 'items.menuItem'],
      });
      expect(result).toEqual(orders);
    });
  });

  describe('findOne', () => {
    it('should return an order by id', async () => {
      orderRepository.findOne.mockResolvedValue(mockOrder);

      const result = await service.findOne(1);

      expect(orderRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['user', 'restaurant', 'items', 'items.menuItem'],
      });
      expect(result).toEqual(mockOrder);
    });

    it('should throw NotFoundException if order not found', async () => {
      orderRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999))
        .rejects.toThrow(new NotFoundException('Order with ID 999 not found'));
    });
  });

  describe('remove', () => {
    it('should remove an order and its items', async () => {
      orderRepository.findOne.mockResolvedValue(mockOrder);
      orderItemRepository.delete.mockResolvedValue({ affected: 1 } as any);
      orderRepository.remove.mockResolvedValue(mockOrder);

      await service.remove(1);

      expect(orderItemRepository.delete).toHaveBeenCalledWith({ order: { id: 1 } });
      expect(orderRepository.remove).toHaveBeenCalledWith(mockOrder);
    });
  });

  describe('updateStatus', () => {
    it('should update order status', async () => {
      const updatedOrder = { ...mockOrder, status: OrderStatus.completed };
      orderRepository.update.mockResolvedValue({ affected: 1 } as any);
      orderRepository.findOne.mockResolvedValue(updatedOrder);

      const result = await service.updateStatus(1, OrderStatus.completed);

      expect(orderRepository.update).toHaveBeenCalledWith(1, { status: OrderStatus.completed });
      expect(result).toEqual(updatedOrder);
    });
  });

  describe('updatePaymentStatus', () => {
    it('should update payment status', async () => {
      const updatedOrder = { ...mockOrder, paymentStatus: PaymentStatus.paid };
      orderRepository.update.mockResolvedValue({ affected: 1 } as any);
      orderRepository.findOne.mockResolvedValue(updatedOrder);

      const result = await service.updatePaymentStatus(1, PaymentStatus.paid);

      expect(orderRepository.update).toHaveBeenCalledWith(1, { paymentStatus: PaymentStatus.paid });
      expect(result).toEqual(updatedOrder);
    });
  });
});
