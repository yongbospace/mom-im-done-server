import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import {
  ENV_DB_DATABASE_KEY,
  ENV_DB_HOST_KEY,
  ENV_DB_PASSWORD_KEY,
  ENV_DB_PORT_KEY,
  ENV_DB_USERNAME_KEY,
} from './common/const/env-key.const';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeworksModule } from './homeworks/homeworks.module';
import { UsersModel } from './users/entity/users.entity';
import { HomeworksModel } from './homeworks/entity/homeworks.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres', //데이터베이스 타입
      host: process.env[ENV_DB_HOST_KEY],
      port: parseInt(process.env[ENV_DB_PORT_KEY]),
      username: process.env[ENV_DB_USERNAME_KEY],
      password: process.env[ENV_DB_PASSWORD_KEY],
      database: process.env[ENV_DB_DATABASE_KEY],
      entities: [HomeworksModel, UsersModel],
      synchronize: true, //개발: true, 프로덕션: false
    }),
    UsersModule,
    CommonModule,
    AuthModule,
    HomeworksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
