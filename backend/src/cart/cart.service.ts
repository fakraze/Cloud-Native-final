import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { MenuItem } from '../menu-item/entities/menu-item.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(MenuItem)
    private menuItemRepository: Repository<MenuItem>,
  ) {}

  async findByUserId(userId: number): Promise<Cart> {
    let cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['items', 'items.menuItem'],
    });

    if (!cart) {
      cart = this.cartRepository.create({
        userId,
        items: []
      });
      cart = await this.cartRepository.save(cart);
    }

    return cart;
  }

  async addItem(createCartItemDto: CreateCartItemDto): Promise<Cart> {
    const { userId, menuItemId, quantity, customizations, specialInstructions } = createCartItemDto;

    // Get or create cart for user
    let cart = await this.findByUserId(userId);

    // Find the menu item
    const menuItem = await this.menuItemRepository.findOne({
      where: { id: menuItemId },
    });

    if (!menuItem) {
      throw new NotFoundException('Menu item not found');
    }

    if (!menuItem.isAvailable) {
      throw new BadRequestException('Menu item is not available');
    }

    // Check if item already exists in cart with same customizations
    const existingItem = cart.items.find(
      item => 
        item.menuItem.id === menuItem.id &&
        JSON.stringify(item.customizations) === JSON.stringify(customizations)
    );

    if (existingItem) {
      // Update quantity of existing item
      existingItem.quantity += quantity;
      await this.cartItemRepository.save(existingItem);
    } else {
      // Create new cart item
      const cartItem = this.cartItemRepository.create({
        cart,
        menuItem,
        quantity,
        customizations,
        specialInstructions,
        subtotal: quantity * menuItem.price,
      });
      await this.cartItemRepository.save(cartItem);
    }

    // Recalculate total and return updated cart
    return cart;
  }

  async updateCartItem(cartItemId: number, updateCartItemDto: UpdateCartItemDto): Promise<Cart> {
    const cartItem = await this.cartItemRepository.findOne({
      where: { id: cartItemId },
      relations: ['cart', 'menuItem'],
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    // Update cart item properties
    if (updateCartItemDto.quantity !== undefined) {
      cartItem.quantity = updateCartItemDto.quantity;
    }
    if (updateCartItemDto.customizations !== undefined) {
      cartItem.customizations = updateCartItemDto.customizations;
    }
    if (updateCartItemDto.specialInstructions !== undefined) {
      cartItem.specialInstructions = updateCartItemDto.specialInstructions;
    }

    // Recalculate subtotal
    await this.cartItemRepository.save(cartItem);

    // Recalculate total and return updated cart
    return this.findByUserId(cartItem.cart.userId);
  }

  async removeCartItem(cartItemId: number): Promise<Cart> {
    const cartItem = await this.cartItemRepository.findOne({
      where: { id: cartItemId },
      relations: ['cart'],
    });


    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }
    const cartUserId = cartItem.cart.userId;

    await this.cartItemRepository.remove(cartItem);
    return this.findByUserId(cartUserId);
  }
}
