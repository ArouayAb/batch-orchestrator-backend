import * as Faker from '@faker-js/faker'
import { Factory } from "nestjs-seeder";
import { User } from 'src/auth/entities/users.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Batch } from './batches.entity';
import { Config } from './configs.entity';

@Entity()
export class Profile {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User)
    @JoinColumn()
    user: User;

    @OneToMany(() => Batch, (batch) => batch.profile)
    batches: Batch[]

    @OneToMany(() => Config, (config) => config.profile)
    configs: Config[]

    @Factory(faker => Faker.faker.name.firstName())
    @Column()
    name: string;

    @Factory(faker => Faker.faker.name.lastName())
    @Column()
    surname: string;
}