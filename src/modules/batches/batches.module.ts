import { Module } from '@nestjs/common';
import { BatchesController } from './batches.controller';
import { BatchesService } from './batches.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Batch } from './entities/batch.entity';
import { BatchObservation } from './entities/batch_observations.entity';
import { SettlementProjectCategory } from '../settlement_project_categories/entities/settlement_project_categories.entity';
import { BatchHistory } from './entities/batch_history.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Batch,
      BatchObservation,
      SettlementProjectCategory,
      BatchHistory,
    ]),
  ],
  controllers: [BatchesController],
  providers: [BatchesService],
  exports: [BatchesService],
})
export class BatchesModule {}
