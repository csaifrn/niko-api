import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBatchDTO {
  @IsNotEmpty({ message: 'Nome do projeto de assentamento é obrigatório.' })
  @IsString()
  readonly settlement_project: string;
}
