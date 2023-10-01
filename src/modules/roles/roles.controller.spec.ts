import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { CreateRoleDTO } from './dto/create-role.dto';

describe('RolesController', () => {
  let controller: RolesController;
  let service: RolesService;
  const user_id = '5b1ee27d-1e3f-4aad-be5e-3be6fd7fea78';

  const uuidPattern =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [
        {
          provide: RolesService,
          useValue: {
            create: jest.fn().mockResolvedValue({
              id: '5b1ee27d-1e3f-4aad-be5e-3be6fd7fea78',
              name: 'ADMIN',
              description: 'Função de admnistrador do sistema',
              created_at: '2023-07-16T23:15:06.942Z',
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<RolesController>(RolesController);
    service = module.get<RolesService>(RolesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a role', async () => {
      const body: CreateRoleDTO = {
        name: 'ADMIN',
        description: 'Função de admnistrador do sistema',
      };

      const req = { user: { id: user_id } };

      const newRole = await controller.create(body, req);

      expect(newRole).toMatchObject({
        id: '5b1ee27d-1e3f-4aad-be5e-3be6fd7fea78',
        name: 'ADMIN',
        description: 'Função de admnistrador do sistema',
        created_at: '2023-07-16T23:15:06.942Z',
      });
      expect(newRole.id).toMatch(uuidPattern);
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(body, user_id);
    });
  });
});
