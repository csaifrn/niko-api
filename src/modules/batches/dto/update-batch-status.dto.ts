import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UpdateBatchStatusDTO {
  @ApiProperty({
    type: Number,
    required: true,
    title: 'Status do lote.',
    description:
      'O lote possui quatro status diferentes, em que cada número representa um status. Recebimento é 0, Preparo é 1, Catalogação é 2 e Escaneamento é 3.',
  })
  @IsNumber()
  readonly status: number;
}
