import { Module } from '@nestjs/common';
import { ResetPasswordTokenService } from './reset_password_token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResetPasswordToken } from './entities/reset_password_token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ResetPasswordToken])],
  controllers: [],
  providers: [ResetPasswordTokenService],
  exports: [ResetPasswordTokenService],
})
export class ResetPasswordTokenModule {}
