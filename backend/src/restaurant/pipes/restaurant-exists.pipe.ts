import { PipeTransform, Injectable, NotFoundException } from '@nestjs/common';
import { RestaurantService } from '../restaurant.service';

@Injectable()
export class RestaurantExistsPipe implements PipeTransform {
  constructor(private readonly restaurantService: RestaurantService) {}

  async transform(value: number) {
    const restaurant = await this.restaurantService.findOne(value);
    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${value} not found.`);
    }
    return value;
  }
}