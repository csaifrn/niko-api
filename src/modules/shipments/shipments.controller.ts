import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ShipmentsService } from './shipments.service';
import { ApiBearerAuth, ApiOperation, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateShipmentDTO } from './dto/create-shipment.dto';
import { UpdateShipmentDTO } from './dto/update-shipment.dto';

@Controller('shipments')
export class ShipmentsController {
  constructor(private readonly shipmentsService: ShipmentsService) {}

  @ApiOperation({
    summary: 'Criar remessa.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createShipmentDTO: CreateShipmentDTO, @Request() req: any) {
    return this.shipmentsService.create(createShipmentDTO, req.user.id);
  }

  @ApiOperation({
    summary: 'Retorna informações da remessa.',
  })
  @ApiParam({
    name: 'shipment_id',
    description: 'id da remessa',
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get(':shipment_id')
  findOne(@Param('shipment_id') shipment_id: string) {
    return this.shipmentsService.findOne(shipment_id);
  }

  @ApiOperation({
    summary: 'Retorna uma lista de remessas.',
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get()
  find() {
    return this.shipmentsService.find();
  }

  @ApiOperation({
    summary: 'Atualizar remessa.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':shipment_id')
  update(
    @Param('shipment_id') shipment_id: string,
    @Body() updateShipmentDTO: UpdateShipmentDTO,
  ) {
    return this.shipmentsService.update(shipment_id, updateShipmentDTO);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':shipment_id')
  deleteBatchObsevation(@Param('shipment_id') shipment_id: string) {
    return this.shipmentsService.softDeleteShipment(shipment_id);
  }
}
