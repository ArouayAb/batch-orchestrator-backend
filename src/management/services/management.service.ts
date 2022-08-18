import { Injectable, Logger } from "@nestjs/common";
import { BatchConfig } from "../entities/dtos/batch-config.dto";
import * as fs from 'fs';
import { UnsupportedLanguageException } from "../exceptions/unsupported-language.exception";
import * as path from "path";
import { Batch } from "../entities/batches.entity";
import { SubmitBatchDTO } from "../entities/dtos/submit-batch.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Profile } from "../entities/profiles.entity";
import { HttpService } from "@nestjs/axios";
import { map } from "rxjs";
import { Execution } from "../entities/executions.entity";
import { Status } from "../entities/enums/status.enum";
import { ScheduledDTO } from "src/dashboard/entities/dtos/scheduled.dto";


@Injectable()
export class ManagementService {
    private logger = new Logger(ManagementService.name);
    private schedulerUrl: string = 'http://127.0.0.1:8080/schedule-batch';
    private schedulerConsecUrl: string = 'http://127.0.0.1:8080/consecutive-batches';
    private schedulerRunAfterUrl: string = 'http://127.0.0.1:8080/run-after-batch';
    private downloadLogUrl: string = 'http://127.0.0.1:8080/download/log/';
    private runBatchByIdUrl: string = 'http://127.0.0.1:8080/run-batch/'

    constructor(
        @InjectRepository(Batch) private batchRepository: Repository<Batch>,
        @InjectRepository(Execution) private executionRepository: Repository<Execution>,
        private dataSource: DataSource,
        private readonly httpService : HttpService
    ) {}

    runBatchById(id: any) {
        return new Promise((resolve, reject) => {
            this.httpService.post<any>(this.runBatchByIdUrl + id)
                .subscribe({
                    next: (response) => {
                        this.logger.log("Scheduled successfuly");
                        resolve({
                            headers: response.headers,
                            data: response.data
                        });
                    },
                    error: (err) => {
                        this.logger.error(err);
                        reject(err);
                    }
                });
        })
    }

    fetchLogFile(id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this.httpService.get<any>(this.downloadLogUrl + id)
                .subscribe({
                    next: (response) => {
                        this.logger.log("File downloaded successfuly");
                        resolve(response);
                    },
                    error: (err) => {
                        this.logger.error(err);
                        reject(err);
                    }
                });
        })
    }

    scheduleAfter(previousBatchId: number, files: Express.Multer.File[], submitBatchDTO: SubmitBatchDTO, batch: Batch = undefined) {
        return new Promise((resolve, reject) => {
            const FormData = require('form-data');
            let formData = new FormData();

            for(let i = 0; i < submitBatchDTO.configInfo.configs.length; i++) {
                submitBatchDTO.configInfo.configs[i].script = files[i].originalname;
            }
    
            
            formData.append('batch', Buffer.from(files[0].buffer), files[0].originalname);
            
            formData.append('config', Buffer.from(JSON.stringify(submitBatchDTO.configInfo.configs[0])), 'config.json');
            formData.append('batchName', submitBatchDTO.fileInfo.name);
            formData.append('batchDesc', submitBatchDTO.fileInfo.desc);       

            this.httpService.post<void>(
                this.schedulerRunAfterUrl + '/' + previousBatchId, 
            
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            ).subscribe({
                next: async (result) => {
                    this.logger.log("Scheduled successfuly")
                    // let execution = new Execution();
    
                    // execution.active = true;
                    // execution.batch = batch
    
                    // await this.executionRepository.save(execution);
                    // let scheduledDTO = new ScheduledDTO();

                    // scheduledDTO.active = execution.active;
                    // scheduledDTO.category = 'General';
                    // scheduledDTO.name = execution.batch.name;
                    // scheduledDTO.status = execution.status;
                    // scheduledDTO.timingCron = execution.batch.timing;
    
                    resolve(result);
                },
                error: async err => {
                    this.logger.error(err)
                    // let execution = new Execution();
    
                    // execution.active = false;
                    // execution.batch = batch
    
                    // await this.executionRepository.save(execution);
                    // // Test ONLY
                    // let scheduledDTO = new ScheduledDTO();

                    // scheduledDTO.active = execution.active;
                    // scheduledDTO.category = 'General';
                    // scheduledDTO.name = execution.batch.name;
                    // scheduledDTO.status = execution.status;
                    // scheduledDTO.timingCron = execution.batch.timing;
                    reject(err);
                }
            });
        })
    }
    schedule(files: Express.Multer.File[], submitBatchDTO: SubmitBatchDTO, batch: Batch = undefined) {
        return new Promise((resolve, reject) => {
            const FormData = require('form-data');
            let formData = new FormData();

            for(let i = 0; i < submitBatchDTO.configInfo.configs.length; i++) {
                submitBatchDTO.configInfo.configs[i].script = files[i].originalname;
            }
    
            for(let i = 0; i < files.length; i++) {
                formData.append('batches', Buffer.from(files[i].buffer), files[i].originalname);
            }
            formData.append('config', Buffer.from(JSON.stringify(submitBatchDTO.configInfo.configs)), 'config.json');
            formData.append('batchName', submitBatchDTO.fileInfo.name);
            formData.append('batchDesc', submitBatchDTO.fileInfo.desc);       

            this.httpService.post<void>(
                this.schedulerConsecUrl, 
            
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            ).subscribe({
                next: async (result) => {
                    this.logger.log("Scheduled successfuly")
                    // let execution = new Execution();
    
                    // execution.active = true;
                    // execution.batch = batch
    
                    // await this.executionRepository.save(execution);
                    // let scheduledDTO = new ScheduledDTO();

                    // scheduledDTO.active = execution.active;
                    // scheduledDTO.category = 'General';
                    // scheduledDTO.name = execution.batch.name;
                    // scheduledDTO.status = execution.status;
                    // scheduledDTO.timingCron = execution.batch.timing;
    
                    resolve(result);
                },
                error: async err => {
                    this.logger.error(err)
                    // let execution = new Execution();
    
                    // execution.active = false;
                    // execution.batch = batch
    
                    // await this.executionRepository.save(execution);
                    // // Test ONLY
                    // let scheduledDTO = new ScheduledDTO();

                    // scheduledDTO.active = execution.active;
                    // scheduledDTO.category = 'General';
                    // scheduledDTO.name = execution.batch.name;
                    // scheduledDTO.status = execution.status;
                    // scheduledDTO.timingCron = execution.batch.timing;
                    reject(err);
                }
            });
        })
        
    }

    // private makeFiles(config: BatchConfig, file: Express.Multer.File): [string, string] {
    //     try {
    //         let currentDate = new Date().toISOString().slice(0, 23).replace('T', '_').replace(':', '-').replace(':', '-').replace('.', '_');
            
    //         let configPath = path.join('src', 'management', 'public', 'configs', 'config_' + currentDate + '.json');
    //         fs.writeFileSync(
    //             configPath,
    //             config.toString()
    //             ); 

    //         let fileExt: string;
    //         switch (config.language){
    //             case 'PYTHON':
    //                 fileExt = '.py';
    //                 break;
    //             case 'JAVASCRIPT':
    //                 fileExt = '.js';
    //                 break;
    //             case 'GO':
    //                 fileExt = '.go';
    //                 break;
    //             default:
    //                 throw new UnsupportedLanguageException(`Language ${config.language} unsupported`);
    //         }

    //         let scriptPath = path.join('src', 'management', 'public', 'scripts', 'script_' + currentDate + fileExt);
    //         fs.writeFileSync(scriptPath, file.buffer);
    //         this.logger.log(`Config file saved at ${configPath} and Script file saved at ${scriptPath}`)
    //         return [configPath, scriptPath];
    //     } catch(error) {
    //         throw error;
    //     }
    // }

    // async storeBatch(user: any, submitBatchDTO: SubmitBatchDTO, files: Express.Multer.File[]): Promise<Batch> {
    //     let batches: Batch[] = [];
    //     for(let i = 0; i < files.length; i++) {
    //         let [configPath, scriptPath] = this.makeFiles(submitBatchDTO.configInfo.configs[i], files[i]);

    //         let batch = new Batch();
    //         let profile = new Profile();
    //         config.name = submitBatchDTO.configInfo.name;
    //         config.profile = profile;
    //         config.profile.id = user.userId;
    //         config.url = configPath;
    
    //         batch.name = submitBatchDTO.fileInfo.name;
    //         batch.timing = submitBatchDTO.configInfo.configs[i].cron;
    //         batch.description = submitBatchDTO.fileInfo.desc;
    //         batch.url = scriptPath;
    //         batch.profile = profile;
    //         batch.profile.id = user.userId;
    //         batch.config = config;
    
    //         batches[i] = await this.persistBatch(config, batch);
    //     }
    //     return batches[0];
    // }

    // private async persistBatch(config: Config, script: Batch): Promise<Batch> {
    //     const queryRunner = this.dataSource.createQueryRunner();
    //     await queryRunner.connect();
    //     await queryRunner.startTransaction();

    //     try {
    //         await this.configRepository.save(config);
    //         return await this.batchRepository.save(script);
            
    //     } catch(error) {
    //         await queryRunner.rollbackTransaction();
    //         throw error;
    //     } finally {
    //         queryRunner.release();
    //     }
    // }
}