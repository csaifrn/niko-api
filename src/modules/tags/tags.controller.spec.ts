import { Test, TestingModule } from '@nestjs/testing';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { CreateTagDTO } from './dto/create-tag.dto';

describe('TagsController', () => {
  let controller: TagsController;
  let service: TagsService;

  const uuidPattern =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

  const mockedTag = {
    id: '5b1ee27d-1e3f-4aad-be5e-3be6fd7fea78',
    name: 'Financeiro',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagsController],
      providers: [
        {
          provide: TagsService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockedTag),
          },
        },
      ],
    }).compile();

    controller = module.get<TagsController>(TagsController);
    service = module.get<TagsService>(TagsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a settlement project category', async () => {
      const body: CreateTagDTO = {
        name: 'Financeiro',
      };

      const newTag = await controller.create(body);

      expect(newTag).toMatchObject({
        id: '5b1ee27d-1e3f-4aad-be5e-3be6fd7fea78',
        name: 'Financeiro',
      });
      expect(newTag.id).toMatch(uuidPattern);
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(body);
    });
  });
});
