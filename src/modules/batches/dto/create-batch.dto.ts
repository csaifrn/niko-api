import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateBatchDTO {
  @ApiProperty({
    type: String,
    required: true,
    title: 'Nome do projeto de assentamento.',
    description:
      'O nome do projeto de assentamento não pode ter menos de 3 caractereres.',
  })
  @IsNotEmpty({ message: 'Nome do projeto de assentamento é obrigatório.' })
  @IsString()
  readonly title: string;

  @ApiProperty({
    type: Number,
    required: false,
    title: 'Número de arquivos físicos.',
    description: 'O número de arquivos físicos não pode ser menor que zero.',
  })
  @IsOptional()
  @IsNumber()
  readonly physical_files_count?: number;

  @ApiProperty({
    type: Boolean,
    required: false,
    title: 'Prioridade do lote.',
  })
  @IsOptional()
  @IsBoolean()
  readonly priority?: boolean;
}
