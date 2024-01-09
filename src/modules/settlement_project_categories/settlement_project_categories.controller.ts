import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
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
import { UpdateSettlementProjectCategoryDTO } from './dto/update-settlement-project-category.dto';

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
    summary: 'Atualiza as informações de um lote',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':batch_id')
  update(
    @Body()
    updateSettlementProjectCategoryDTO: UpdateSettlementProjectCategoryDTO,
    @Param('batch_id') batch_id: string,
  ) {
    return this.settlementProjectCategoriesService.update(
      batch_id,
      updateSettlementProjectCategoryDTO,
    );
  }

  @ApiOperation({
    summary: 'Lista todas as catergorias de projeto de assentamento',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get()
  find() {
    return this.settlementProjectCategoriesService.find();
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

  @ApiOperation({
    summary: 'Deleta um projeto de assentamento',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':settlement_project_category_id')
  remove(
    @Param('settlement_project_category_id')
    settlement_project_category_id: string,
  ) {
    return this.settlementProjectCategoriesService.remove(
      settlement_project_category_id,
    );
  }
}
