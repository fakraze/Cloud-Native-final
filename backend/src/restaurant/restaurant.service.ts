import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
  ) {}

  create(createRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
    return this.restaurantRepository.save(createRestaurantDto);
  }

  findAll(query?: any): Promise<Restaurant[]> {
    const where: any = {};

    return this.restaurantRepository.find({ where });
  }

  findOne(id: number): Promise<Restaurant | null> {
    return this.restaurantRepository.findOne({ where: { id } });
  }

  async update(id: number, updateRestaurantDto: UpdateRestaurantDto): Promise<number | null> {
    const result = await this.restaurantRepository.update(id, updateRestaurantDto);
    return (result.affected && result.affected > 0) ? result.affected : null;
  }

  async remove(id: number): Promise<void> {
    await this.restaurantRepository.delete(id);
  }
}