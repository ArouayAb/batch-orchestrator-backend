import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/users.entity';
import { ManagementController } from './controllers/management.controller';
import { Batch } from './entities/batches.entity';
import { Config } from './entities/configs.entity';
import { Profile } from './entities/profiles.entity';
import { ManagementService } from './services/management.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User, 
            Profile,
            Batch,
            Config
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
