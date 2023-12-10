import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RemoveSettlementProjectCategoryDTO {
  @ApiProperty({
    type: String,
    required: true,
    title: 'ID da categoria de projeto de assentamento.',
    description: 'ID da categoria de projeto de assentamento atrelada ao lote.',
  })
  @IsNotEmpty({
    message: 'ID da categoria de projeto de assentamento é obrigatório.',
  })
  @IsString()
  readonly settlement_project_category_id: string;
}
