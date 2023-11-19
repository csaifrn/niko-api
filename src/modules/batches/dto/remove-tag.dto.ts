import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RemoveTagDTO {
  @ApiProperty({
    type: String,
    required: true,
    title: 'ID da tag.',
    description: 'ID da tag atrelada ao lote.',
  })
  @IsNotEmpty({ message: 'ID da tag é obrigatório.' })
  @IsString()
  readonly tag_id: string;
}
