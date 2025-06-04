import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Delete, 
  Put,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { Cart } from './entities/cart.entity';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get(':userId')
  async findByUserId(@Param('userId', ParseIntPipe) userId: number): Promise<Cart> {
    return this.cartService.findByUserId(userId);
  }

  @Post()
  async addItem(@Body() createCartItemDto: CreateCartItemDto): Promise<Cart> {
    return this.cartService.addItem(createCartItemDto);
  }

  @Put(':cartItemId')
  async updateCartItem(
    @Param('cartItemId', ParseIntPipe) cartItemId: number,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ): Promise<Cart> {
    return this.cartService.updateCartItem(cartItemId, updateCartItemDto);
  }

  @Delete(':cartItemId')
  removeCartItem(@Param('cartItemId', ParseIntPipe) cartItemId: number): Promise<Cart> {
    return this.cartService.removeCartItem(cartItemId);
  }
}
