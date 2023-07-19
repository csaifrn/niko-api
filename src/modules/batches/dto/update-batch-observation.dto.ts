import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { CreateBatchObservationDTO } from './create-batch-observation.dto';

export class UpdateBatchObservationDTO extends PartialType(
  OmitType(CreateBatchObservationDTO, [] as const),
) {
  @IsString()
  @IsOptional()
  readonly observation?: string;
}
