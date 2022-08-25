export interface BatchConfigGo {
    independant: boolean;
    prevBatchInput: boolean;    
    cron: string;
    script: string;
    jobName: string,
    jobDesc: string;
}