import { BatchConfig } from "src/management/entities/dtos/batch-config.dto";

export class SubmitBatchDTO {
    configInfo: {
        name: string,
        configs: BatchConfig[]
    };
}