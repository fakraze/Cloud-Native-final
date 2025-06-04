import { Controller, Get, Post, Body, Put, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
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

  @Put(':id')
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRestaurantDto: UpdateRestaurantDto
  ): Promise<Restaurant | null> {
    const result = await this.restaurantService.update(id, updateRestaurantDto);
    if (!result || result === 0) {
      throw new NotFoundException(`Restaurant with ID ${id} not found`);
    }

    const restaurant = await this.restaurantService.findOne(id);
    return restaurant;
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.restaurantService.remove(id);
  }
}
