import { Module } from '@nestjs/common';
import { BatchesController } from './batches.controller';
import { BatchesService } from './batches.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Batch } from './entities/batch.entity';
import { BatchObservation } from './entities/batch_observations.entity';
import { ClassProject } from '../class_projects/entities/class_project';
import { BatchHistory } from './entities/batch_history.entity';
import { User } from '../users/entities/user.entity';
import { Tag } from '../tags/entitites/tag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Batch,
      BatchObservation,
      ClassProject,
      BatchHistory,
      Tag,
    ]),
  ],
  controllers: [BatchesController],
  providers: [BatchesService],
  exports: [BatchesService],
})
export class BatchesModule {}
