import { Module } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantExistsPipe } from './pipes/restaurant-exists.pipe';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant])],
  exports: [TypeOrmModule, RestaurantService, RestaurantExistsPipe],
  controllers: [RestaurantController],
  providers: [RestaurantService, RestaurantExistsPipe],
})
export class RestaurantModule {}
