import { IsOptional, IsString } from 'class-validator';

export class QueryBatcheDTO {
  @IsOptional()
  @IsString()
  readonly title?: string;

  @IsOptional()
  @IsString()
  readonly status?: number;
}
