import * as Faker from '@faker-js/faker'
import { IsDate } from 'class-validator';
import { Factory } from "nestjs-seeder";
import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Batch } from './batches.entity';
import { Status } from './enums/status.enum';

@Entity()
export class Execution {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Batch, (batch) => batch.executions)
    batch: Batch;

    @Column({
        type: 'enum',
        enum: Status,
        default: Status.RUNNING
    })
    status: string;

    @Factory(faker => Faker.faker.date.past())
    @IsDate()
    @Column()
    startTime: Date;

    @Factory(() => (new Date()))
    @IsDate()
    @Column()
    endTime: Date;
}