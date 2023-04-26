import { Module } from '@nestjs/common';
import { UsersService } from './modules/users/users.service';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [],
  providers: [UsersService],
})
export class AppModule {}
