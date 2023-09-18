import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { SettlementProjectCategoriesService } from './settlement_project_categories.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateSettlementProjectCategoryDTO } from './dto/create-settlement-project-category.dto';
import { AutoCompleteSettlmentProjectDTO } from './dto/autocomplete-settlement-project.dto';

@ApiTags('Categorias de projetos de assentamentos')
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

  @ApiOperation({
    summary: 'Autocomplete de projetos de assentamento',
    description:
      'Ao receber um parâmetro name na rota, este endpoint irá converter todas as letras do parâmetro para minúsculo e depois fazer uma busca parcial pelo nome do projeto de assentamento.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('autocomplete')
  autocomplete(@Query() query: AutoCompleteSettlmentProjectDTO) {
    return this.settlementProjectCategoriesService.autocomplete(query.name);
  }
}
