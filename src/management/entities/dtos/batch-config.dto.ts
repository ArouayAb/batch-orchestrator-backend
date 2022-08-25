export class BatchConfig {
    language: string;
    independant: boolean;
    prevBatchInput: boolean;
    dependencyList: string[];
    cron: string;
    script: string;
    fileInfo: {
        name: string,
        desc: string
    };
}