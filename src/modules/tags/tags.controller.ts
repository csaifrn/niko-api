import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateTagDTO } from './dto/create-tag.dto';
import { UpdateTagDTO } from './dto/update-tag.dto';
@ApiTags('Tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @ApiOperation({
    summary: 'Retorna uma lista de tags.',
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get()
  find() {
    return this.tagsService.find();
  }

  @ApiOperation({
    summary: 'Criar tag',
    description: 'Criar tag para ser atrelada ao lote.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createTagDTO: CreateTagDTO) {
    return this.tagsService.create(createTagDTO);
  }

  @ApiOperation({
    summary: 'Editar tag',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':tag_id')
  update(@Param('tag_id') tag_id: string, @Body() updateTagDTO: UpdateTagDTO) {
    return this.tagsService.update(tag_id, updateTagDTO);
  }

  @ApiOperation({
    summary: 'Deletar tag',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':tag_id')
  delete(@Param('tag_id') tag_id: string) {
    return this.tagsService.softDeleteTag(tag_id);
  }
}
