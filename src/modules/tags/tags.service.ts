import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entitites/tag.entity';
import { Repository } from 'typeorm';
import { CreateTagDTO } from './dto/create-tag.dto';
import * as validation from '../../utils/validationFunctions.util';
import * as validationConstants from '../../utils/validationConstants';
import { CreatedTagResponse } from './interfaces/create-tag-response.interface';
import { SoftDeleteTagResponse } from './interfaces/soft-delete-tag-response.interface';
import { UpdateTagDTO } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  public async find(): Promise<Tag[]> {
    const tags = await this.tagRepository.find({
      select: ['id', 'name'],
    });
    return tags;
  }

  public async create({ name }: CreateTagDTO): Promise<CreatedTagResponse> {
    if (validation.isTagNameInvalid(name)) {
      throw new BadRequestException(
        `Nome da tag deve ter no máximo ${validationConstants.MAX_TAGNAME_CHARACTERS} caracteres e no mínimo ${validationConstants.MIN_TAGNAME_CHARACTERS} caracteres.`,
      );
    }

    const existingTag = await this.tagRepository.findOne({
      where: {
        name: name.trim(),
      },
    });

    if (existingTag) {
      throw new BadRequestException(
        'Nome da tag já existe. Por favor, use outro nome.',
      );
    }

    const tag = this.tagRepository.create({
      name: name.trim(),
    });

    const savedTag = await this.tagRepository.save(tag);

    return {
      id: savedTag.id,
      name: savedTag.name,
    };
  }

  public async update(
    tag_id: string,
    updateTagDTO: UpdateTagDTO,
  ): Promise<any> {
    const tag = await this.tagRepository.findOne({
      where: {
        id: tag_id,
      },
      select: ['id'],
    });

    if (!tag) {
      throw new NotFoundException('Tag não encontrada.');
    }

    if (
      updateTagDTO?.name !== null &&
      updateTagDTO?.name !== undefined &&
      validation.isTagNameInvalid(updateTagDTO.name)
    ) {
      throw new BadRequestException(
        `Nome da tag deve ter no máximo ${validationConstants.MAX_TAGNAME_CHARACTERS} caracteres e no mínimo ${validationConstants.MIN_TAGNAME_CHARACTERS} caracteres.`,
      );
    }

    const filteredDTO = Object.fromEntries(
      Object.entries(updateTagDTO).filter(
        ([, value]) => value !== null && value !== undefined,
      ),
    );

    Object.assign(tag, filteredDTO);

    await this.tagRepository.save(tag);

    return {
      status: 'ok',
    };
  }

  public async softDeleteTag(tag_id: string): Promise<SoftDeleteTagResponse> {
    const tag = await this.tagRepository.findOne({
      where: {
        id: tag_id.trim(),
      },
      select: ['id'],
    });

    if (!tag) {
      throw new NotFoundException('Tag não encontrada.');
    }

    await this.tagRepository.softRemove(tag);

    return {
      status: 'ok',
    };
  }
}
