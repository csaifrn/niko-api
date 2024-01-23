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
import { BatchesService } from './batches.service';
import { CreateBatchDTO } from './dto/create-batch.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateBatchDTO } from './dto/update-batch.dto';
import { CreateBatchObservationDTO } from './dto/create-batch-observation.dto';
import { UpdateBatchObservationDTO } from './dto/update-batch-observation.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreateBatchAssingmentDTO } from './dto/create-batch-assingment.dto';
import { RemoveBatchAssingmentDTO } from './dto/remove-batch-assigment.dto';
import { UpdateBatchMainStatusDTO } from './dto/update-batch-main-status.dto';
import { QueryBatcheDTO } from './dto/query-batche.dto';
import { UpdateBatchSpecificStatusDTO } from './dto/update-batch-specific-status.dto';
import { AddTagDTO } from './dto/add-tag.dto';
import { RemoveTagDTO } from './dto/remove-tag.dto';
import { AddSettlementProjectCategoryDTO } from './dto/add-settlement-project-category.dto';
import { RemoveSettlementProjectCategoryDTO } from './dto/remove-settlement-project-category.dto';
import { RolesGuard } from '../auth/strategies/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { QueryBatchesStatusDTO } from './dto/query-batches-status.dto';

@ApiTags('Lotes')
@Controller('batches')
export class BatchesController {
  constructor(private readonly batchesService: BatchesService) {}

  @ApiOperation({
    summary: 'Criar lote',
    description: 'Criar lote de documentos.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createBatchDTO: CreateBatchDTO, @Request() req: any) {
    return this.batchesService.create(createBatchDTO, req.user.id);
  }

  @ApiOperation({
    summary: 'Retorna uma lista de lotes com base nos parâmetros de filtragem.',
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get()
  find(@Query() query: QueryBatcheDTO) {
    return this.batchesService.find(query);
  }

  @ApiOperation({
    summary: 'Retorna uma lista de lotes com base em intervalo de data.',
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get('list')
  list(@Query() query: QueryBatchesStatusDTO) {
    return this.batchesService.listBatchesStatus(query);
  }

  @ApiOperation({
    summary: 'Retorna informações do lote',
  })
  @ApiParam({
    name: 'batch_id',
    description: 'id do lote',
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get(':batch_id')
  findOne(@Param('batch_id') batch_id: string) {
    return this.batchesService.findOne(batch_id);
  }

  @ApiOperation({
    summary: 'Adiciona categorias de projeto de assentamento a um lote.',
  })
  @ApiParam({
    name: 'batch_id',
    description: 'ID do lote',
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Post(':batch_id/settlement-project')
  addSettlementProjectCategories(
    @Param('batch_id') batch_id: string,
    @Body() addSettlementProjectCategoryDTO: AddSettlementProjectCategoryDTO,
    @Request() req: any,
  ) {
    return this.batchesService.addSettlementProjectCategory(
      batch_id,
      req.user.id,
      addSettlementProjectCategoryDTO,
    );
  }

  @ApiOperation({
    summary: 'Gera código único de identificação do lote.',
  })
  @ApiParam({
    name: 'batch_id',
    description: 'ID do lote',
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Post(':batch_id/generate-shelf-number')
  generateShelfNumber(
    @Param('batch_id') batch_id: string,
    @Request() req: any,
  ) {
    return this.batchesService.generateShelfNumber(batch_id, req.user.id);
  }

  @ApiOperation({
    summary: 'Remove categoria projeto de assentamento do lote.',
  })
  @ApiParam({
    name: 'batch_id',
    description: 'ID do lote',
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Delete(':batch_id/settlement-project')
  removeSettlementProjectCategories(
    @Param('batch_id') batch_id: string,
    @Body()
    removeSettlementProjectCategoryDTO: RemoveSettlementProjectCategoryDTO,
    @Request() req: any,
  ) {
    return this.batchesService.removeSettlementProjectCategory(
      batch_id,
      req.user.id,
      removeSettlementProjectCategoryDTO,
    );
  }

  @ApiOperation({
    summary: 'Deleta uma lote.',
  })
  @ApiParam({
    name: 'batch_id',
    description: 'ID do lote',
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.MANAGER)
  @ApiBearerAuth()
  @Delete(':batch_id')
  remove(@Param('batch_id') batch_id: string, @Request() req: any) {
    return this.batchesService.remove(batch_id, req.user.id);
  }

  @ApiOperation({
    summary: 'Adiciona tags a um lote.',
  })
  @ApiParam({
    name: 'batch_id',
    description: 'ID do lote',
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Post(':batch_id/tags')
  addTag(
    @Param('batch_id') batch_id: string,
    @Body() addTagDTO: AddTagDTO,
    @Request() req: any,
  ) {
    return this.batchesService.addTag(batch_id, req.user.id, addTagDTO);
  }

  @ApiOperation({
    summary: 'Remover tag do lote.',
  })
  @ApiParam({
    name: 'batch_id',
    description: 'ID do lote',
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Delete(':batch_id/tags')
  removeTag(
    @Param('batch_id') batch_id: string,
    @Body() removeTagDTO: RemoveTagDTO,
    @Request() req: any,
  ) {
    return this.batchesService.removeTag(batch_id, req.user.id, removeTagDTO);
  }

  @ApiOperation({
    summary: 'Atribuir responsável pelo lote.',
  })
  @ApiParam({
    name: 'batch_id',
    description: 'ID do lote',
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.MANAGER)
  @ApiBearerAuth()
  @Post(':batch_id/assignment')
  createAssignment(
    @Param('batch_id') batch_id: string,
    @Body() createBatchAssingmentDTO: CreateBatchAssingmentDTO,
    @Request() req: any,
  ) {
    return this.batchesService.assignment(
      batch_id,
      req.user.id,
      createBatchAssingmentDTO,
    );
  }

  @ApiOperation({
    summary: 'Atribuir usuário logado como um responsável pelo lote.',
  })
  @ApiParam({
    name: 'batch_id',
    description: 'ID do lote',
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Post(':batch_id/assignment/me')
  createAssignmentMe(@Param('batch_id') batch_id: string, @Request() req: any) {
    return this.batchesService.assignmentMe(batch_id, req.user.id);
  }

  @ApiOperation({
    summary: 'Remover responsável pelo lote.',
  })
  @ApiParam({
    name: 'batch_id',
    description: 'ID do lote',
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.MANAGER)
  @ApiBearerAuth()
  @Delete(':batch_id/assignment')
  removeAssignment(
    @Param('batch_id') batch_id: string,
    @Body() removeBatchAssingmentDTO: RemoveBatchAssingmentDTO,
    @Request() req: any,
  ) {
    return this.batchesService.removeAssignment(
      batch_id,
      req.user.id,
      removeBatchAssingmentDTO,
    );
  }

  @ApiOperation({
    summary: 'Atualizar informações do lote',
    description:
      'Atualizar informações do lote. Todos os campos são opcionais.',
  })
  @ApiParam({
    name: 'batch_id',
    description: 'id do lote',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':batch_id')
  update(
    @Param('batch_id') batch_id: string,
    @Body() updateBatchDTO: UpdateBatchDTO,
  ) {
    return this.batchesService.update(batch_id, updateBatchDTO);
  }

  @ApiOperation({
    summary: 'Atualizar status principal do lote',
    description:
      'Atualizar status principal do lote. Status deve indicar um número correpondente a uma das 4 fases.',
  })
  @ApiParam({
    name: 'batch_id',
    description: 'id do lote',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':batch_id/main-status')
  updateMainBatchStatus(
    @Param('batch_id') batch_id: string,
    @Body() updateBatchMainStatusDTO: UpdateBatchMainStatusDTO,
    @Request() req: any,
  ) {
    return this.batchesService.updateMainStatus(
      batch_id,
      req.user.id,
      updateBatchMainStatusDTO,
    );
  }

  @ApiOperation({
    summary: 'Atualizar status específico do lote',
    description:
      'Atualizar status específico do lote. Status deve indicar um número correpondente a uma das 3 fases.',
  })
  @ApiParam({
    name: 'batch_id',
    description: 'id do lote',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':batch_id/specific-status')
  updateSpecificBatchStatus(
    @Param('batch_id') batch_id: string,
    @Body() updateBatchSpecificStatusDTO: UpdateBatchSpecificStatusDTO,
    @Request() req: any,
  ) {
    return this.batchesService.updateSpecificStatus(
      batch_id,
      req.user.id,
      updateBatchSpecificStatusDTO,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('observations/:batch_id')
  createBatchObsevation(
    @Param('batch_id') batch_id: string,
    @Request() req: any,
    @Body() createBatchObsevationDTO: CreateBatchObservationDTO,
  ) {
    return this.batchesService.createBatchObservation(
      batch_id,
      req.user.id,
      createBatchObsevationDTO,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('observations/:batch_observation_id')
  updateBatchObsevation(
    @Param('batch_observation_id') batch_observation_id: string,
    @Request() req: any,
    @Body() updateBatchObservationDTO: UpdateBatchObservationDTO,
  ) {
    return this.batchesService.updateBatchObservation(
      batch_observation_id,
      req.user.id,
      updateBatchObservationDTO,
    );
  }

  @ApiOperation({
    summary: 'Atualizar pendência da observação do lote',
    description:
      'Atualizar pendência da observação do lote. Ao efetuar uma requisição, este endpoint irá inverter a pendência do lote.',
  })
  @ApiParam({
    name: 'batch_observation_id',
    description: 'id da observação do lote',
  })
  @UseGuards(AuthGuard('jwt'))
  @Patch('observations/:batch_observation_id/pending')
  updateBatchObsevationPending(
    @Param('batch_observation_id') batch_observation_id: string,
    @Request() req: any,
  ) {
    return this.batchesService.updateBatchObservationPending(
      batch_observation_id,
      req.user.id,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('observations/:batch_observation_id')
  deleteBatchObsevation(
    @Param('batch_observation_id') batch_observation_id: string,
  ) {
    return this.batchesService.softDeleteBatchObservation(batch_observation_id);
  }
}
