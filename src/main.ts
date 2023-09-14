import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { formatErrors } from './utils/formatErrors.util';
import { setupDocumentation } from './common/documentation/build-swagger.document';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) =>
        new BadRequestException(formatErrors(errors)),
    }),
  );

  if (process.env.API_MODE === 'DEV') {
    setupDocumentation(app);
  }

  await app.listen(process.env.APP_PORT);
}
bootstrap();
