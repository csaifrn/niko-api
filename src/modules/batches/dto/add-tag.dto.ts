import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class AddTagDTO {
  @ApiProperty({
    type: [String],
    required: true,
    title: 'ID da tag.',
    description: 'ID da tag resposável para ser atrelada ao lote.',
  })
  @IsArray({ message: 'Os IDs das tags devem estar em um array.' })
  @IsNotEmpty({ message: 'Os IDs das tags são obrigatórios.' })
  @IsString({ each: true, message: 'Cada ID da tag deve ser uma string.' })
  readonly tags: string[];
}
