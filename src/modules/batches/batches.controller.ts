import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { BatchesService } from './batches.service';
import { CreateBatchDTO } from './dto/create-batch.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('batches')
export class BatchesController {
  constructor(private readonly batchesService: BatchesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createBatchDTO: CreateBatchDTO, @Request() req: any) {
    return this.batchesService.create(createBatchDTO, req.user.id);
  }
}
