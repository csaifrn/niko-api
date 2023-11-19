import { Test, TestingModule } from '@nestjs/testing';
import { TagsService } from './tags.service';
import { Repository } from 'typeorm';
import { Tag } from './entitites/tag.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateTagDTO } from './dto/create-tag.dto';
import * as validationConstants from '../../utils/validationConstants';

describe('TagsService', () => {
  let service: TagsService;
  let tagRepository: Repository<Tag>;
  const uuidPattern =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

  const mockedTag = {
    id: '5b1ee27d-1e3f-4aad-be5e-3be6fd7fea78',
    name: 'Financeiro',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagsService,
        {
          provide: getRepositoryToken(Tag),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockedTag),
            create: jest.fn(),
            save: jest.fn().mockResolvedValue(mockedTag),
          },
        },
      ],
    }).compile();

    service = module.get<TagsService>(TagsService);
    tagRepository = module.get<Repository<Tag>>(getRepositoryToken(Tag));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(tagRepository).toBeDefined();
  });

  describe('Create tag', () => {
    it('should create a tag', async () => {
      const tag: CreateTagDTO = {
        name: 'Financeiro',
      };

      jest.spyOn(tagRepository, 'findOne').mockResolvedValue(null);

      const newTag = await service.create({
        ...tag,
      });

      expect(newTag).toMatchObject({
        name: 'Financeiro',
      });
      expect(tagRepository.create).toHaveBeenCalledTimes(1);
      expect(tagRepository.save).toHaveBeenCalledTimes(1);
      expect(newTag.id).toBeDefined();
      expect(newTag.id).toMatch(uuidPattern);
    });

    it(`throw an error if tag name has more than ${validationConstants.MAX_TAGNAME_CHARACTERS} characters`, async () => {
      const tag: CreateTagDTO = {
        name: 'Financeiro Teste Teste',
      };

      jest.spyOn(tagRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.create({
          ...tag,
        }),
      ).rejects.toThrowError(
        `Nome da tag deve ter no máximo ${validationConstants.MAX_TAGNAME_CHARACTERS} caracteres e no mínimo ${validationConstants.MIN_TAGNAME_CHARACTERS} caracteres.`,
      );
    });

    it(`throw an error if tag name hasn't more than ${validationConstants.MIN_TAGNAME_CHARACTERS} characters`, async () => {
      const tag: CreateTagDTO = {
        name: 'F',
      };

      jest.spyOn(tagRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.create({
          ...tag,
        }),
      ).rejects.toThrowError(
        `Nome da tag deve ter no máximo ${validationConstants.MAX_TAGNAME_CHARACTERS} caracteres e no mínimo ${validationConstants.MIN_TAGNAME_CHARACTERS} caracteres.`,
      );
    });

    it('throw an error if tag name already exists', async () => {
      const tag: CreateTagDTO = {
        name: 'Financeiro',
      };

      await expect(
        service.create({
          ...tag,
        }),
      ).rejects.toThrowError(
        'Nome da tag já existe. Por favor, use outro nome.',
      );
    });
  });
});
