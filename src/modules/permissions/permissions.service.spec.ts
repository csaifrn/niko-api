import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsService } from './permissions.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { CreatePermissionDTO } from './dto/create-permission.dto';

describe('PermissionsService', () => {
  let service: PermissionsService;
  let permissionRepository: Repository<Permission>;
  const uuidPattern =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
  const user_id = '5b1ee27d-1e3f-4aad-be5e-3be6fd7fea78';

  const mockedPermission = {
    id: '5b1ee27d-1e3f-4aad-be5e-3be6fd7fea78',
    name: 'create_batch',
    description: 'Autoriza a criar lotes.',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsService,
        {
          provide: getRepositoryToken(Permission),
          useValue: {
            create: jest.fn().mockResolvedValue({
              name: 'create_batch',
              description: 'Autoriza a criar lotes.',
            }),
            findOne: jest.fn().mockResolvedValue(mockedPermission),
            save: jest.fn().mockResolvedValue(mockedPermission),
          },
        },
      ],
    }).compile();

    service = module.get<PermissionsService>(PermissionsService);
    permissionRepository = module.get<Repository<Permission>>(
      getRepositoryToken(Permission),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(permissionRepository).toBeDefined();
  });

  describe('Create permission', () => {
    it('should create a permission', async () => {
      const role: CreatePermissionDTO = {
        name: 'create_batch',
        description: 'Autoriza a criar lotes.',
      };

      jest
        .spyOn(permissionRepository, 'findOne')
        .mockResolvedValue(null as any);

      const newPermission = await service.create(
        {
          ...role,
        },
        user_id,
      );

      expect(newPermission).toMatchObject({
        id: '5b1ee27d-1e3f-4aad-be5e-3be6fd7fea78',
        name: 'create_batch',
        description: 'Autoriza a criar lotes.',
      });
      expect(permissionRepository.create).toHaveBeenCalledTimes(1);
      expect(permissionRepository.save).toHaveBeenCalledTimes(1);
      expect(newPermission.id).toBeDefined();
      expect(newPermission.id).toMatch(uuidPattern);
    });

    it('throw an error when name permission is lower than 3 characters', async () => {
      const permission: CreatePermissionDTO = {
        name: 'cr',
        description: 'Função de administrador do sistema.',
      };

      await expect(
        service.create(
          {
            ...permission,
          },
          user_id,
        ),
      ).rejects.toThrowError('Permissão deve ter ao menos 3 caracteres.');
    });

    it('throw an error when description permission is lower than 10 characters', async () => {
      const permission: CreatePermissionDTO = {
        name: 'create_batch',
        description: 'Criar',
      };

      await expect(
        service.create(
          {
            ...permission,
          },
          user_id,
        ),
      ).rejects.toThrowError(
        'Descrição da permissão deve ter ao menos 10 caracteres.',
      );
    });

    it('throw an error when name permission already exists', async () => {
      const permission: CreatePermissionDTO = {
        name: 'create_batch',
        description: 'Autoriza a criar lotes.',
      };

      await expect(
        service.create(
          {
            ...permission,
          },
          user_id,
        ),
      ).rejects.toThrowError(
        'Já existe uma permissão com esse nome. Escolha outro nome.',
      );
    });
  });
});
