import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
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
import { JobDetailsDTO } from "../entities/dtos/job-details.dto";
import { JobsDTO } from "../entities/dtos/jobs.dto";

@Injectable()
export class SchedulingService implements OnModuleInit {
    private readonly logger = new Logger(SchedulingService.name);

    async listRUNNING(paginationDTO: PaginationDTO) {
        return await this.entityManager.transaction(async EntityManager => {
            let [batches, count]: [Batch[], number] = await this.batchRepository.findAndCount(
                {
                    where: [
                        { status: Status.RUNNING.toString() }
                    ],
                    take: paginationDTO.take,
                    skip: paginationDTO.skip
                }
            );

            let jobsDTOs: JobsDTO[];
            jobsDTOs = await Promise.all(batches.map(async batch => {
                let [lastStartExec, lastEndExec]: [Execution, Execution] = await this.findLastExecutions(batch.id);
                return {
                    active: batch.active,
                    jobId: batch.id,
                    name: batch.name,
                    status: batch.status,
                    timing: batch.timing,
                    lastExecutionTime: new Date(Math.max.apply(null, [lastStartExec? lastStartExec.startTime: null, lastEndExec? lastEndExec.endTime: null]))
                };
            }));

            this.logger.log("Running batches listed");
            return [count, jobsDTOs];
        });
    }

    async listIDLE(paginationDTO: PaginationDTO) {
        return await this.entityManager.transaction(async EntityManager => {
            let [batches, count]: [Batch[], number] = await this.batchRepository.findAndCount(
                {
                    where: [
                        { status: Status.IDLE.toString() }
                    ],
                    take: paginationDTO.take,
                    skip: paginationDTO.skip
                }
            );

            let jobsDTOs: JobsDTO[];
            jobsDTOs = await Promise.all(batches.map(async batch => {
                let [lastStartExec, lastEndExec]: [Execution, Execution] = await this.findLastExecutions(batch.id);
                return {
                    active: batch.active,
                    jobId: batch.id,
                    name: batch.name,
                    status: batch.status,
                    timing: batch.timing,
                    lastExecutionTime: new Date(Math.max.apply(null, [lastStartExec? lastStartExec.startTime: null, lastEndExec? lastEndExec.endTime: null]))
                };
            }));

            this.logger.log("Idle batches listed");
            return [count, jobsDTOs];
        });
    }
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

    async findLastExecutions(jobId: number): Promise<[Execution, Execution]> {
        return await this.entityManager.transaction(async EntityManager => {
            let lastStartExec: Execution = await this.executionRepository.findOne({
                where: {
                    batch: {
                        id: jobId
                    }
                },
                order: {
                    startTime: "DESC",
                }
            })

            let lastEndExec: Execution = await this.executionRepository.findOne({
                where: {
                    batch: {
                        id: jobId
                    }
                },
                order: {
                    endTime: "DESC",
                }
            })

            return [lastStartExec, lastEndExec];
        })
    }

    mapExecutionToJobDetails(lastStartExecution: Execution, lastEndExec: Execution): JobDetailsDTO {
        let jobDetailsDTO: JobDetailsDTO = new JobDetailsDTO();

        if(lastStartExecution && lastEndExec) {
            jobDetailsDTO.id = lastStartExecution.batch.id;
            jobDetailsDTO.independant = lastStartExecution.batch.independant;
            jobDetailsDTO.name = lastStartExecution.batch.name;
            jobDetailsDTO.timing = lastStartExecution.batch.timing;
            jobDetailsDTO.source = lastStartExecution.batch.profile.name + ' ' + lastStartExecution.batch.profile.surname;
            jobDetailsDTO.prevBatchInput = lastStartExecution.batch.prevBatchInput;
            jobDetailsDTO.lastStartTime = lastStartExecution? lastStartExecution.startTime: null;
            jobDetailsDTO.lastFinishTime = lastEndExec? lastEndExec.endTime: null;
        }

        return jobDetailsDTO;
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

    async listCompleted(paginationDTO: PaginationDTO, batchId: number): Promise<[number, ScheduledDTO[]]> {

        return await this.entityManager.transaction(async EntityManager => {
            let [executions, count]: [Execution[], number] = await this.executionRepository.findAndCount(
                {
                    where: [
                        { 
                            status: Status.COMPLETED.toString(),
                            batch: {
                                id: batchId
                            }
                        },
                        { 
                            status: Status.FAILED.toString(),
                            batch: {
                                id: batchId
                            }
                        },
                        { 
                            status: Status.ABORTED.toString(),
                            batch: {
                                id: batchId
                            }
                        },
                    ],
                    take: paginationDTO.take,
                    skip: paginationDTO.skip
                }
            );

            let scheduledDTOs: ScheduledDTO[];
            scheduledDTOs = executions.map(execution => {
                let scheduledDTO = new ScheduledDTO();

                scheduledDTO.execId = execution.id;
                scheduledDTO.category = 'General';
                scheduledDTO.name = execution.batch.name;
                scheduledDTO.status = execution.status;
                scheduledDTO.timingCron = execution.batch.timing;

                return scheduledDTO;
            });

            this.logger.log("Completed executions listed");
            return [count, scheduledDTOs];
        });
    }

    async listScheduled(paginationDTO: PaginationDTO, batchId: number): Promise<[number, ScheduledDTO[]]> {
        return await this.entityManager.transaction(async EntityManager => {
            let [executions, count]: [Execution[], number] = await this.executionRepository.findAndCount(
                {
                    where: [
                        { 
                            status: Status.IDLE.toString(),
                            batch: {
                                id: batchId
                            } 
                        },
                        { 
                            status: Status.RUNNING.toString() ,
                            batch: {
                                id: batchId
                            }
                        },
                    ],
                    take: paginationDTO.take,
                    skip: paginationDTO.skip
                }
            );

            let scheduledDTOs: ScheduledDTO[];
            scheduledDTOs = executions.map(execution => {
                let scheduledDTO = new ScheduledDTO();

                scheduledDTO.execId = execution.id;
                scheduledDTO.category = 'General';
                scheduledDTO.name = execution.batch.name;
                scheduledDTO.status = execution.status;
                scheduledDTO.timingCron = execution.batch.timing;

                return scheduledDTO;
            });

            this.logger.log("Scheduled executions listed");
            return [count, scheduledDTOs];
        });
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