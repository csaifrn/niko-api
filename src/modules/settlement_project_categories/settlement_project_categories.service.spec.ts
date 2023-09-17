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

  const settlement_project_category_id = 'f58d7b9f-bc1c-4f03-8ebc-9fc3d602e62e';

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

      const newSettlmentProjectCategory = await service.create(
        {
          ...settlementProjectCategory,
        },
        settlement_project_category_id,
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
  });
});
