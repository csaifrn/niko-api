import { Module } from '@nestjs/common';
import { BatchCategoriesService } from './batch_categories.service';

@Module({
  providers: [BatchCategoriesService],
})
export class BatchCategoriesModule {}
