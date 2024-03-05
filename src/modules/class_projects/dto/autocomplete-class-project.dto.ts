import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AutocompleteClassProjectDTO {
  @ApiProperty({
    type: String,
    required: true,
    title: 'Nome da classe.',
    description: 'O nome da classe a ser realizada uma busca parcial.',
  })
  @IsNotEmpty({ message: 'Nome da classe é obrigatório.' })
  @IsString()
  name: string;
}
