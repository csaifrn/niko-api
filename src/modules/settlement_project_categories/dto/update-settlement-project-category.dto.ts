import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateSettlementProjectCategoryDTO {
  @ApiProperty({
    type: String,
    required: true,
    title: 'Nome do projeto de assentamento.',
    description:
      'O nome do projeto de assentamento não pode ter menos de 3 caractereres.',
  })
  @IsNotEmpty({ message: 'Nome do projeto de assentamento é obrigatório.' })
  @IsString()
  readonly name: string;
}
