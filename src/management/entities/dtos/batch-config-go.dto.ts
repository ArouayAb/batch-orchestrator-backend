export interface BatchConfigGo {
    independant: boolean;
    prevBatchInput: boolean;    
    cron: string;
    script: string;
    args: string[];
    jobName: string,
    jobDesc: string;
}