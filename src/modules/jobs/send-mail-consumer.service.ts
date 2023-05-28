import { MailerService } from '@nestjs-modules/mailer';
import { OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ResetPasswordTokenService } from '../reset_password_token/reset_password_token.service';
import * as pug from 'pug';
import * as path from 'path';

type JobEmailTokenDataProps = {
  user_id: string;
  email: string;
  subject: string;
  endpoint: string;
  valid_time: string;
  type: 'VERIFY_EMAIL' | 'PASSWORD';
};

type JobEmailDataProps = {
  email: string;
  subject: string;
  text: string;
};

@Processor('send-mail-queue')
export class SendMailConsumerService {
  constructor(
    private readonly mailService: MailerService,
    private readonly resetPasswordTokenService: ResetPasswordTokenService,
  ) {}

  @Process('send-mail-token')
  async sendMailTokenJob(job: Job<JobEmailTokenDataProps>) {
    const { user_id, email, subject, endpoint, valid_time, type } = job.data;

    const { token } = await this.resetPasswordTokenService.create(user_id);

    const textKeyProporse =
      type === 'VERIFY_EMAIL' ? 'verifique seu email' : 'recupere sua senha';

    try {
      const templatePath = path.join(__dirname, 'templates', 'send-token.pug');

      const html = pug.renderFile(templatePath, {
        title: subject,
        textKeyProporse,
        link: process.env.DNS + endpoint + '/' + token,
        valid_time,
      });

      await this.mailService.sendMail({
        to: email,
        from: 'Suport Niko',
        subject: subject,
        html,
      });
    } catch (err) {
      console.error('ERROR on sending mail: ', err);
    }
  }

  @Process('send-mail')
  async sendMailJob(job: Job<JobEmailDataProps>) {
    const { email, subject, text } = job.data;

    try {
      const templatePath = path.join(
        __dirname,
        'templates',
        'password-redifined.pug',
      );
      const html = pug.renderFile(templatePath, {
        title: subject,
        text,
      });

      await this.mailService.sendMail({
        to: email,
        from: 'Suport Niko',
        subject: subject,
        html,
      });
    } catch (err) {
      console.error('ERROR on sending mail: ', err);
    }
  }

  @OnQueueFailed()
  async onQueueFailed(job: Job, err: Error) {
    if (job.attemptsMade < 3) {
      return await job.retry();
    }

    await job.moveToFailed({ message: err.message });
  }
}
