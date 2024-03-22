import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import dbConfig from './config/db.config';
import { AuthModule } from './modules/auth/auth.module';
import { ResetPasswordTokenModule } from './modules/reset_password_token/reset_password_token.module';
import { BullModule } from '@nestjs/bull';
import { MailerModule } from '@nestjs-modules/mailer';
import { JobsModule } from './modules/jobs/jobs.module';
import { GlobalRedisModule } from './common/providers/global-redis.module';
import { BatchesModule } from './modules/batches/batches.module';
import { ClassProjectsModule } from './modules/class_projects/class_project.module';
import { TagsModule } from './modules/tags/tags.module';
import { ShipmentsModule } from './modules/shipments/shipments.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'upload/files'),
      serveRoot: '/files',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dbConfig],
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
    }),
    BullModule.forRoot({
      url: process.env.REDIS_URL,
      defaultJobOptions: {
        removeOnComplete: true,
      },
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        ignoreTLS: true,
        secure: true,
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD,
        },
      },
    }),
    UsersModule,
    AuthModule,
    ResetPasswordTokenModule,
    JobsModule,
    GlobalRedisModule,
    BatchesModule,
    ClassProjectsModule,
    TagsModule,
    ShipmentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
