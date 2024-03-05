import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UpdateBatchSpecificStatusDTO {
  @ApiProperty({
    type: Number,
    required: true,
    title: 'Status específico do lote.',
    description:
      'O lote possui três níveis de status específicos diferentes, em que cada número representa um tipo de status principal. Disponível é 0, Em Andamento é 1, Concluído é 2.',
  })
  @IsNumber()
  readonly specific_status: number;
}
