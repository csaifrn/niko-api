import { Test, TestingModule } from '@nestjs/testing';
import { SettlementProjectCategoriesService } from './settlement_project_categories.service';
import { SettlementProjectCategory } from './entities/settlement_project_categories.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateSettlementProjectCategoryDTO } from './dto/create-settlement-project-category.dto';

describe('SettlementProjectCategoriesService', () => {
  let service: SettlementProjectCategoriesService;
  let settlementProjectCategoryRepository: Repository<SettlementProjectCategory>;
  const uuidPattern =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

  const mockedSettlementProjectCategory = {
    id: 'f58d7b9f-bc1c-4f03-8ebc-9fc3d602e62e',
    name: 'Projeto Assentamento Santa Cruz',
  };

  const user_id = '5b1ee27d-1e3f-4aad-be5e-3be6fd7fea78';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SettlementProjectCategoriesService,
        {
          provide: getRepositoryToken(SettlementProjectCategory),
          useValue: {
            findOne: jest
              .fn()
              .mockResolvedValue(mockedSettlementProjectCategory),
            count: jest.fn(),
            create: jest.fn(),
            save: jest.fn().mockResolvedValue(mockedSettlementProjectCategory),
          },
        },
      ],
    }).compile();

    service = module.get<SettlementProjectCategoriesService>(
      SettlementProjectCategoriesService,
    );
    settlementProjectCategoryRepository = module.get<
      Repository<SettlementProjectCategory>
    >(getRepositoryToken(SettlementProjectCategory));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(settlementProjectCategoryRepository).toBeDefined();
  });

  describe('Create settlement project category', () => {
    it('should create a settlement project category', async () => {
      const settlementProjectCategory: CreateSettlementProjectCategoryDTO = {
        name: 'Projeto Assentamento Santa Cruz',
      };

      jest
        .spyOn(settlementProjectCategoryRepository, 'findOne')
        .mockResolvedValue(null as any);

      const newSettlmentProjectCategory = await service.create(
        {
          ...settlementProjectCategory,
        },
        user_id,
      );

      expect(newSettlmentProjectCategory).toMatchObject({
        id: 'f58d7b9f-bc1c-4f03-8ebc-9fc3d602e62e',
        name: 'Projeto Assentamento Santa Cruz',
      });
      expect(settlementProjectCategoryRepository.create).toHaveBeenCalledTimes(
        1,
      );
      expect(settlementProjectCategoryRepository.save).toHaveBeenCalledTimes(1);
      expect(newSettlmentProjectCategory.id).toBeDefined();
      expect(newSettlmentProjectCategory.id).toMatch(uuidPattern);
    });

    it('throw an error when settlement project category name is lower than 3 characters', async () => {
      const settlementProjectCategory: CreateSettlementProjectCategoryDTO = {
        name: 'pr',
      };

      await expect(
        service.create(
          {
            ...settlementProjectCategory,
          },
          user_id,
        ),
      ).rejects.toThrowError(
        'Projeto de assentamento deve ter ao menos 3 caracteres.',
      );
    });

    it('throw an error if settlement project category name already exists', async () => {
      const settlementProjectCategory: CreateSettlementProjectCategoryDTO = {
        name: 'Projeto Assentamento Santa Cruz',
      };

      jest
        .spyOn(settlementProjectCategoryRepository, 'findOne')
        .mockResolvedValue(mockedSettlementProjectCategory as any);

      await expect(
        service.create(
          {
            ...settlementProjectCategory,
          },
          user_id,
        ),
      ).rejects.toThrowError(
        'Já existe uma categoria de projeto de assentamento com esse nome. Escolha outro nome.',
      );
    });
  });
});
