import {
  Body,
  Controller,
  HttpStatus,
  Param,
  Patch,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { CreateRequestResetPasswordUserDTO } from './dto/create-request-reset-password-user.dto';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { VerifyResetPasswordUserDTO } from './dto/verify-reset-password.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Post()
  create(@Body() createUserDTO: CreateUserDTO) {
    return this.userService.create(createUserDTO);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch()
  update(@Body() updateUserDTO: UpdateUserDTO, @Request() req: any) {
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
}
