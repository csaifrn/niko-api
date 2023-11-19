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
    id: 'a175cdbe-78e3-4ef8-a7f9-d8823a177b29',
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
      providers: [
        TagsService,
        {
          provide: getRepositoryToken(Tag),
          useValue: {
            find: jest.fn().mockResolvedValue(tagList),
            findOne: jest.fn().mockResolvedValue(mockedTag),
            create: jest.fn(),
            softRemove: jest.fn(),
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

  describe('List tags', () => {
    it('should return a list of tags', async () => {
      const tagList = await service.find();

      expect(tagList).toMatchObject(tagList);
      expect(tagRepository.find).toHaveBeenCalledTimes(1);
    });
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

  describe('Soft delete tag', () => {
    it('should soft delete tag', async () => {
      const newTag = await service.softDeleteTag(tagId);

      expect(newTag).toMatchObject({
        status: 'ok',
      });
      expect(tagRepository.findOne).toHaveBeenCalledTimes(1);
      expect(tagRepository.softRemove).toHaveBeenCalledTimes(1);
    });

    it('throw an tag is not found', async () => {
      jest.spyOn(tagRepository, 'findOne').mockResolvedValue(null);

      await expect(service.softDeleteTag(tagId)).rejects.toThrowError(
        'Tag não encontrada.',
      );
    });
  });
});
