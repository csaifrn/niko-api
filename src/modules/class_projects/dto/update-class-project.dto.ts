import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateClassProjectDTO {
  @ApiProperty({
    type: String,
    required: true,
    title: 'Nome da classe.',
    description: 'O nome da classe não pode ter menos de 3 caractereres.',
  })
  @IsNotEmpty({ message: 'Nome da classe é obrigatório.' })
  @IsString()
  readonly name: string;
}
