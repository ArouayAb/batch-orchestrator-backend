import { Injectable } from "@nestjs/common";
import { BatchConfig } from "../entities/dtos/batch-config.dto";
import * as fs from 'fs';
import { UnsupportedLanguageException } from "../exceptions/unsupported-language.exception";
import * as path from "path";
import { Config } from "../entities/configs.entity";
import { Batch } from "../entities/batches.entity";
import { SubmitBatchDTO } from "../entities/dtos/submit-batch.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Profile } from "../entities/profiles.entity";


@Injectable()
export class ManagementService {
    constructor(
        @InjectRepository(Batch) private batchRepository: Repository<Batch>,
        @InjectRepository(Config) private configRepository: Repository<Config>,
        private dataSource: DataSource
    ) {}

    private makeFiles(config: BatchConfig, file: Express.Multer.File): [string, string] {
        try {
            let currentDate = new Date().toISOString().slice(0, 23).replace('T', '_').replace(':', '-').replace(':', '-').replace('.', '_');
            
            let configPath = path.join('src', 'management', 'public', 'configs', 'config_' + currentDate + '.json');
            fs.writeFileSync(
                configPath,
                config.toString()
                );
            console.log("JSON saved");  

            let fileExt: string;
            switch (config.language){
                case 'PYTHON':
                    fileExt = '.py';
                    break;
                case 'JAVASCRIPT':
                    fileExt = '.js';
                    break;
                case 'GO':
                    fileExt = '.go';
                    break;
                default:
                    throw new UnsupportedLanguageException(`Language ${config.language} unsupported`);
            }

            let scriptPath = path.join('src', 'management', 'public', 'scripts', 'script_' + currentDate + fileExt);
            fs.writeFileSync(scriptPath, file.buffer);

            return [configPath, scriptPath];
        } catch(error) {
            throw error;
        }
    }

    async storeBatch(user: any, submitBatchDTO: SubmitBatchDTO, file: Express.Multer.File) : Promise<Batch> {
        let [configPath, scriptPath] = this.makeFiles(submitBatchDTO.configInfo.config, file);

        let batch = new Batch();
        let config = new Config();
        let profile = new Profile();
        
        config.name = submitBatchDTO.configInfo.name;
        config.profile = profile;
        config.profile.id = user.userId;
        config.url = configPath;

        batch.name = submitBatchDTO.fileInfo.name;
        batch.description = submitBatchDTO.fileInfo.desc;
        batch.url = scriptPath;
        batch.profile = profile;
        batch.profile.id = user.userId;
        batch.config = config;

        return await this.persistBatch(config, batch);
    }

    private async persistBatch(config: Config, script: Batch): Promise<Batch> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await this.configRepository.save(config);
            return await this.batchRepository.save(script);
            
        } catch(error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            queryRunner.release();
        }
    }
}