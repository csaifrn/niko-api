import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTagDTO {
  @IsNotEmpty({ message: 'Nome da tag é obrigatório.' })
  @IsString()
  readonly name: string;
}
