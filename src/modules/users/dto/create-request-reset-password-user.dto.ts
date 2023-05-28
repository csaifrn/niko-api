import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateRequestResetPasswordUserDTO {
  @IsNotEmpty({ message: 'Email é obrigatório.' })
  @IsEmail(
    {},
    {
      message: 'Insira um email válido.',
    },
  )
  readonly email: string;
}
