import * as Faker from '@faker-js/faker'
import { Factory } from "nestjs-seeder";
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Factory(faker => Faker.faker.internet.email())
    @Column()
    email: string;

    @Factory(faker => Faker.faker.phone.number())
    @Column()
    phoneNumber: string;

    @Factory(faker => Faker.faker.internet.password())
    @Column()
    password: string;
}