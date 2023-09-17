import { Module } from '@nestjs/common';
import { BatchesController } from './batches.controller';
import { BatchesService } from './batches.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Batch } from './entities/batche.entity';
import { BatchObservation } from './entities/batche_observations.entity';
import { SettlementProjectCategory } from '../settlement_project_categories/entities/settlement_project_categories.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Batch,
      BatchObservation,
      SettlementProjectCategory,
    ]),
  ],
  controllers: [BatchesController],
  providers: [BatchesService],
  exports: [BatchesService],
})
export class BatchesModule {}
