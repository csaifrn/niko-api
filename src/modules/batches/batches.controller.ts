import {
  Body,
  Controller,
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

@Controller('batches')
export class BatchesController {
  constructor(private readonly batchesService: BatchesService) {}

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
}
