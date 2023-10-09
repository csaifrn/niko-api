import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreatePermissionDTO } from './dto/create-permission.dto';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @ApiOperation({
    summary: 'Criar permissão',
    description: 'Criar permissão que define uma ação no sistema.',
  })
  @Post()
  create(
    @Body() createPermissionDTO: CreatePermissionDTO,
    @Request() req: any,
  ) {
    return this.permissionsService.create(createPermissionDTO, req.user.id);
  }
}
