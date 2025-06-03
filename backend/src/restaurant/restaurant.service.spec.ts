import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantService } from './restaurant.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';

describe('RestaurantService', () => {
  let service: RestaurantService;
  let repository: any;

  const mockRestaurant = { id: 1, name: 'Test', address: 'Addr' } as Restaurant;

  beforeEach(async () => {
    repository = {
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        RestaurantService,
        { provide: getRepositoryToken(Restaurant), useValue: repository },
      ],
    }).compile();

    service = module.get<RestaurantService>(RestaurantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should save and return a restaurant', async () => {
      repository.save.mockResolvedValue(mockRestaurant);
      const dto = { name: 'Test', address: 'Addr' };
      const result = await service.create(dto as any);
      expect(result).toEqual(mockRestaurant);
      expect(repository.save).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all restaurants', async () => {
      repository.find.mockResolvedValue([mockRestaurant]);
      const result = await service.findAll();
      expect(result).toEqual([mockRestaurant]);
      expect(repository.find).toHaveBeenCalledWith({ where: {} });
    });
  });

  describe('findOne', () => {
    it('should return a restaurant by id', async () => {
      repository.findOne.mockResolvedValue(mockRestaurant);
      const result = await service.findOne(1);
      expect(result).toEqual(mockRestaurant);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should return null if not found', async () => {
      repository.findOne.mockResolvedValue(null);
      const result = await service.findOne(999);
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should return affected count if update is successful', async () => {
      repository.update.mockResolvedValue({ affected: 1 });
      const result = await service.update(1, { name: 'Updated' } as any);
      expect(result).toBe(1);
      expect(repository.update).toHaveBeenCalledWith(1, { name: 'Updated' });
    });

    it('should return null if update affects no rows', async () => {
      repository.update.mockResolvedValue({ affected: 0 });
      const result = await service.update(1, { name: 'Updated' } as any);
      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should call delete with correct id', async () => {
      repository.delete.mockResolvedValue({});
      await service.remove(1);
      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });
});
