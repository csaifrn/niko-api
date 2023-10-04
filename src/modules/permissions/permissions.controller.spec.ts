import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDTO } from './dto/create-permission.dto';

describe('PermissionsController', () => {
  let controller: PermissionsController;
  let service: PermissionsService;
  const user_id = '5b1ee27d-1e3f-4aad-be5e-3be6fd7fea78';

  const uuidPattern =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermissionsController],
      providers: [
        {
          provide: PermissionsService,
          useValue: {
            create: jest.fn().mockResolvedValue({
              id: '5b1ee27d-1e3f-4aad-be5e-3be6fd7fea78',
              name: 'create_batch',
              description: 'Autoriza a criar lotes.',
              created_at: '2023-07-16T23:15:06.942Z',
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<PermissionsController>(PermissionsController);
    service = module.get<PermissionsService>(PermissionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a permission', async () => {
      const body: CreatePermissionDTO = {
        name: 'create_batch',
        description: 'Autoriza a criar lotes.',
      };

      const req = { user: { id: user_id } };

      const newPermission = await controller.create(body, req);

      expect(newPermission).toMatchObject({
        id: '5b1ee27d-1e3f-4aad-be5e-3be6fd7fea78',
        name: 'create_batch',
        description: 'Autoriza a criar lotes.',
        created_at: '2023-07-16T23:15:06.942Z',
      });
      expect(newPermission.id).toMatch(uuidPattern);
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(body, user_id);
    });
  });
});
