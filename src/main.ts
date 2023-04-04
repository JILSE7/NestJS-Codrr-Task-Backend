import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as morgan from 'morgan';
import { CORS_OPTIONS } from './constans/cors';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(morgan('dev'));

  app.useGlobalPipes(
    new ValidationPipe({
      // Enable automatic validation
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

  const configService = app.get(ConfigService);

  app.enableCors(CORS_OPTIONS);

  app.setGlobalPrefix('api'); // Prefix all routes with /api

  const config = new DocumentBuilder()
    .setTitle('NestJS Task API Test')
    .setDescription('The Task API')
    .setVersion('1.0')
    // .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(configService.get('PORT') ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();

/* const getNewsMexico = async () => {
  try {
    return await fetch('https://www.mileno.com.mx/rss/mexico.xml');
  } catch (error) {
    console.log(error);
  }
};

const getNewsWorld = async () => {
  try {
    return await fetch('https://www.mileno.com.mx/rss/mundo.xml');
  } catch (error) {
    console.log(error);
  }
};

const newsServices = {
  getNewsMexico,
  getNewsWorld,
};

const onClick = async () => {
  const newsMexico = await newsServices.getNewsMexico();
  const newsWorld = await newsServices.getNewsWorld();
}; */
