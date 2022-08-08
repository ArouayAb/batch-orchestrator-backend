import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Language } from "./enums/languages.enum";

@Entity()
export class Dependency {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: Language,
        nullable: false
    })
    language: string;

    @Column({ nullable: false })
    name: string;
}