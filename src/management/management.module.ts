import { HttpModule } from '@nestjs/axios';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/users.entity';
import { ManagementController } from './controllers/management.controller';
import { Batch } from './entities/batches.entity';
import { Execution } from './entities/executions.entity';
import { Profile } from './entities/profiles.entity';
import { ManagementService } from './services/management.service';

@Module({
    imports: [
        HttpModule,
        TypeOrmModule.forFeature([
            User, 
            Profile,
            Batch,
            Execution
        ])
    ],
    providers: [
        ManagementService
    ],
    controllers: [
        ManagementController
    ]
})
export class ManagementModule {

}
