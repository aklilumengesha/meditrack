import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:3001', 'http://localhost:3000'];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Meditrack API')
      .setDescription('Healthcare management system REST API — patients, doctors, appointments, medical records')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('auth', 'Authentication endpoints')
      .addTag('patients', 'Patient management')
      .addTag('doctors', 'Doctor management')
      .addTag('appointments', 'Appointment scheduling')
      .addTag('medical-records', 'Medical records')
      .addTag('patient-portal', 'Patient portal endpoints')
      .addTag('notifications', 'Notification system')
      .addTag('ratings', 'Doctor ratings')
      .addTag('admin', 'Admin panel endpoints')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });
  }

  await app.listen(process.env.PORT || 3000);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Application running on: http://localhost:${process.env.PORT || 3000}`);
    console.log(`Swagger docs: http://localhost:${process.env.PORT || 3000}/api/docs`);
  }
}
bootstrap();
