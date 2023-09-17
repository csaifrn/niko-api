import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { SettlementProjectCategoriesService } from './settlement_project_categories.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateSettlementProjectCategoryDTO } from './dto/create-settlement-project-category.dto';

@Controller('settlement-project-categories')
export class SettlementProjectCategoriesController {
  constructor(
    private readonly settlementProjectCategoriesService: SettlementProjectCategoriesService,
  ) {}

  @ApiOperation({
    summary: 'Criar categoria de projeto de assentamento',
    description:
      'Uma categoria é necessária pela necessidade do lote pertencer a uma categoria de projeto de assentamento.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(
    @Body()
    createSettlementProjectCategoryDTO: CreateSettlementProjectCategoryDTO,
    @Request() req: any,
  ) {
    return this.settlementProjectCategoriesService.create(
      createSettlementProjectCategoryDTO,
      req.user.id,
    );
  }
}
