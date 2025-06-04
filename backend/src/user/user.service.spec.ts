import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserService', () => {
  let service: UserService;
  let repository: jest.Mocked<Repository<User>>;

  const mockUser: User = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    role: 'employee',
    phone: '123-456-7890',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get(getRepositoryToken(User));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const createUserDto: CreateUserDto = {
        name: 'New User',
        email: 'new@example.com',
        role: 'employee',
        phone: '123-456-7890'
      };

      repository.findOne.mockResolvedValue(null); // No existing user
      repository.save.mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { email: 'new@example.com' }
      });
      expect(repository.save).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(mockUser);
    });

    it('should throw ConflictException if user with email already exists', async () => {
      const createUserDto: CreateUserDto = {
        name: 'New User',
        email: 'test@example.com',
        role: 'employee',
        phone: '123-456-7890'
      };

      repository.findOne.mockResolvedValue(mockUser);

      await expect(service.create(createUserDto))
        .rejects.toThrow(new ConflictException('User with this email already exists'));
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [mockUser];
      repository.find.mockResolvedValue(users);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalledWith({
        where: {},
        order: { createdAt: 'DESC' }
      });
      expect(result).toEqual(users);
    });

    it('should return users with query filters', async () => {
      const query = { role: 'admin' };
      const users = [mockUser];
      repository.find.mockResolvedValue(users);

      const result = await service.findAll(query);

      expect(repository.find).toHaveBeenCalledWith({
        where: query,
        order: { createdAt: 'DESC' }
      });
      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      repository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOne(1);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999))
        .rejects.toThrow(new NotFoundException('User with ID 999 not found'));
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      repository.findOne.mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@example.com');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' }
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      repository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a user successfully', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Updated User'
      };

      repository.findOne
        .mockResolvedValueOnce(mockUser) // First call in update method
        .mockResolvedValueOnce(mockUser); // Second call in findOne at the end
      repository.update.mockResolvedValue({ affected: 1 } as any);

      const result = await service.update(1, updateUserDto);

      expect(repository.update).toHaveBeenCalledWith(1, updateUserDto);
      expect(result).toEqual(mockUser);
    });

    it('should check for email conflicts when updating email', async () => {
      const updateUserDto: UpdateUserDto = {
        email: 'newemail@example.com'
      };

      repository.findOne
        .mockResolvedValueOnce(mockUser) // First call to check if user exists
        .mockResolvedValueOnce(null) // Second call to check email conflict
        .mockResolvedValueOnce(mockUser); // Third call in findOne at the end
      repository.update.mockResolvedValue({ affected: 1 } as any);

      const result = await service.update(1, updateUserDto);

      expect(repository.findOne).toHaveBeenCalledTimes(3);
      expect(result).toEqual(mockUser);
    });

    it('should throw ConflictException if email already exists', async () => {
      const updateUserDto: UpdateUserDto = {
        email: 'existing@example.com'
      };

      const existingUser = { ...mockUser, id: 2, email: 'existing@example.com' };
      
      repository.findOne
        .mockResolvedValueOnce(mockUser) // User being updated
        .mockResolvedValueOnce(existingUser); // Existing user with same email

      await expect(service.update(1, updateUserDto))
        .rejects.toThrow(new ConflictException('User with this email already exists'));
    });

    it('should throw NotFoundException if user not found for update', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.update(999, {}))
        .rejects.toThrow(new NotFoundException('User with ID 999 not found'));
    });
  });

  describe('remove', () => {
    it('should remove a user successfully', async () => {
      repository.delete.mockResolvedValue({ affected: 1 } as any);

      await service.remove(1);

      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if user not found for deletion', async () => {
      repository.delete.mockResolvedValue({ affected: 0 } as any);

      await expect(service.remove(999))
        .rejects.toThrow(new NotFoundException('User with ID 999 not found'));
    });
  });
});
