import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AutoCompleteUserDTO {
  @ApiProperty({
    type: String,
    required: true,
    title: 'Nome do(a) usuário(a).',
    description: 'O nome do usuário(a) a ser realizada uma busca parcial.',
  })
  @IsNotEmpty({ message: 'Nome do usuário(a) é obrigatório(a).' })
  @IsString()
  name: string;
}
