import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateBatchAssingmentDTO {
  @ApiProperty({
    type: [String],
    required: true,
    title: 'ID do usuário.',
    description: 'ID do usuário que será responsável pelo lote.',
  })
  @IsArray({ message: 'Os IDs dos usuários devem estar em um array.' })
  @IsNotEmpty({ message: 'Os IDs dos usuários são obrigatórios.' })
  @IsString({ each: true, message: 'Cada ID de usuário deve ser uma string.' })
  readonly assignment_users_ids: string[];
}
