import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { MAX_TAGNAME_CHARACTERS } from '../../../utils/validationConstants';

export class CreateTagDTO {
  @ApiProperty({
    type: String,
    required: true,
    title: 'Nome da tag.',
    description: `O nome da tag pode ter no máximo ${MAX_TAGNAME_CHARACTERS} caracteres.`,
  })
  @IsNotEmpty({ message: 'Nome da tag é obrigatório.' })
  @IsString()
  readonly name: string;
}
