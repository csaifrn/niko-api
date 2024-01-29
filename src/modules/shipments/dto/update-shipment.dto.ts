import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateShipmentDTO } from './create-shipment.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateShipmentDTO extends PartialType(
  OmitType(CreateShipmentDTO, [] as const),
) {
  @ApiProperty({
    type: String,
    required: false,
    title: 'Título da remessa.',
  })
  @IsString()
  @IsOptional()
  readonly title?: string;

  @ApiProperty({
    type: Number,
    required: false,
    title: 'Quantidade de caixas na remessa.',
  })
  @IsNumber()
  @IsOptional()
  readonly count_boxes?: number;

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
  @IsOptional()
  readonly received_at?: Date;
}
