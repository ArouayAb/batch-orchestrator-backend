export interface JobsDTO {
    active: boolean;
    jobId: number;
    name: string;
    status: string;
    timing: string;
    lastExecutionTime: Date;
}