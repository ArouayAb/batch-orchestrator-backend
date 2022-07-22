import { BatchConfig } from "src/management/entities/dtos/batch-config.dto";

export class SubmitBatchDTO {
    configInfo: {
        name: string,
        config: BatchConfig
    };
    fileInfo: {
        name: string,
        desc: string
    };
}