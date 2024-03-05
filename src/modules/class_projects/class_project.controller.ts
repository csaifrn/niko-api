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
import { ClassProjectService } from './class_project.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateClassProjectDTO } from './dto/create-class-project.dto';
import { AutocompleteClassProjectDTO } from './dto/autocomplete-class-project.dto';
import { UpdateClassProjectDTO } from './dto/update-class-project.dto';

@ApiTags('Categorias de projetos de assentamentos')
@Controller('class-projects')
export class ClassProjectsController {
  constructor(private readonly classProjectService: ClassProjectService) {}

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
    createClassProjectDTO: CreateClassProjectDTO,
    @Request() req: any,
  ) {
    return this.classProjectService.create(createClassProjectDTO, req.user.id);
  }

  @ApiOperation({
    summary: 'Atualiza as informações de um lote',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':batch_id')
  update(
    @Body()
    updateClassProjectDTO: UpdateClassProjectDTO,
    @Param('batch_id') batch_id: string,
  ) {
    return this.classProjectService.update(batch_id, updateClassProjectDTO);
  }

  @ApiOperation({
    summary: 'Lista todas as catergorias de projeto de assentamento',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get()
  find() {
    return this.classProjectService.find();
  }

  @ApiOperation({
    summary: 'Autocomplete de projetos de assentamento',
    description:
      'Ao receber um parâmetro name na rota, este endpoint irá converter todas as letras do parâmetro para minúsculo e depois fazer uma busca parcial pelo nome do projeto de assentamento.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('autocomplete')
  autocomplete(@Query() query: AutocompleteClassProjectDTO) {
    return this.classProjectService.autocomplete(query.name);
  }

  @ApiOperation({
    summary: 'Deleta um projeto de assentamento',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':class_project_id')
  remove(
    @Param('class_project_id')
    class_project_id: string,
  ) {
    return this.classProjectService.remove(class_project_id);
  }
}
