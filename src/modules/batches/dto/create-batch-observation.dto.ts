import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBatchObservationDTO {
  @IsNotEmpty({ message: 'Observação do lote é obrigatória.' })
  @IsString()
  readonly observation: string;
}
