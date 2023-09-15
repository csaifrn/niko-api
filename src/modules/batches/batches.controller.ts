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
import { BatchesService } from './batches.service';
import { CreateBatchDTO } from './dto/create-batch.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateBatchDTO } from './dto/update-batch.dto';
import { CreateBatchObservationDTO } from './dto/create-batch-observation.dto';
import { UpdateBatchObservationDTO } from './dto/update-batch-observation.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Lotes')
@Controller('batches')
export class BatchesController {
  constructor(private readonly batchesService: BatchesService) {}

  @ApiOperation({
    summary: 'Criar lote',
    description: 'Criar lote de documentos',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createBatchDTO: CreateBatchDTO, @Request() req: any) {
    return this.batchesService.create(createBatchDTO, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':batch_id')
  findOne(@Param('batch_id') batch_id: string) {
    return this.batchesService.findOne(batch_id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':batch_id')
  update(
    @Param('batch_id') batch_id: string,
    @Body() updateBatchDTO: UpdateBatchDTO,
  ) {
    return this.batchesService.update(batch_id, updateBatchDTO);
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
    @Body() updateBatchObservationDTO: UpdateBatchObservationDTO,
  ) {
    return this.batchesService.updateBatchObservation(
      batch_observation_id,
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
