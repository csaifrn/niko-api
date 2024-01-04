import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class RemoveSettlementProjectCategoryDTO {
  @ApiProperty({
    type: Array,
    required: true,
    title: 'Array de IDs de categorias de projeto de assentamento.',
    description:
      'Array de IDs de categorias de projeto de assentamento atrelada ao lote.',
  })
  @IsNotEmpty({
    message: 'ID da categoria de projeto de assentamento é obrigatório.',
  })
  @IsArray({
    message: 'Os IDs dos projetos de assentamento devem estar em um array.',
  })
  @IsString({
    each: true,
    message: 'Cada ID do projeto de assentamento deve ser uma string.',
  })
  readonly settlement_project_category_ids: string[];
}
