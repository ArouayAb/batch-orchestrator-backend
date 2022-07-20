import * as Faker from '@faker-js/faker'
import { Factory } from "nestjs-seeder";
import { IsEmail, IsNotEmpty, IsNumber, IsPhoneNumber } from 'class-validator';
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Factory(faker => Faker.faker.internet.email())
    @IsEmail()
    @Column()
    email: string;

    @Factory(faker => Faker.faker.phone.number())
    @IsPhoneNumber("MA")
    @Column()
    phoneNumber: string;

    @Factory(faker => Faker.faker.internet.password())
    @IsNotEmpty()
    @Column()
    password: string;
}