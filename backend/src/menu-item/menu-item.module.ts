import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuItemService } from './menu-item.service';
import { MenuItemController } from './menu-item.controller';
import { MenuItem } from './entities/menu-item.entity';
import { RestaurantModule } from '../restaurant/restaurant.module';

@Module({
  imports: [TypeOrmModule.forFeature([MenuItem]), RestaurantModule],
  exports: [TypeOrmModule],
  controllers: [MenuItemController],
  providers: [MenuItemService],  
})
export class MenuItemModule {}
