import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { INestApplication } from '@nestjs/common';

export const swaggerConfigInit = (app: INestApplication): void => {
  const document = new DocumentBuilder()
    .setTitle('ETM-Pass')
    .setDescription('Backend of ETM-Pass website')
    .setVersion('v0.0.1')
    .addBearerAuth(SwaggerAuthConfig(), 'Authorization')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, document);
  SwaggerModule.setup('swagger', app, swaggerDocument);
};

const SwaggerAuthConfig = (): SecuritySchemeObject => {
  return {
    type: 'http',
    in: 'header',
    scheme: 'bearer',
    bearerFormat: 'JWT',
  };
};
