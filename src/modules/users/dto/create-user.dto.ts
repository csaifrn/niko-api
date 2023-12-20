import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty({ message: 'Nome é obrigatório.' })
  @IsString()
  readonly name: string;

  @IsNotEmpty({ message: 'Email é obrigatório.' })
  readonly email: string;

  @IsNotEmpty({ message: 'Senha é obrigatória.' })
  @IsString()
  readonly password: string;

  @IsOptional()
  @IsString()
  readonly role?: string;

  @IsNotEmpty({ message: 'Confirmação de senha é obrigatória.' })
  @IsString()
  readonly passwordConfirm: string;
}
