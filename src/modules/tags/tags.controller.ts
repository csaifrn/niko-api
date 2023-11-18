import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { TagsService } from './tags.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateTagDTO } from './dto/create-tag.dto';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @ApiOperation({
    summary: 'Criar lote',
    description: 'Criar lote de documentos.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createTagDTO: CreateTagDTO) {
    return this.tagsService.create(createTagDTO);
  }
}
