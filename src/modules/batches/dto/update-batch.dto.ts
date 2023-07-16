import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { CreateBatchDTO } from './create-batch.dto';

export class UpdateBatchDTO extends PartialType(
  OmitType(CreateBatchDTO, [] as const),
) {
  @IsString()
  @IsOptional()
  readonly settlement_project?: string;
}
