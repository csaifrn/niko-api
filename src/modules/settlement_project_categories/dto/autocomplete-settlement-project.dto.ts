import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AutoCompleteSettlmentProjectDTO {
  @ApiProperty({
    type: String,
    required: true,
    title: 'Nome do projeto de assentamento.',
    description:
      'O nome do projeto de assentamento a ser realizada uma busca parcial.',
  })
  @IsNotEmpty({ message: 'Nome do projeto de assentamento é obrigatório.' })
  @IsString()
  name: string;
}
