import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ManagementModule } from './management/management.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './auth/entities/users.entity';
import { Profile } from './management/entities/profiles.entity';
import { Batch } from './management/entities/batches.entity';
import { Execution } from './management/entities/executions.entity';
import { Config } from './management/entities/configs.entity';
import { Dependency } from './dashboard/entities/dependencies.entity';
import { Language } from './dashboard/entities/languages.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule, 
    ManagementModule, 
    DashboardModule,
    TypeOrmModule.forRoot({
      type: process.env.DATABASE_TYPE as 'mysql',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [
        User,
        Profile,
        Batch,
        Execution,
        Config,
        Dependency,
        Language
      ],
      synchronize: true,
      dropSchema: true
    }),
  ],
  exports: [
    TypeOrmModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
