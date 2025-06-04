import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { items, ...orderData } = createOrderDto;

    // Create the order first
    const order = this.orderRepository.create(orderData);
    const savedOrder = await this.orderRepository.save(order);

    // Create order items
    if (items && items.length > 0) {
      const orderItems = items.map(item => 
        this.orderItemRepository.create({
          ...item,
          order: savedOrder,
        })
      );
      await this.orderItemRepository.save(orderItems);
    }

    // Return the order with items
    return this.findOne(savedOrder.id);
  }

  async findAll(query?: any): Promise<Order[]> {
    const where: any = {};

    if(query?.userId) {
      where.userId = query.userId;
    }
    if(query?.restaurantId) {
      where.restaurantId = query.restaurantId;
    }
    if(query?.paymentStatus) {
      where.paymentStatus = query.paymentStatus;
    }

    return this.orderRepository.find({
      where,
      relations: ['user', 'restaurant', 'items', 'items.menuItem'],
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'restaurant', 'items', 'items.menuItem'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async remove(id: number): Promise<void> {
    const order = await this.findOne(id);
    
    // Remove associated order items first
    await this.orderItemRepository.delete({ order: { id } });
    
    // Remove the order
    await this.orderRepository.remove(order);
  }

  async updateStatus(id: number, status: string): Promise<Order> {
    await this.orderRepository.update(id, { status: status as any });
    return this.findOne(id);
  }

  async updatePaymentStatus(id: number, paymentStatus: string): Promise<Order> {
    await this.orderRepository.update(id, { paymentStatus: paymentStatus as any });
    return this.findOne(id);
  }
}
