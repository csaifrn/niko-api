import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateTagDTO } from './create-tag.dto';
import { MAX_TAGNAME_CHARACTERS } from '../../../utils/validationConstants';

export class UpdateTagDTO extends PartialType(
  OmitType(CreateTagDTO, [] as const),
) {
  @ApiProperty({
    type: String,
    required: true,
    title: 'Nome da tag.',
    description: `O nome da tag pode ter no máximo ${MAX_TAGNAME_CHARACTERS} caracteres.`,
  })
  @IsString()
  readonly name: string;
}
