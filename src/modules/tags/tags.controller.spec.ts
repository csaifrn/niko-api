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

  const tagList = [
    {
      id: '7dc93fbd-af05-46a6-baba-f623c1b86478',
      name: 'Financeiro',
    },
    {
      id: 'ad6c4545-8d23-4b18-a88f-b590b375d021',
      name: 'Jurídico',
    },
  ];

  const tagId = 'a175cdbe-78e3-4ef8-a7f9-d8823a177b29';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagsController],
      providers: [
        {
          provide: TagsService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockedTag),
            find: jest.fn().mockResolvedValue(tagList),
            softDeleteTag: jest.fn().mockResolvedValue({ status: 'ok' }),
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

  describe('find', () => {
    it('should return a list of tags', async () => {
      const tags = await controller.find();

      expect(tags).toMatchObject(tagList);
      expect(service.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should create a tag', async () => {
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

  describe('delete', () => {
    it('should delete a tag', async () => {
      const newTag = await controller.delete(tagId);

      expect(newTag).toMatchObject({
        status: 'ok',
      });
      expect(service.softDeleteTag).toHaveBeenCalledTimes(1);
    });
  });
});
