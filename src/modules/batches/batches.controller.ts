import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { BatchesService } from './batches.service';
import { CreateBatchDTO } from './dto/create-batch.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateBatchDTO } from './dto/update-batch.dto';
import { CreateBatchObservationDTO } from './dto/create-batch-observation.dto';
import { UpdateBatchObservationDTO } from './dto/update-batch-observation.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreateBatchAssingmentDTO } from './dto/create-batch-assingment.dto';
import { RemoveBatchAssingmentDTO } from './dto/remove-batch-assigment.dto';
import { UpdateBatchMainStatusDTO } from './dto/update-batch-status.dto';
import { QueryBatcheDTO } from './dto/query-batche.dto';

@ApiTags('Lotes')
@Controller('batches')
export class BatchesController {
  constructor(private readonly batchesService: BatchesService) {}

  @ApiOperation({
    summary: 'Criar lote',
    description: 'Criar lote de documentos.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createBatchDTO: CreateBatchDTO, @Request() req: any) {
    return this.batchesService.create(createBatchDTO, req.user.id);
  }

  @ApiOperation({
    summary: 'Retorna uma lista de lotes com base nos parâmetros de filtragem.',
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get()
  find(@Query() query: QueryBatcheDTO) {
    return this.batchesService.find(query);
  }

  @ApiOperation({
    summary: 'Retornar informações do lote',
  })
  @ApiParam({
    name: 'batch_id',
    description: 'id do lote',
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get(':batch_id')
  findOne(@Param('batch_id') batch_id: string) {
    return this.batchesService.findOne(batch_id);
  }

  @ApiOperation({
    summary: 'Atribuir responsável pelo lote.',
  })
  @ApiParam({
    name: 'batch_id',
    description: 'ID do lote',
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Post(':batch_id/assignment')
  createAssignment(
    @Param('batch_id') batch_id: string,
    @Body() createBatchAssingmentDTO: CreateBatchAssingmentDTO,
    @Request() req: any,
  ) {
    return this.batchesService.assignment(
      batch_id,
      req.user.id,
      createBatchAssingmentDTO,
    );
  }

  @ApiOperation({
    summary: 'Remover responsável pelo lote.',
  })
  @ApiParam({
    name: 'batch_id',
    description: 'ID do lote',
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Delete(':batch_id/assignment')
  removeAssignment(
    @Param('batch_id') batch_id: string,
    @Body() removeBatchAssingmentDTO: RemoveBatchAssingmentDTO,
    @Request() req: any,
  ) {
    return this.batchesService.removeAssignment(
      batch_id,
      req.user.id,
      removeBatchAssingmentDTO,
    );
  }

  @ApiOperation({
    summary: 'Atualizar informações do lote',
    description:
      'Atualizar informações do lote. Todos os campos são opcionais.',
  })
  @ApiParam({
    name: 'batch_id',
    description: 'id do lote',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':batch_id')
  update(
    @Param('batch_id') batch_id: string,
    @Body() updateBatchDTO: UpdateBatchDTO,
  ) {
    return this.batchesService.update(batch_id, updateBatchDTO);
  }

  @ApiOperation({
    summary: 'Atualizar status do lote',
    description:
      'Atualizar status do lote. Status deve indicar um número correpondente a uma das 4 fases.',
  })
  @ApiParam({
    name: 'batch_id',
    description: 'id do lote',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':batch_id/status')
  updateBatchStatus(
    @Param('batch_id') batch_id: string,
    @Body() updateBatchMainStatusDTO: UpdateBatchMainStatusDTO,
    @Request() req: any,
  ) {
    return this.batchesService.updateMainStatus(
      batch_id,
      req.user.id,
      updateBatchMainStatusDTO,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('observations/:batch_id')
  createBatchObsevation(
    @Param('batch_id') batch_id: string,
    @Request() req: any,
    @Body() createBatchObsevationDTO: CreateBatchObservationDTO,
  ) {
    return this.batchesService.createBatchObservation(
      batch_id,
      req.user.id,
      createBatchObsevationDTO,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('observations/:batch_observation_id')
  updateBatchObsevation(
    @Param('batch_observation_id') batch_observation_id: string,
    @Request() req: any,
    @Body() updateBatchObservationDTO: UpdateBatchObservationDTO,
  ) {
    return this.batchesService.updateBatchObservation(
      batch_observation_id,
      req.user.id,
      updateBatchObservationDTO,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('observations/:batch_observation_id')
  deleteBatchObsevation(
    @Param('batch_observation_id') batch_observation_id: string,
  ) {
    return this.batchesService.softDeleteBatchObservation(batch_observation_id);
  }
}
