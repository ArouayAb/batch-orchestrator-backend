import * as Faker from '@faker-js/faker'
import { IsUrl } from 'class-validator';
import { Factory } from "nestjs-seeder";
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Batch } from './batches.entity';
import { Profile } from './profiles.entity';

@Entity()
export class Config {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Profile, (profile) => profile.configs)
    profile: Profile;

    @OneToMany(() => Batch, (batch) => batch.config)
    batches: Batch[];

    @Factory(faker => Faker.faker.name.firstName())
    @Column()
    name: string;

    @Factory(faker => Faker.faker.internet.url())
    @IsUrl()
    @Column()
    url: string;
}