import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateBatchDTO } from './create-batch.dto';

export class UpdateBatchDTO extends PartialType(
  OmitType(CreateBatchDTO, [] as const),
) {
  @IsString()
  @IsOptional()
  readonly settlement_project?: string;

  @IsNumber()
  @IsOptional()
  readonly digital_files_count?: number;

  @IsNumber()
  @IsOptional()
  readonly physical_files_count?: number;

  @IsBoolean()
  @IsOptional()
  readonly priority?: boolean;
}
