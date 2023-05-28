import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { ResetPasswordToken } from './entities/reset_password_token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindTokenReponse } from './interfaces/find-token-response.interface';

@Injectable()
export class ResetPasswordTokenService {
  constructor(
    @InjectRepository(ResetPasswordToken)
    private readonly resetPasswordTokenRepository: Repository<ResetPasswordToken>,
  ) {}

  async findOne(hash: string): Promise<FindTokenReponse | null> {
    const token = await this.resetPasswordTokenRepository.findOne({
      where: {
        token: hash,
      },
      select: ['id', 'expires_at', 'user_id'],
    });

    return token;
  }

  async create(user_id: string) {
    const hash = uuidv4();

    const expires_at_10_minutes = Date.now() + 10 * 60 * 1000;

    const reset_password_token = this.resetPasswordTokenRepository.create({
      user_id,
      token: hash,
      expires_at: expires_at_10_minutes,
    });

    const saved_reset_password_token =
      await this.resetPasswordTokenRepository.save(reset_password_token);

    return saved_reset_password_token;
  }

  async delete(token_id: string) {
    await this.resetPasswordTokenRepository.delete(token_id);
  }
}
