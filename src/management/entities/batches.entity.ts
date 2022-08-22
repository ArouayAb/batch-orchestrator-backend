import * as Faker from '@faker-js/faker'
import { IsUrl } from 'class-validator';
import { Factory } from "nestjs-seeder";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Status } from './enums/status.enum';
import { Execution } from './executions.entity';
import { Profile } from './profiles.entity';

@Entity()
export class Batch {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Batch, (batch) => batch.previousBatch)
    @JoinColumn()
    previousBatch: Batch;

    @ManyToOne(() => Profile, (profile) => profile.batches, { eager: true })
    profile: Profile;

    @OneToMany(() => Execution, (execution) => execution.batch)
    executions: Execution[];

    @Column({ nullable: false })
    timing: string;

    @Column({
        type: 'enum',
        enum: Status,
        default: Status.IDLE,
        nullable: false
    })
    status: string;

    @Column({ default: true })
    active: boolean;

    @Factory(faker => Faker.faker.name.firstName())
    @Column({ nullable: false })
    name: string;

    @Factory(faker => Faker.faker.lorem.paragraph())
    @Column({ nullable: false })
    description: string;

    @Factory(faker => Faker.faker.internet.url())
    @Column({ nullable: false })
    url: string;

    @Column({ nullable: false })
    independant: boolean;

    @Column({ nullable: false })
    prevBatchInput: boolean
}