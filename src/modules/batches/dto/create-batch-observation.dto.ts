import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBatchObservationDTO {
  @IsNotEmpty({ message: 'Observação do lote é obrigatória.' })
  @IsString()
  readonly observation: string;

  @IsOptional()
  @IsBoolean()
  readonly is_pending?: boolean;
}
