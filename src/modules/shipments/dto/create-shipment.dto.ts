import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateShipmentDTO {
  @ApiProperty({
    type: String,
    required: false,
    title: 'Título da remessa.',
  })
  @IsOptional()
  @IsString()
  readonly title?: string;

  @ApiProperty({
    type: String,
    required: false,
    title: 'Descrição da remessa.',
  })
  @IsOptional()
  @IsString()
  readonly description?: string;

  @ApiProperty({
    type: Number,
    required: false,
    title: 'Quantidade de caixas na remessa.',
  })
  @IsNotEmpty({ message: 'Quantidade de caixas é obrigatório.' })
  @IsNumber()
  readonly count_boxes: number;

  @ApiProperty({
    type: String,
    required: false,
    title: 'Observação da remessa.',
  })
  @IsOptional()
  @IsString()
  readonly observation?: string;

  @ApiProperty({
    type: Date,
    required: true,
    title: 'Data de recebimento da remessa.',
  })
  @IsNotEmpty({ message: 'Data de recebimento da remessa é obrigatório.' })
  readonly received_at: Date;
}
