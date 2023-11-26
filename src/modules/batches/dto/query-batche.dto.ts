import { IsOptional, IsString } from 'class-validator';

export class QueryBatcheDTO {
  @IsOptional()
  @IsString()
  readonly title?: string;

  @IsOptional()
  @IsString()
  readonly main_status?: number;

  @IsOptional()
  @IsString()
  readonly specific_status?: number;
}
