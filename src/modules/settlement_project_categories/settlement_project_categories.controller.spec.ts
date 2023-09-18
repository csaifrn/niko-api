import { Test, TestingModule } from '@nestjs/testing';
import { SettlementProjectCategoriesController } from './settlement_project_categories.controller';
import { SettlementProjectCategoriesService } from './settlement_project_categories.service';
import { CreateSettlementProjectCategoryDTO } from './dto/create-settlement-project-category.dto';
import { AutoCompleteSettlmentProjectDTO } from './dto/autocomplete-settlement-project.dto';

describe('SettlementProjectCategoriesController', () => {
  let controller: SettlementProjectCategoriesController;
  let service: SettlementProjectCategoriesService;

  const uuidPattern =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

  const mockedSettlementProjectCategory = {
    id: 'f58d7b9f-bc1c-4f03-8ebc-9fc3d602e62e',
    name: 'Projeto Assentamento Santa Cruz',
  };

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

  const user_id = '5b1ee27d-1e3f-4aad-be5e-3be6fd7fea78';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SettlementProjectCategoriesController],
      providers: [
        {
          provide: SettlementProjectCategoriesService,
          useValue: {
            create: jest
              .fn()
              .mockResolvedValue(mockedSettlementProjectCategory),
            autocomplete: jest.fn().mockResolvedValue({
              searchedText: 'Projeto',
              categories: mockedAutocomplete,
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<SettlementProjectCategoriesController>(
      SettlementProjectCategoriesController,
    );
    service = module.get<SettlementProjectCategoriesService>(
      SettlementProjectCategoriesService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a settlement project category', async () => {
      const body: CreateSettlementProjectCategoryDTO = {
        name: 'Projeto Assentamento Santa Cruz',
      };

      const req = { user: { id: user_id } };

      const newSettlementProjectCategory = await controller.create(body, req);

      expect(newSettlementProjectCategory).toMatchObject({
        name: 'Projeto Assentamento Santa Cruz',
      });
      expect(newSettlementProjectCategory.id).toMatch(uuidPattern);
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(body, user_id);
    });
  });

  describe('autocomplete', () => {
    it('should return a list of settlement projects categories', async () => {
      const search: AutoCompleteSettlmentProjectDTO = {
        name: 'Projeto',
      };

      const autocomplete = await controller.autocomplete(search);

      expect(autocomplete).toMatchObject({
        searchedText: 'Projeto',
        categories: mockedAutocomplete,
      });
      expect(service.autocomplete).toHaveBeenCalledTimes(1);
      expect(service.autocomplete).toHaveBeenCalledWith(search.name);
    });
  });
});
