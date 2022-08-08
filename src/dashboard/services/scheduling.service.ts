import { Injectable } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { Batch } from "src/management/entities/batches.entity";
import { Status } from "src/management/entities/enums/status.enum";
import { Execution } from "src/management/entities/executions.entity";
import { EntityManager, Repository } from "typeorm";
import { Dependency } from "../entities/dependencies.entity";
import { PaginationDTO } from "../entities/dtos/pagination.dto";
import { ScheduledDTO } from "../entities/dtos/scheduled.dto";

@Injectable()
export class SchedulingService {
    constructor(        
        @InjectRepository(Execution) private executionRepository: Repository<Execution>,
        @InjectRepository(Dependency) private dependencyRepository: Repository<Dependency>,
        @InjectRepository(Batch) private batchRepository: Repository<Batch>,
        @InjectEntityManager() private entityManager: EntityManager
    ) { }

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

    async listDependencies(paginationDTO: PaginationDTO): Promise<[number, Dependency[]]> {
        return await this.entityManager.transaction(async EntityManager => {
            let [dependencies, count]: [Dependency[], number] = await this.dependencyRepository.findAndCount(
                {
                    take: paginationDTO.take,
                    skip: paginationDTO.skip
                });
            return [count, dependencies];
        });
    }

    async addDependency(dependency: Dependency) {
        await this.entityManager.transaction(async EntityManager => {
            return await this.dependencyRepository.save(dependency);
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