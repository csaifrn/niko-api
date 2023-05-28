import { IsNotEmpty, IsString } from 'class-validator';
export class VerifyResetPasswordUserDTO {
  @IsNotEmpty({ message: 'Senha é obrigatória.' })
  @IsString()
  readonly password: string;

  @IsNotEmpty({ message: 'Confirme a senha.' })
  @IsString()
  readonly passwordConfirm: string;
}
