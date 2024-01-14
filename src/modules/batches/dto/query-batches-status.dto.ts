import { IsDateString } from 'class-validator';

export class QueryBatchesStatusDTO {
  @IsDateString()
  readonly start_date: Date;

  @IsDateString()
  readonly end_date: Date;
}
