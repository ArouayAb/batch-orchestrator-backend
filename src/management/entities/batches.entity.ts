import * as Faker from '@faker-js/faker'
import { IsUrl } from 'class-validator';
import { Factory } from "nestjs-seeder";
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Config } from './configs.entity';
import { Execution } from './executions.entity';
import { Profile } from './profiles.entity';

@Entity()
export class Batch {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Profile, (profile) => profile.batches)
    profile: Profile;

    @OneToMany(() => Execution, (execution) => execution.batch)
    executions: Execution[];

    @ManyToOne(() => Config, (config) => config.batches)
    config: Config;

    @Factory(faker => Faker.faker.name.firstName())
    @Column()
    name: string;

    @Factory(faker => Faker.faker.lorem.paragraph())
    @Column()
    description: string;

    @Factory(faker => Faker.faker.internet.url())
    @IsUrl()
    @Column()
    url: string;
}