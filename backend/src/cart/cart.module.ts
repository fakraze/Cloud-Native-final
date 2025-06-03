import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { MenuItem } from '../menu-item/entities/menu-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem, MenuItem])],
  controllers: [CartController],
  providers: [CartService],
  exports: [TypeOrmModule],
})
export class CartModule {}
