import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  create(@Body() createUserDTO: CreateUserDTO) {
    return this.userService.create(createUserDTO);
  }

  @Patch(':user_id')
  update(
    @Param('user_id') user_id: string,
    @Body() updateUserDTO: UpdateUserDTO,
  ) {
    return this.userService.update(user_id, updateUserDTO);
  }
}
