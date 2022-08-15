import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { Batch } from "src/management/entities/batches.entity";
import { Status } from "src/management/entities/enums/status.enum";
import { Execution } from "src/management/entities/executions.entity";
import { EntityManager, Repository } from "typeorm";
import { Dependency } from "../entities/dependencies.entity";
import { PaginationDTO } from "../entities/dtos/pagination.dto";
import { ScheduledDTO } from "../entities/dtos/scheduled.dto";
import { Language } from "../entities/languages.entity";
import { fromNameToValue, Language as LanguageEnum } from '../entities/enums/languages.enum'
import { DependencyDTO } from "../entities/dtos/dependency.dto";

@Injectable()
export class SchedulingService implements OnModuleInit {
    constructor(        
        @InjectRepository(Execution) private executionRepository: Repository<Execution>,
        @InjectRepository(Dependency) private dependencyRepository: Repository<Dependency>,
        @InjectRepository(Language) private languageRepository: Repository<Language>,
        @InjectRepository(Batch) private batchRepository: Repository<Batch>,
        @InjectEntityManager() private entityManager: EntityManager
    ) { }
    onModuleInit() {
        this.entityManager.transaction(async EntityManager => {
            let languageJS: Language = new Language();
            languageJS.id = "JAVASCRIPT";;
            languageJS.name = "JAVASCRIPT"
    
            let languageGO: Language = new Language();
            languageGO.id = "GO";
            languageGO.name = "GO";
    
            let languagePY: Language = new Language();
            languagePY.id = "PYTHON";
            languagePY.name = "PYTHON";
    
            let languages: Language[] = [
                languageJS,
                languageGO,
                languagePY
            ]
    
            return await this.languageRepository.save(languages);
        })
    }

    async listLanguages() {
        return await this.entityManager.transaction(async EntityManager => {
            return (await this.languageRepository.find()).map(language => {
                return {
                    id: language.id,
                    name: LanguageEnum[language.name]
                }
            });
        })
    }

    async listCompleted(paginationDTO: PaginationDTO): Promise<[number, ScheduledDTO[]]> {
        try {
            return await this.entityManager.transaction(async EntityManager => {
                let [executions, count]: [Execution[], number] = await this.executionRepository.findAndCount(
                    {
                        where: [
                            { status: Status.COMPLETED.toString() },
                            { status: Status.FAILED.toString() }
                        ],
                        take: paginationDTO.take,
                        skip: paginationDTO.skip
                    }
                );

                let scheduledDTOs: ScheduledDTO[];
                scheduledDTOs = executions.map(execution => {
                    let scheduledDTO = new ScheduledDTO();

                    scheduledDTO.active = execution.active;
                    scheduledDTO.execId = execution.id;
                    scheduledDTO.category = 'General';
                    scheduledDTO.name = execution.batch.name;
                    scheduledDTO.status = execution.status;
                    scheduledDTO.timingCron = execution.batch.timing;

                    return scheduledDTO;
                });

                return [count, scheduledDTOs];
            });
        } catch(e) {
            throw e;
        }
    }

    async listScheduled(paginationDTO: PaginationDTO): Promise<[number, ScheduledDTO[]]> {
        try {
            return await this.entityManager.transaction(async EntityManager => {
                let [executions, count]: [Execution[], number] = await this.executionRepository.findAndCount(
                    {
                        where: [
                            { status: Status.IDLE.toString() },
                            { status: Status.RUNNING.toString() }
                        ],
                        take: paginationDTO.take,
                        skip: paginationDTO.skip
                    }
                );

                let scheduledDTOs: ScheduledDTO[];
                scheduledDTOs = executions.map(execution => {
                    let scheduledDTO = new ScheduledDTO();

                    scheduledDTO.active = execution.active;
                    scheduledDTO.execId = execution.id;
                    scheduledDTO.category = 'General';
                    scheduledDTO.name = execution.batch.name;
                    scheduledDTO.status = execution.status;
                    scheduledDTO.timingCron = execution.batch.timing;

                    return scheduledDTO;
                });

                return [count, scheduledDTOs];
            });
        } catch(e) {
            throw e;
        }
    }

    async listAllDependencies() {
        return await this.entityManager.transaction(async EntityManager => {
            let dependencies: Dependency[] = await this.dependencyRepository.find();

            return [
                ...new Set(dependencies.map(dependency => {
                return dependency.language.name;
            }))].map(language => {
                let depNames = dependencies.filter(dependency => {
                    return dependency.language.name === language
                }).map(currentDep => {
                    return currentDep.name;
                })

                return [language, depNames];
            })
            
        })
    }
    async listDependencies(paginationDTO: PaginationDTO): Promise<[number, DependencyDTO[]]> {
        return await this.entityManager.transaction(async EntityManager => {
            let [dependencies, count]: [Dependency[], number] = await this.dependencyRepository.findAndCount(
                {
                    take: paginationDTO.take,
                    skip: paginationDTO.skip
                });

            let dependencieDTOs: DependencyDTO[] = dependencies.map(dep => {
                return {
                    id: dep.id,
                    language: LanguageEnum[dep.language.name],
                    name: dep.name
                }
            })
            return [count, dependencieDTOs];
        });
    }

    async addDependency(dependency: Dependency) {
        await this.entityManager.transaction(async EntityManager => {
            dependency.language.id = dependency.language.name;
            let result = await this.dependencyRepository.save(dependency); 
            return result;
        });
    }

    async listAll(): Promise<ScheduledDTO[]> {
            return await this.entityManager.transaction(async EntityManager => {
                let executions: Execution[] = await this.executionRepository.find();

                let scheduledDTOs: ScheduledDTO[];
                scheduledDTOs = executions.map(execution => {
                    let scheduledDTO = new ScheduledDTO();

                    scheduledDTO.active = execution.active;
                    scheduledDTO.category = 'General';
                    scheduledDTO.name = execution.batch.name;
                    scheduledDTO.status = execution.status;
                    scheduledDTO.timingCron = execution.batch.timing;

                    return scheduledDTO;
                })

                return scheduledDTOs;
            });
    }

}