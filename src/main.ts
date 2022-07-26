import { HttpException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { QueryFailedExceptionFilter } from './auth/controllers/filters/typeorm-exception.filter';
import { FileExceptionFilter } from './management/controllers/filters/file-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const microservice = app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092']
      }, 
      consumer: {
        groupId: 'scheduler-log-consumer'
      }
    }
  });

  await app.startAllMicroservices();

  app.useGlobalPipes(new ValidationPipe())
  await app.listen(3000);
}

bootstrap();
