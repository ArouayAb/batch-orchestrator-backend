export class JobDetailsDTO {
    id: number;
    name: string;
    independant: boolean;
    prevBatchInput: boolean;
    timing: string;
    source: string;
    lastStartTime: Date;
    lastFinishTime: Date;

}