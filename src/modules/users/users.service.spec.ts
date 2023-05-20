import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;
  const uuidPattern =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

  const mockedUser = {
    id: '5b1ee27d-1e3f-4aad-be5e-3be6fd7fea78',
    name: 'Nicholas Balby',
    email: 'nicholas@email.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockedUser),
            count: jest.fn(),
            create: jest.fn(),
            save: jest.fn().mockResolvedValue(mockedUser),
            createQueryBuilder: jest.fn().mockImplementation(() => ({
              select: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              take: jest.fn().mockReturnThis(),
              getCount: jest.fn(),
            })),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('Create user', () => {
    it('should create an user', async () => {
      const user: CreateUserDTO = {
        name: 'Nicholas Balby',
        email: 'nicholas@email.com',
        password: 'U$er123',
        passwordConfirm: 'U$er123',
      };

      const newUser = await service.create({
        ...user,
      });

      expect(newUser).toMatchObject({
        name: 'Nicholas Balby',
        email: 'nicholas@email.com',
      });
      expect(userRepository.create).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledTimes(1);
      expect(newUser.id).toBeDefined();
      expect(newUser.id).toMatch(uuidPattern);
    });

    it('throw an error when name is lower than 6 characters', async () => {
      const user: CreateUserDTO = {
        name: 'Nicho',
        email: 'nicholas@email.com',
        password: 'U$er123',
        passwordConfirm: 'U$er123',
      };

      await expect(
        service.create({
          ...user,
        }),
      ).rejects.toThrowError('Nome deve ter ao menos 6 caracteres.');
    });

    it('throw an error when email is invalid', async () => {
      const user: CreateUserDTO = {
        name: 'Nicholas Balby',
        email: '@email.com',
        password: 'U$er123',
        passwordConfirm: 'U$er123',
      };

      await expect(
        service.create({
          ...user,
        }),
      ).rejects.toThrowError('Email inválido.');
    });

    it('throw an error when the password has lower than 6 characters and no numbers', async () => {
      const user: CreateUserDTO = {
        name: 'Nicholas Balby',
        email: 'nicholas@email.com',
        password: 'user',
        passwordConfirm: 'user',
      };

      await expect(
        service.create({
          ...user,
        }),
      ).rejects.toThrowError(
        'A senha deve conter no mínimo 6 caracters, letras maiúsculas e minúsculas, números e caracteres especiais.',
      );
    });

    it('throw an error when the password has no uppercase characters', async () => {
      const user: CreateUserDTO = {
        name: 'Nicholas Balby',
        email: 'nicholas@email.com',
        password: 'userlower123',
        passwordConfirm: 'userlower123',
      };

      await expect(
        service.create({
          ...user,
        }),
      ).rejects.toThrowError(
        'A senha deve conter no mínimo 6 caracters, letras maiúsculas e minúsculas, números e caracteres especiais.',
      );
    });

    it('throw an error when the password has no uppercase special characters', async () => {
      const user: CreateUserDTO = {
        name: 'Nicholas Balby',
        email: 'nicholas@email.com',
        password: 'Userlower123',
        passwordConfirm: 'Userlower123',
      };

      await expect(
        service.create({
          ...user,
        }),
      ).rejects.toThrowError(
        'A senha deve conter no mínimo 6 caracters, letras maiúsculas e minúsculas, números e caracteres especiais.',
      );
    });

    it('throw an error when password and passwordConfirm do not match', async () => {
      const user: CreateUserDTO = {
        name: 'Nicholas Balby',
        email: 'nicholas@email.com',
        password: 'U$er123',
        passwordConfirm: '1234U$er',
      };

      await expect(
        service.create({
          ...user,
        }),
      ).rejects.toThrowError('Senha e confirmação de senha são diferentes.');
    });

    it('throw an error when the email already exists', async () => {
      const user1: CreateUserDTO = {
        name: 'Nicholas Balby',
        email: 'nicholas@email.com',
        password: 'U$er123',
        passwordConfirm: 'U$er123',
      };

      await service.create({
        ...user1,
      });

      const user2: CreateUserDTO = {
        name: 'Another User',
        email: 'nicholas@email.com',
        password: 'U$er123',
        passwordConfirm: 'U$er123',
      };

      const createQueryBuilderMock = jest.fn().mockImplementation(() => ({
        where: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(1),
      }));

      jest
        .spyOn(userRepository, 'createQueryBuilder')
        .mockImplementation(createQueryBuilderMock);

      await expect(
        service.create({
          ...user2,
        }),
      ).rejects.toThrowError('Email já existe. Por favor, use outro email.');
    });
  });
});