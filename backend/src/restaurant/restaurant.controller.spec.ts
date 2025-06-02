import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';
import { NotFoundException } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';

describe('RestaurantController', () => {
  let controller: RestaurantController;
  let service: RestaurantService;

  const mockRestaurant: Restaurant = {
    id: 1,
    name: 'Test Restaurant',
    address: '123 Main St',
    // add other required fields as per your entity
  } as Restaurant;

  const mockRestaurantService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestaurantController],
      providers: [
        { provide: RestaurantService, useValue: mockRestaurantService },
      ],
    }).compile();

    controller = module.get<RestaurantController>(RestaurantController);
    service = module.get<RestaurantService>(RestaurantService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a restaurant', async () => {
      const dto: CreateRestaurantDto = { name: 'Test', address: 'Addr' } as any;
      mockRestaurantService.create.mockResolvedValue(mockRestaurant);

      const result = await controller.create(dto);
      expect(result).toEqual(mockRestaurant);
      expect(mockRestaurantService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of restaurants', async () => {
      mockRestaurantService.findAll.mockResolvedValue([mockRestaurant]);
      const result = await controller.findAll({});
      expect(result).toEqual([mockRestaurant]);
      expect(mockRestaurantService.findAll).toHaveBeenCalledWith({});
    });
  });

  describe('findOne', () => {
    it('should return a restaurant by id', async () => {
      mockRestaurantService.findOne.mockResolvedValue(mockRestaurant);
      const result = await controller.findOne(1);
      expect(result).toEqual(mockRestaurant);
      expect(mockRestaurantService.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if restaurant not found', async () => {
      mockRestaurantService.findOne.mockResolvedValue(null);
      await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a restaurant and return the updated entity', async () => {
      mockRestaurantService.update.mockResolvedValue(1);
      mockRestaurantService.findOne.mockResolvedValue(mockRestaurant);

      const dto: UpdateRestaurantDto = { name: 'Updated' } as any;
      const result = await controller.update(1, dto);
      expect(result).toEqual(mockRestaurant);
      expect(mockRestaurantService.update).toHaveBeenCalledWith(1, dto);
      expect(mockRestaurantService.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if update returns 0', async () => {
      mockRestaurantService.update.mockResolvedValue(0);
      mockRestaurantService.findOne.mockResolvedValue(null);

      const dto: UpdateRestaurantDto = { name: 'Updated' } as any;
      await expect(controller.update(999, dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should call service.remove with correct id', async () => {
      mockRestaurantService.remove.mockResolvedValue({ deleted: true });
      const result = await controller.remove(1);
      expect(result).toEqual({ deleted: true });
      expect(mockRestaurantService.remove).toHaveBeenCalledWith(1);
    });
  });
});

// We recommend installing an extension to run jest tests.
