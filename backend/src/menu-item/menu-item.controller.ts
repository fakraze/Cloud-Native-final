import { Controller, Get, Post, Body, Patch, Param, Delete, Query, NotFoundException, ParseIntPipe } from '@nestjs/common';
import { MenuItemService } from './menu-item.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { MenuItem } from './entities/menu-item.entity';
import { RestaurantExistsPipe } from '../restaurant/pipes/restaurant-exists.pipe';

@Controller('restaurant/:restaurantId/menu')
export class MenuItemController {
  constructor(private readonly menuItemService: MenuItemService) {}

  @Post()
  create(
    @Param('restaurantId', ParseIntPipe, RestaurantExistsPipe) restaurantId: number,
    @Body() createMenuItemDto: CreateMenuItemDto
  ): Promise<MenuItem> {
    return this.menuItemService.create(restaurantId, createMenuItemDto);
  }

  @Get()
  async findAll(
    @Param('restaurantId', ParseIntPipe, RestaurantExistsPipe) restaurantId: number,
    @Query() query: any
  ): Promise<MenuItem[]> {
    const menuItems = await this.menuItemService.findAll(restaurantId, query);
    return menuItems;
  }

  @Get(':id')
  async findOne(
    @Param('restaurantId', ParseIntPipe, RestaurantExistsPipe) restaurantId: number,
    @Param('id', ParseIntPipe) id: number
  ): Promise<MenuItem | null> {
    const menuItem = await this.menuItemService.findOne(restaurantId, id);
    if (!menuItem) {
      throw new NotFoundException(`Menu item with ID ${id} not found in restaurant ${restaurantId}`);
    }
    return menuItem;
  }

  @Patch(':id')
  async update(
    @Param('restaurantId', ParseIntPipe, RestaurantExistsPipe) restaurantId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMenuItemDto: UpdateMenuItemDto
  ): Promise<MenuItem | null> {
    const result = await this.menuItemService.update(restaurantId, id, updateMenuItemDto);
    if (!result || result === 0) {
      throw new NotFoundException(`Menu item with ID ${id} not found in restaurant ${restaurantId}`);
    }

    const menuItem = await this.menuItemService.findOne(restaurantId, id);
    return menuItem;
  }

  @Delete(':id')
  async remove(
    @Param('restaurantId', ParseIntPipe, RestaurantExistsPipe) restaurantId: number,
    @Param('id', ParseIntPipe) id: number
  ): Promise<void> {
    const menuItem = await this.menuItemService.findOne(restaurantId, id);
    if (!menuItem) {
      throw new NotFoundException(`Menu item with ID ${id} not found in restaurant ${restaurantId}`);
    }
    return this.menuItemService.remove(restaurantId, id);
  }
}
