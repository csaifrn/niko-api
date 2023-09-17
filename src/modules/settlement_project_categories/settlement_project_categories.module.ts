import { Module } from '@nestjs/common';
import { SettlementProjectCategoriesService } from './settlement_project_categories.service';
import { SettlementProjectCategoriesController } from './settlement_project_categories.controller';

@Module({
  providers: [SettlementProjectCategoriesService],
  controllers: [SettlementProjectCategoriesController],
})
export class SettlementProjectCategoriesModule {}
