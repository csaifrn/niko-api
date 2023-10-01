import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateRoleDTO } from './dto/create-role.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiOperation({
    summary: 'Criar função',
    description: 'Criar função para usuário (nível de acesso).',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createRoleDTO: CreateRoleDTO, @Request() req: any) {
    return this.rolesService.create(createRoleDTO, req.user.id);
  }
}
