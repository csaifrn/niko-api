import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entitites/tag.entity';
import { Repository } from 'typeorm';
import { CreateTagDTO } from './dto/create-tag.dto';
import * as validation from '../../utils/validationFunctions.util';
import * as validationConstants from '../../utils/validationConstants';
import { CreatedTagResponse } from './interfaces/create-tag-response.interface';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

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
}
