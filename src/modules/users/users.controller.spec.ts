import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const uuidPattern =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn().mockResolvedValue({
              id: '5b1ee27d-1e3f-4aad-be5e-3be6fd7fea78',
              name: 'Nicholas Tavares',
              email: 'nicholas@email.com',
            }),
            update: jest.fn().mockResolvedValue({
              id: '5b1ee27d-1e3f-4aad-be5e-3be6fd7fea78',
              name: 'Nicholas Tavares',
              email: 'nicholas@email.com',
            }),
            findOne: jest.fn().mockResolvedValue({
              id: '5b1ee27d-1e3f-4aad-be5e-3be6fd7fea78',
              name: 'Nicholas Tavares',
              email: 'nicholas@email.com',
            }),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an user', async () => {
      const body: CreateUserDTO = {
        name: 'Nicholas Tavares',
        email: 'nicholas@email.com',
        password: 'U$er123',
        passwordConfirm: 'U$er123',
      };

      const newUser = await controller.create(body);

      expect(newUser).toMatchObject({
        name: 'Nicholas Tavares',
        email: 'nicholas@email.com',
      });
      expect(newUser.id).toMatch(uuidPattern);
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(body);
    });
  });

  describe('update', () => {
    it('should update an user', async () => {
      const body: UpdateUserDTO = {
        name: 'Nicholas Tavares',
      };

      const mockedRequest = {
        user: {
          id: '5b1ee27d-1e3f-4aad-be5e-3be6fd7fea78',
        },
      };

      const newUser = await controller.update(body, mockedRequest);

      expect(newUser).toMatchObject({
        name: 'Nicholas Tavares',
        email: 'nicholas@email.com',
      });
      expect(newUser.id).toMatch(uuidPattern);
      expect(service.update).toHaveBeenCalledTimes(1);
      expect(service.update).toHaveBeenCalledWith(
        '5b1ee27d-1e3f-4aad-be5e-3be6fd7fea78',
        body,
      );
    });
  });
});
