import { Module } from '@nestjs/common';
import { SettlementProjectCategoriesService } from './settlement_project_categories.service';
import { SettlementProjectCategoriesController } from './settlement_project_categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettlementProjectCategory } from './entities/settlement_project_categories.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SettlementProjectCategory])],
  providers: [SettlementProjectCategoriesService],
  controllers: [SettlementProjectCategoriesController],
})
export class SettlementProjectCategoriesModule {}
