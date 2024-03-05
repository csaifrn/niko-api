import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateBatchMainStatusDTO {
  @ApiProperty({
    type: Number,
    required: true,
    title: 'Status principal do lote.',
    description:
      'O lote possui quatro níveis de status principais diferentes, em que cada número representa um tipo de status principal. Preparo é 0, Catalogação é 1, Digitalização e Escaneamento é 2, Upload é 3 e Arquivamento é 4.',
  })
  @IsNumber()
  readonly main_status: number;

  @ApiProperty({
    type: String,
    required: false,
    title: 'Local de arquivamento de lote na estante.',
    description:
      'O local de arquivamento do lote é obrigatórios apenas quando for necessaŕio passar o lote para a fase de arquivamento.',
  })
  @IsOptional()
  @IsString()
  readonly storage_location?: string;
}
