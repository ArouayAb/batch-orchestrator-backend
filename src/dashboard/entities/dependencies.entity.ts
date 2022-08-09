import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Language } from "./languages.entity";

@Entity()
export class Dependency {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Language, (language) => language.dependencies, { cascade: true, eager: true })
    language: Language;

    @Column({ nullable: false })
    name: string;
}