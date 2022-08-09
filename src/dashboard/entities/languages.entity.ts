import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Dependency } from "./dependencies.entity";
import { Language as LanguageEnum } from "./enums/languages.enum";

@Entity()
export class Language {
    @PrimaryColumn()
    id: string;

    @Column({
        type: 'enum',
        enum: LanguageEnum,
        nullable: false
    })
    name: string;
    @OneToMany(() => Dependency, (dependency) => dependency.language)
    dependencies: Dependency[];
    
}