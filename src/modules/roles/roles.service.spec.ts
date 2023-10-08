import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateRoleDTO } from './dto/create-role.dto';
import { Permission } from '../permissions/entities/permission.entity';

describe('RolesService', () => {
  let service: RolesService;
  let roleRepository: Repository<Role>;
  const uuidPattern =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
  const user_id = '5b1ee27d-1e3f-4aad-be5e-3be6fd7fea78';

  const mockedRole = {
    id: '5b1ee27d-1e3f-4aad-be5e-3be6fd7fea78',
    name: 'ADMIN',
    description: 'Função de administrador do sistema.',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: getRepositoryToken(Role),
          useValue: {
            create: jest.fn(),
            findOne: jest.fn().mockResolvedValue(mockedRole),
            save: jest.fn().mockResolvedValue(mockedRole),
          },
        },
        {
          provide: getRepositoryToken(Permission),
          useValue: {
            findBy: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
    roleRepository = module.get<Repository<Role>>(getRepositoryToken(Role));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(roleRepository).toBeDefined();
  });

  describe('Create role', () => {
    it('should create a role', async () => {
      const role: CreateRoleDTO = {
        name: 'ADMIN',
        description: 'Função de administrador do sistema.',
        permissions: [
          '37ad2522-4970-4b77-a366-f344991469d6',
          '5699c29f-ea44-4ee1-b024-4e90a86d1162',
        ],
      };

      jest.spyOn(roleRepository, 'findOne').mockResolvedValue(null as any);

      const newRole = await service.create(
        {
          ...role,
        },
        user_id,
      );

      expect(newRole).toMatchObject({
        id: '5b1ee27d-1e3f-4aad-be5e-3be6fd7fea78',
        name: 'ADMIN',
        description: 'Função de administrador do sistema.',
      });
      expect(roleRepository.create).toHaveBeenCalledTimes(1);
      expect(roleRepository.save).toHaveBeenCalledTimes(1);
      expect(newRole.id).toBeDefined();
      expect(newRole.id).toMatch(uuidPattern);
    });

    it('throw an error when name role is lower than 3 characters', async () => {
      const role: CreateRoleDTO = {
        name: 'AD',
        description: 'Função de administrador do sistema.',
        permissions: [
          '37ad2522-4970-4b77-a366-f344991469d6',
          '5699c29f-ea44-4ee1-b024-4e90a86d1162',
        ],
      };

      await expect(
        service.create(
          {
            ...role,
          },
          user_id,
        ),
      ).rejects.toThrowError('Função deve ter ao menos 3 caracteres.');
    });

    it('throw an error when description role is lower than 5 characters', async () => {
      const role: CreateRoleDTO = {
        name: 'ADMIN',
        description: 'Nada',
        permissions: [
          '37ad2522-4970-4b77-a366-f344991469d6',
          '5699c29f-ea44-4ee1-b024-4e90a86d1162',
        ],
      };

      await expect(
        service.create(
          {
            ...role,
          },
          user_id,
        ),
      ).rejects.toThrowError(
        'Descrição da função deve ter ao menos 5 caracteres.',
      );
    });

    it('throw an error when description role name already exists', async () => {
      const role: CreateRoleDTO = {
        name: 'ADMIN',
        description: 'Função de administrador do sistema.',
        permissions: [
          '37ad2522-4970-4b77-a366-f344991469d6',
          '5699c29f-ea44-4ee1-b024-4e90a86d1162',
        ],
      };

      await expect(
        service.create(
          {
            ...role,
          },
          user_id,
        ),
      ).rejects.toThrowError(
        'Já existe uma função com esse nome. Escolha outro nome.',
      );
    });
  });
});
