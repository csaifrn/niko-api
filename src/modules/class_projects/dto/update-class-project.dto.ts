import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateClassProjectDTO {
  @ApiProperty({
    type: String,
    required: false,
    title: 'Nome da classe.',
    description: 'O nome da classe não pode ter menos de 3 caractereres.',
  })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiProperty({
    type: Boolean,
    required: false,
    title: 'Prioridade da classe.',
    description:
      'Prioridade da classe é um valor booleano. Se estiver como true, é prioridade.',
  })
  @IsOptional()
  @IsBoolean()
  readonly priority?: boolean;
}
