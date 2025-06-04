import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { MenuItemController } from './menu-item.controller';
import { MenuItemService } from './menu-item.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { MenuItem } from './entities/menu-item.entity';
import { RestaurantService } from '../restaurant/restaurant.service';
import { RestaurantExistsPipe } from '../restaurant/pipes/restaurant-exists.pipe';

describe('MenuItemController', () => {
  let controller: MenuItemController;
  let service: jest.Mocked<MenuItemService>;

  const mockMenuItem: MenuItem = {
    id: 1,
    name: 'Pizza Margherita',
    description: 'Classic pizza with tomato, mozzarella, and basil',
    price: 1200,
    imageUrl: 'https://example.com/pizza.jpg',
    category: 'Main Course',
    isAvailable: true,
    preparationTime: 20,
    allergens: ['gluten', 'dairy'],
    nutritionInfo: {
      calories: 300,
      protein: 12,
      carbs: 35,
      fat: 10
    },
    restaurantId: 1,
    restaurant: { id: 1 } as any,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockMenuItemService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenuItemController],
      providers: [
        {
          provide: MenuItemService,
          useValue: mockMenuItemService,
        },
        {
          provide: RestaurantService,
          useValue: {}, // mock implementation, not used in these tests
        },
        {
          provide: RestaurantExistsPipe,
          useValue: { transform: jest.fn((v) => v) }, // mock pipe just returns the value
        },
      ],
    }).compile();

    controller = module.get<MenuItemController>(MenuItemController);
    service = module.get(MenuItemService);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a menu item successfully', async () => {
      const restaurantId = 1;
      const createMenuItemDto: CreateMenuItemDto = {
        name: 'Pizza Margherita',
        description: 'Classic pizza with tomato, mozzarella, and basil',
        price: 1200,
        imageUrl: 'https://example.com/pizza.jpg',
        category: 'Main Course',
        isAvailable: true,
        preparationTime: 20,
        allergens: ['gluten', 'dairy'],
        nutritionInfo: {
          calories: 300,
          protein: 12,
          carbs: 35,
          fat: 10
        },
        restaurantId: 1
      };

      service.create.mockResolvedValue(mockMenuItem);

      const result = await controller.create(restaurantId, createMenuItemDto);

      expect(service.create).toHaveBeenCalledWith(restaurantId, createMenuItemDto);
      expect(result).toEqual(mockMenuItem);
    });
  });

  describe('findAll', () => {
    it('should return all menu items for a restaurant', async () => {
      const restaurantId = 1;
      const query = {};
      const menuItems = [mockMenuItem];

      service.findAll.mockResolvedValue(menuItems);

      const result = await controller.findAll(restaurantId, query);

      expect(service.findAll).toHaveBeenCalledWith(restaurantId, query);
      expect(result).toEqual(menuItems);
    });

    it('should return menu items with query parameters', async () => {
      const restaurantId = 1;
      const query = { category: 'Main Course', isAvailable: true };
      const menuItems = [mockMenuItem];

      service.findAll.mockResolvedValue(menuItems);

      const result = await controller.findAll(restaurantId, query);

      expect(service.findAll).toHaveBeenCalledWith(restaurantId, query);
      expect(result).toEqual(menuItems);
    });
  });

  describe('findOne', () => {
    it('should return a menu item by id', async () => {
      const restaurantId = 1;
      const menuItemId = 1;

      service.findOne.mockResolvedValue(mockMenuItem);

      const result = await controller.findOne(restaurantId, menuItemId);

      expect(service.findOne).toHaveBeenCalledWith(restaurantId, menuItemId);
      expect(result).toEqual(mockMenuItem);
    });

    it('should throw NotFoundException if menu item not found', async () => {
      const restaurantId = 1;
      const menuItemId = 999;

      service.findOne.mockResolvedValue(null);

      await expect(controller.findOne(restaurantId, menuItemId))
        .rejects.toThrow(new NotFoundException(`Menu item with ID ${menuItemId} not found in restaurant ${restaurantId}`));

      expect(service.findOne).toHaveBeenCalledWith(restaurantId, menuItemId);
    });
  });

  describe('update', () => {
    it('should update a menu item successfully', async () => {
      const restaurantId = 1;
      const menuItemId = 1;
      const updateMenuItemDto: UpdateMenuItemDto = {
        name: 'Updated Pizza',
        price: 1500
      };
      const updatedMenuItem = { ...mockMenuItem, ...updateMenuItemDto };

      service.update.mockResolvedValue(1);
      service.findOne.mockResolvedValue(updatedMenuItem);

      const result = await controller.update(restaurantId, menuItemId, updateMenuItemDto);

      expect(service.update).toHaveBeenCalledWith(restaurantId, menuItemId, updateMenuItemDto);
      expect(service.findOne).toHaveBeenCalledWith(restaurantId, menuItemId);
      expect(result).toEqual(updatedMenuItem);
    });

    it('should throw NotFoundException if menu item not found for update', async () => {
      const restaurantId = 1;
      const menuItemId = 999;
      const updateMenuItemDto: UpdateMenuItemDto = {
        name: 'Updated Pizza'
      };

      service.update.mockResolvedValue(null);

      await expect(controller.update(restaurantId, menuItemId, updateMenuItemDto))
        .rejects.toThrow(new NotFoundException(`Menu item with ID ${menuItemId} not found in restaurant ${restaurantId}`));

      expect(service.update).toHaveBeenCalledWith(restaurantId, menuItemId, updateMenuItemDto);
    });

    it('should throw NotFoundException if update affects 0 rows', async () => {
      const restaurantId = 1;
      const menuItemId = 1;
      const updateMenuItemDto: UpdateMenuItemDto = {
        name: 'Updated Pizza'
      };

      service.update.mockResolvedValue(0);

      await expect(controller.update(restaurantId, menuItemId, updateMenuItemDto))
        .rejects.toThrow(new NotFoundException(`Menu item with ID ${menuItemId} not found in restaurant ${restaurantId}`));

      expect(service.update).toHaveBeenCalledWith(restaurantId, menuItemId, updateMenuItemDto);
    });
  });

  describe('remove', () => {
    it('should remove a menu item successfully', async () => {
      const restaurantId = 1;
      const menuItemId = 1;

      service.findOne.mockResolvedValue(mockMenuItem);
      service.remove.mockResolvedValue(undefined);

      await controller.remove(restaurantId, menuItemId);

      expect(service.findOne).toHaveBeenCalledWith(restaurantId, menuItemId);
      expect(service.remove).toHaveBeenCalledWith(restaurantId, menuItemId);
    });

    it('should throw NotFoundException if menu item not found for deletion', async () => {
      const restaurantId = 1;
      const menuItemId = 999;

      service.findOne.mockResolvedValue(null);

      await expect(controller.remove(restaurantId, menuItemId))
        .rejects.toThrow(new NotFoundException(`Menu item with ID ${menuItemId} not found in restaurant ${restaurantId}`));

      expect(service.findOne).toHaveBeenCalledWith(restaurantId, menuItemId);
      expect(service.remove).not.toHaveBeenCalled();
    });
  });
});
