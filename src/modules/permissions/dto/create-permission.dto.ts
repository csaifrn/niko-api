import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePermissionDTO {
  @ApiProperty({
    type: String,
    required: true,
    title: 'Nome da permissão.',
    description:
      'O nome da permissão é o nome que define a ação que o usuário pode realizar no sistema. Deve ter no mínimo três caracteres e ser única.',
  })
  @IsNotEmpty({ message: 'Nome da permissão é obrigatório.' })
  @IsString()
  readonly name: string;

  @ApiProperty({
    type: String,
    required: true,
    title: 'Descrição da permissão.',
    description:
      'A descrição da permissão é uma frase que detalha a ação da permissão. Deve ter no mínimo dez caracteres.',
  })
  @IsNotEmpty({ message: 'Nome da permissão é obrigatório.' })
  @IsString()
  readonly description: string;
}
