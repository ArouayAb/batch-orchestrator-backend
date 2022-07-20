import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/users.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([User])
    ]
})
export class ManagementModule {}
