import { Module, forwardRef } from '@nestjs/common';
import { SendMailProducerService } from './send-mail-producer.service';
import { SendMailConsumerService } from './send-mail-consumer.service';
import { BullModule } from '@nestjs/bull';
import { UsersModule } from '../users/users.module';
import { ResetPasswordTokenModule } from '../reset_password_token/reset_password_token.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'send-mail-queue',
      defaultJobOptions: {
        backoff: {
          delay: 1000 * 10,
          type: 'fixed',
        },
      },
    }),
    ResetPasswordTokenModule,
    forwardRef(() => UsersModule),
  ],
  providers: [SendMailProducerService, SendMailConsumerService],
  exports: [SendMailProducerService, SendMailConsumerService],
})
export class JobsModule {}
