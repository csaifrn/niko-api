import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UpdateBatchMainStatusDTO {
  @ApiProperty({
    type: Number,
    required: true,
    title: 'Status principal do lote.',
    description:
      'O lote possui quatro níveis de status principais diferentes, em que cada número representa um tipo de status principal. Recebimento é 0, Preparo é 1, Catalogação é 2 e Escaneamento é 3.',
  })
  @IsNumber()
  readonly main_status: number;
}
