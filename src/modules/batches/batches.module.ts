import { Module } from '@nestjs/common';
import { BatchesController } from './batches.controller';
import { BatchesService } from './batches.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Batch } from './entities/batche.entity';
import { BatchObservation } from './entities/batche_observations.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Batch, BatchObservation])],
  controllers: [BatchesController],
  providers: [BatchesService],
  exports: [BatchesService],
})
export class BatchesModule {}
