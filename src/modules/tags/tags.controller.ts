import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateTagDTO } from './dto/create-tag.dto';

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
    summary: 'Deletar tag',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':tag_id')
  delete(@Param('tag_id') tag_id: string) {
    return this.tagsService.softDeleteTag(tag_id);
  }
}
