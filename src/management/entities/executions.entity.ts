import * as Faker from '@faker-js/faker'
import { Factory } from "nestjs-seeder";
import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Batch } from './batches.entity';

@Entity()
export class Execution {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Batch, (batch) => batch.executions)
    batch: Batch;

    @Column()
    status: string; //Enum

    @Factory(faker => Faker.faker.date.past())
    @Column()
    startTime: Date;

    @Factory(() => (new Date()))
    @Column()
    endTime: Date;
}