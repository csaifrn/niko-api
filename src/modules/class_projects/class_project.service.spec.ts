import { Test, TestingModule } from '@nestjs/testing';
import { ClassProjectService } from './class_project.service';
import { ClassProject } from './entities/class_project';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateClassProjectDTO } from './dto/create-class-project.dto';

describe('ClassProjectService', () => {
  let service: ClassProjectService;
  let classProjectRepository: Repository<ClassProject>;
  const uuidPattern =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

  const mockedClassProject = {
    id: 'f58d7b9f-bc1c-4f03-8ebc-9fc3d602e62e',
    name: 'Projeto Assentamento Santa Cruz',
  };

  const user_id = '5b1ee27d-1e3f-4aad-be5e-3be6fd7fea78';

  const mockedAutocomplete = [
    {
      id: 'bca41e37-ef76-4489-8d5e-df0304d5517a',
      name: 'Projeto de Assentamento Santa Cruz',
    },
    {
      id: 'bca41e37-ef76-4489-8d5e-3be6fd7fea78',
      name: 'Projeto de Assentamento Pium',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClassProjectService,
        {
          provide: getRepositoryToken(ClassProject),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockedClassProject),
            count: jest.fn(),
            create: jest.fn(),
            save: jest.fn().mockResolvedValue(mockedClassProject),
            createQueryBuilder: jest.fn().mockImplementation(() => ({
              innerJoin: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              select: jest.fn().mockReturnThis(),
              addSelect: jest.fn().mockReturnThis(),
              getRawMany: jest.fn().mockResolvedValue(mockedAutocomplete),
            })),
          },
        },
      ],
    }).compile();

    service = module.get<ClassProjectService>(ClassProjectService);
    classProjectRepository = module.get<Repository<ClassProject>>(
      getRepositoryToken(ClassProject),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(classProjectRepository).toBeDefined();
  });

  describe('Create class project', () => {
    it('should create a class project', async () => {
      const classProject: CreateClassProjectDTO = {
        name: 'Projeto Assentamento Santa Cruz',
      };

      jest
        .spyOn(classProjectRepository, 'findOne')
        .mockResolvedValue(null as any);

      const newSettlmentProjectCategory = await service.create(
        {
          ...classProject,
        },
        user_id,
      );

      expect(newSettlmentProjectCategory).toMatchObject({
        id: 'f58d7b9f-bc1c-4f03-8ebc-9fc3d602e62e',
        name: 'Projeto Assentamento Santa Cruz',
      });
      expect(classProjectRepository.create).toHaveBeenCalledTimes(1);
      expect(classProjectRepository.save).toHaveBeenCalledTimes(1);
      expect(newSettlmentProjectCategory.id).toBeDefined();
      expect(newSettlmentProjectCategory.id).toMatch(uuidPattern);
    });

    it('throw an error when class project name is lower than 3 characters', async () => {
      const classProjectCategory: CreateClassProjectDTO = {
        name: 'pr',
      };

      await expect(
        service.create(
          {
            ...classProjectCategory,
          },
          user_id,
        ),
      ).rejects.toThrowError(
        'Projeto de assentamento deve ter ao menos 3 caracteres.',
      );
    });
  });

  describe('Autocomplete class project', () => {
    it('should return a list of class project categories', async () => {
      const class_project = await service.autocomplete('Projeto');

      expect(class_project).toMatchObject({
        searchedText: 'Projeto',
        categories: mockedAutocomplete,
      });
      expect(classProjectRepository.createQueryBuilder).toHaveBeenCalledTimes(
        1,
      );
    });
  });
});
