import 'dotenv/config'; // Parse and load environment variables first
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  // Enable CORS for Swagger UI, frontend dev servers (3000, 5173, 5174, etc.), and 127.0.0.1
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });

  // Set global API prefix before initializing Swagger
  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('Aruli E-Commerce API')
    .setDescription('Official API Documentation for Aruli Multi-Vendor E-Commerce Platform')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((error) => {
  Logger.error('Failed to start application:', error);
  process.exit(1);
});
