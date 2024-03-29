import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Request,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { CreateRequestResetPasswordUserDTO } from './dto/create-request-reset-password-user.dto';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { VerifyResetPasswordUserDTO } from './dto/verify-reset-password.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AutoCompleteUserDTO } from './dto/autocomplete-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import multerConfig from '../../config/multer.config';

@ApiTags('Usuários')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  create(@Body() createUserDTO: CreateUserDTO) {
    return this.userService.create(createUserDTO);
  }

  @ApiOperation({
    summary: 'Atualizar imagem de perfil.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('photo')
  @UseInterceptors(FileInterceptor('photo', multerConfig))
  async uploadPhoto(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ) {
    return this.userService.uploadPhoto(req.user.id, file, req);
  }

  @ApiOperation({
    summary: 'Remover imagem de perfil.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete('photo')
  async removePhoto(@Request() req: any) {
    return this.userService.removePhoto(req.user.id);
  }

  @ApiOperation({
    summary: 'Lista todas os usuários do sistema.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async find() {
    return this.userService.find();
  }

  @ApiOperation({
    summary: 'Retorna informações do usuário logado.',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async me(@Request() req: any) {
    return this.userService.me(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch()
  async update(@Body() updateUserDTO: UpdateUserDTO, @Request() req: any) {
    return this.userService.update(req.user.id, updateUserDTO);
  }

  @Post('/reset-password')
  async requestResetPassword(
    @Body()
    createRequestResetPasswordUserDTO: CreateRequestResetPasswordUserDTO,
    @Res() res: Response,
  ) {
    await this.userService.requestResetPassword(
      createRequestResetPasswordUserDTO,
    );
    return res.status(HttpStatus.CREATED).json({
      message: `Token de redefinição de senha enviado para ${createRequestResetPasswordUserDTO.email}! Não esqueça checar a pasta de span!`,
    });
  }

  @Post('/reset-password/:token')
  async veryfyResetPassword(
    @Param('token') token: string,
    @Body() verifyResetPasswordUserDTO: VerifyResetPasswordUserDTO,
  ) {
    return this.userService.verifyResetPassword(
      token,
      verifyResetPasswordUserDTO,
    );
  }

  @ApiOperation({
    summary: 'Autocomplete de usuários',
    description:
      'Ao receber um parâmetro name na rota, este endpoint irá converter todas as letras do parâmetro para minúsculo e depois fazer uma busca parcial pelo nome do usuário.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('autocomplete')
  async autocomplete(@Query() query: AutoCompleteUserDTO) {
    return this.userService.autocomplete(query.name);
  }
}
