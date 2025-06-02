import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Query } from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common/pipes/parse-int.pipe';
import { Restaurant } from './entities/restaurant.entity';

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post()
  create(@Body() createRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
    return this.restaurantService.create(createRestaurantDto);
  }

  @Get()
  async findAll(@Query() query: any): Promise<Restaurant[]> {
    const restaurants = await this.restaurantService.findAll(query);
    return restaurants;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Restaurant | null> {
    const restaurant = await this.restaurantService.findOne(id);
    console.log(restaurant);
    if(!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${id} not found`);
    }
    return restaurant;
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateRestaurantDto: UpdateRestaurantDto): Promise<Restaurant | null> {
    this.restaurantService.update(id, updateRestaurantDto).then((result) => {
      if (!result || result === 0) {
        throw new NotFoundException(`Restaurant with ID ${id} not found`);
      }
    });

    return this.restaurantService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.restaurantService.remove(id);
  }
}
