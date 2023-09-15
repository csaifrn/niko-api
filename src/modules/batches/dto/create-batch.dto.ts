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
    title: 'physical_files_count',
  })
  @IsNotEmpty({ message: 'Nome do projeto de assentamento é obrigatório.' })
  @IsString()
  readonly settlement_project: string;

  @ApiProperty({
    type: Number,
    required: true,
    title: 'physical_files_count',
  })
  @IsNotEmpty({ message: 'Número de documentos físicos é obrigatório.' })
  @IsNumber()
  readonly physical_files_count: number;

  @ApiProperty({
    type: Boolean,
    required: false,
    title: 'physical_files_count',
  })
  @IsOptional()
  @IsBoolean()
  readonly priority?: boolean;
}
