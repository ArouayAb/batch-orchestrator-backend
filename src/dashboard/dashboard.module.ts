import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/users.entity';
import { Batch } from 'src/management/entities/batches.entity';
import { Config } from 'src/management/entities/configs.entity';
import { Execution } from 'src/management/entities/executions.entity';
import { Profile } from 'src/management/entities/profiles.entity';
import { SchedulingController } from './controllers/scheduling.controller';
import { SchedulingService } from './services/scheduling.service';

@Module({
    imports: [
        HttpModule,
        TypeOrmModule.forFeature([
            User, 
            Profile,
            Batch,
            Config,
            Execution
        ])
    ],
    controllers: [SchedulingController],
    providers: [
        SchedulingService
    ]
})
export class DashboardModule {}
