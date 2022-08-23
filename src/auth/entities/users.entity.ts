import * as Faker from '@faker-js/faker'
import { Factory } from "nestjs-seeder";
import { IsEmail, IsNotEmpty, IsNumber, IsPhoneNumber } from 'class-validator';
import { BeforeInsert, Column, Entity, PrimaryColumn, PrimaryGeneratedColumn, Unique } from "typeorm";
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Factory(faker => Faker.faker.internet.email())
    @Column({ unique: true, nullable: false })
    email: string;

    @Factory(faker => Faker.faker.phone.number())
    @Column({ unique: true, nullable: false })
    phoneNumber: string;

    @Factory(faker => Faker.faker.internet.password())
    @Column({ nullable: false })
    password: string;

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, Number(process.env.HASH_SALT));
    }
}