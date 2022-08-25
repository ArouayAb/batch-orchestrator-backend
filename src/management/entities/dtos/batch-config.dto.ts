export class BatchConfig {
    independant: boolean;
    prevBatchInput: boolean;
    cron: string;
    script: string;
    args: string[];
    fileInfo: {
        name: string,
        desc: string
    };
}