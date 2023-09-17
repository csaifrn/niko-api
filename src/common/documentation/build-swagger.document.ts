import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export const setupDocumentation = (app) => {
  const config = new DocumentBuilder()
    .setTitle('Niko API')
    .setDescription('Niko API endpoints documentation.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('documentation', app, document);
};
