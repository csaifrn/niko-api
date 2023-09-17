import { Module } from '@nestjs/common';
import { SettlementProjectCategoriesService } from './settlement_project_categories.service';

@Module({
  providers: [SettlementProjectCategoriesService],
})
export class SettlementProjectCategoriesModule {}
