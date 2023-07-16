import { Module } from '@nestjs/common';
import { BatchesController } from './batches.controller';
import { BatchesService } from './batches.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Batch } from './entities/batche.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Batch])],
  controllers: [BatchesController],
  providers: [BatchesService],
  exports: [BatchesService],
})
export class BatchesModule {}
