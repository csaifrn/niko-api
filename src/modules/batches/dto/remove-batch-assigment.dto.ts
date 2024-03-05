import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RemoveBatchAssingmentDTO {
  @ApiProperty({
    type: String,
    required: true,
    title: 'ID do usuário.',
    description: 'ID do usuário que é responsável pelo lote.',
  })
  @IsNotEmpty({ message: 'ID do usuário é obrigatório.' })
  @IsString()
  readonly assignment_user_id: string;
}
