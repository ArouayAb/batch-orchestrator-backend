import * as Faker from '@faker-js/faker'
import { IsDate } from 'class-validator';
import { Factory } from "nestjs-seeder";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Batch } from './batches.entity';
import { Status } from './enums/status.enum';

@Entity()
export class Execution {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Batch, (batch) => batch.executions, { eager:true })
    @JoinColumn()
    batch: Batch;

    @Column({
        type: 'enum',
        enum: Status,
        default: Status.RUNNING,
        nullable: false
    })
    status: string;

    @Column({ nullable: true })
    exitCode: string;

    @Factory(faker => Faker.faker.date.past())
    @Column({ nullable: true })
    startTime: Date;

    @Factory(() => (new Date()))
    @Column({ nullable: true })
    endTime: Date;

    @Column({ nullable: true })
    logFileUrl: string;

    @Column({ nullable: true })
    errLogFileUrl: string;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updatedAt: Date;
}