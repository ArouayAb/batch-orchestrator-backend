import { BatchConfig } from "src/management/entities/dtos/batch-config.dto";
import { BatchConfigGo } from "./batch-config-go.dto";

export class SubmitBatchDTO {
    configInfo: {
        name: string,
        configs: BatchConfig[] | BatchConfigGo[]
    };
}