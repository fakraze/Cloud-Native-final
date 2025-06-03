import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuItemService } from './menu-item.service';
import { MenuItem } from './entities/menu-item.entity';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';

describe('MenuItemService', () => {
  let service: MenuItemService;
  let repository: jest.Mocked<Repository<MenuItem>>;

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
    restaurant: { id: 1 } as any,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenuItemService,
        {
          provide: getRepositoryToken(MenuItem),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<MenuItemService>(MenuItemService);
    repository = module.get(getRepositoryToken(MenuItem));

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a menu item successfully', async () => {
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
        }
      };
      const restaurantId = 1;

      repository.create.mockReturnValue(mockMenuItem);
      repository.save.mockResolvedValue(mockMenuItem);

      const result = await service.create(restaurantId, createMenuItemDto);

      expect(repository.create).toHaveBeenCalledWith({
        ...createMenuItemDto,
        restaurant: { id: restaurantId }
      });
      expect(repository.save).toHaveBeenCalledWith(mockMenuItem);
      expect(result).toEqual(mockMenuItem);
    });
  });

  describe('findAll', () => {
    it('should return all menu items for a restaurant', async () => {
      const restaurantId = 1;
      const menuItems = [mockMenuItem];

      repository.find.mockResolvedValue(menuItems);

      const result = await service.findAll(restaurantId);

      expect(repository.find).toHaveBeenCalledWith({
        where: { restaurant: { id: restaurantId } },
        relations: ['restaurant']
      });
      expect(result).toEqual(menuItems);
    });

    it('should return menu items with query filters', async () => {
      const restaurantId = 1;
      const query = { category: 'Main Course' };
      const menuItems = [mockMenuItem];

      repository.find.mockResolvedValue(menuItems);

      const result = await service.findAll(restaurantId, query);

      expect(repository.find).toHaveBeenCalledWith({
        where: {
          ...query,
          restaurant: { id: restaurantId }
        },
        relations: ['restaurant']
      });
      expect(result).toEqual(menuItems);
    });
  });

  describe('findOne', () => {
    it('should return a menu item by id', async () => {
      const restaurantId = 1;
      const menuItemId = 1;

      repository.findOne.mockResolvedValue(mockMenuItem);

      const result = await service.findOne(restaurantId, menuItemId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: {
          id: menuItemId,
          restaurant: { id: restaurantId }
        },
        relations: ['restaurant']
      });
      expect(result).toEqual(mockMenuItem);
    });

    it('should return null if menu item not found', async () => {
      const restaurantId = 1;
      const menuItemId = 999;

      repository.findOne.mockResolvedValue(null);

      const result = await service.findOne(restaurantId, menuItemId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: {
          id: menuItemId,
          restaurant: { id: restaurantId }
        },
        relations: ['restaurant']
      });
      expect(result).toBeNull();
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

      repository.update.mockResolvedValue({ affected: 1 } as any);

      const result = await service.update(restaurantId, menuItemId, updateMenuItemDto);

      expect(repository.update).toHaveBeenCalledWith(
        {
          id: menuItemId,
          restaurant: { id: restaurantId }
        },
        updateMenuItemDto
      );
      expect(result).toBe(1);
    });

    it('should return null if menu item not found for update', async () => {
      const restaurantId = 1;
      const menuItemId = 999;
      const updateMenuItemDto: UpdateMenuItemDto = {
        name: 'Updated Pizza'
      };

      repository.update.mockResolvedValue({ affected: 0 } as any);

      const result = await service.update(restaurantId, menuItemId, updateMenuItemDto);

      expect(repository.update).toHaveBeenCalledWith(
        {
          id: menuItemId,
          restaurant: { id: restaurantId }
        },
        updateMenuItemDto
      );
      expect(result).toBeNull();
    });

    it('should return null if affected is undefined', async () => {
      const restaurantId = 1;
      const menuItemId = 1;
      const updateMenuItemDto: UpdateMenuItemDto = {
        name: 'Updated Pizza'
      };

      repository.update.mockResolvedValue({ affected: undefined } as any);

      const result = await service.update(restaurantId, menuItemId, updateMenuItemDto);

      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should remove a menu item successfully', async () => {
      const restaurantId = 1;
      const menuItemId = 1;

      repository.delete.mockResolvedValue({ affected: 1 } as any);

      await service.remove(restaurantId, menuItemId);

      expect(repository.delete).toHaveBeenCalledWith({
        id: menuItemId,
        restaurant: { id: restaurantId }
      });
    });

    it('should not throw error even if menu item not found for deletion', async () => {
      const restaurantId = 1;
      const menuItemId = 999;

      repository.delete.mockResolvedValue({ affected: 0 } as any);

      await expect(service.remove(restaurantId, menuItemId)).resolves.not.toThrow();

      expect(repository.delete).toHaveBeenCalledWith({
        id: menuItemId,
        restaurant: { id: restaurantId }
      });
    });
  });
});
