import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateBatchDTO } from './create-batch.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBatchDTO extends PartialType(
  OmitType(CreateBatchDTO, [] as const),
) {
  @ApiProperty({
    type: String,
    required: false,
    title: 'Nome do projeto de assentamento.',
    description:
      'O nome do projeto de assentamento não pode ter menos de 3 caractereres.',
  })
  @IsString()
  @IsOptional()
  readonly title?: string;

  @ApiProperty({
    type: String,
    required: false,
    title: 'Estante de arquivamento do lote',
  })
  @IsString()
  @IsOptional()
  readonly storage_location?: string;

  @ApiProperty({
    type: Number,
    required: false,
    title: 'Número de arquivos digitais.',
    description: 'O número de arquivos digitais não pode ser menor que zero.',
  })
  @IsNumber()
  @IsOptional()
  readonly digital_files_count?: number;

  @ApiProperty({
    type: Number,
    required: false,
    title: 'Número de arquivos físicos.',
    description: 'O número de arquivos físicos não pode ser menor que zero.',
  })
  @IsNumber()
  @IsOptional()
  readonly physical_files_count?: number;

  @ApiProperty({
    type: Boolean,
    required: false,
    title: 'Prioridade do lote.',
  })
  @IsBoolean()
  @IsOptional()
  readonly priority?: boolean;
}
