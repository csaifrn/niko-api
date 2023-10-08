import { Module, forwardRef } from '@nestjs/common';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JobsModule } from '../jobs/jobs.module';
import { ResetPasswordTokenModule } from '../reset_password_token/reset_password_token.module';
import { Role } from '../roles/entities/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    forwardRef(() => JobsModule),
    ResetPasswordTokenModule,
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
