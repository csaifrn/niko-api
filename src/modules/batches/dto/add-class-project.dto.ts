import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class AddClassProjectDTO {
  @ApiProperty({
    type: [String],
    required: true,
    title: 'ID do projeto de assentamento.',
    description:
      'ID do projeto de assentamento resposável para ser atrelado ao lote.',
  })
  @IsArray({
    message: 'Os IDs dos projetos de assentamento devem estar em um array.',
  })
  @IsNotEmpty({
    message: 'Os IDs dos projetos de assentamentos são obrigatórios.',
  })
  @IsString({
    each: true,
    message: 'Cada ID do projeto de assentamento deve ser uma string.',
  })
  readonly class_projects_ids: string[];
}
