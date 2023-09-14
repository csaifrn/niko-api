import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateBatchDTO {
  @IsNotEmpty({ message: 'Nome do projeto de assentamento é obrigatório.' })
  @IsString()
  readonly settlement_project: string;

  @IsNotEmpty({ message: 'Número de documentos físicos é obrigatório.' })
  @IsNumber()
  readonly physical_files_count: number;

  @IsOptional()
  @IsBoolean()
  readonly priority?: boolean;
}
