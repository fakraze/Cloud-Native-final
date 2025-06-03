import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuItem } from './entities/menu-item.entity';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';

@Injectable()
export class MenuItemService {
  constructor(
    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,
  ) {}

  create(restaurantId: number, createMenuItemDto: CreateMenuItemDto): Promise<MenuItem> {
    const menuItem = this.menuItemRepository.create({
      ...createMenuItemDto,
      restaurant: { id: restaurantId } as Restaurant
    });

    return this.menuItemRepository.save(menuItem);
  }

  findAll(restaurantId: number, query?: any): Promise<MenuItem[]> {
    const where: any = {
      ...query,
      restaurant: { id: restaurantId }
    };

    return this.menuItemRepository.find({ 
      where,
      relations: ['restaurant']
    });
  }

  findOne(restaurantId: number, id: number): Promise<MenuItem | null> {
    return this.menuItemRepository.findOne({ 
      where: { 
        id,
        restaurant: { id: restaurantId }
      },
      relations: ['restaurant']
    });
  }

  async update(restaurantId: number, id: number, updateMenuItemDto: UpdateMenuItemDto): Promise<number | null> {
    const result = await this.menuItemRepository.update(
      { 
        id,
        restaurant: { id: restaurantId }
      },
      updateMenuItemDto
    );
    return (result.affected && result.affected > 0) ? result.affected : null;
  }

  async remove(restaurantId: number, id: number): Promise<void> {
    await this.menuItemRepository.delete({
      id,
      restaurant: { id: restaurantId }
    });
  }
}
