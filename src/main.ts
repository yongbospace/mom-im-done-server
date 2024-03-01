import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      // req에 값이 없을때 dto의 기본값 적용
      transform: true,
      // Query 타입 자동변환: string => number
      transformOptions: { enableImplicitConversion: true },
      // Decorator가 적용되지 않은 모든 프로퍼티를 삭제 (ex)@안된 쿼리삭제
      whitelist: true,
      // whitelist에 따라 error 발생 시키기
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Mom, Im Done')
    .setDescription('Mom, Im Done API description')
    .setVersion('1.0')
    .addTag('homework', 'famiy')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
