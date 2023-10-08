import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDTO {
  @ApiProperty({
    type: String,
    required: true,
    title: 'Nome da função.',
    description:
      'O nome da função é o nome identificado do nível de acesso dos usuário no sistema. Deve ter no mínimo três caracteres e ser única.',
  })
  @IsNotEmpty({ message: 'Nome da função é obrigatório.' })
  @IsString()
  readonly name: string;

  @ApiProperty({
    type: String,
    required: true,
    title: 'Descrição da função.',
    description:
      'A descrição da função é uma frase que detalha o objetivo da mesma. Deve ter no mínimo cinco caracteres.',
  })
  @IsNotEmpty({ message: 'Nome da função é obrigatório.' })
  @IsString()
  readonly description: string;

  @ApiProperty({
    type: Array<string>,
    required: true,
    title: 'Lista de permissões.',
    description:
      'A função precisa ser atrelada as permissões que ela possui no sistema. Passar array de ids em que cada id representa uma permissão.',
  })
  @IsNotEmpty({ message: 'Nome da função é obrigatório.' })
  @IsArray()
  readonly permissions: string[];
}
