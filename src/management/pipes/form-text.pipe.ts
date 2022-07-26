import { ArgumentMetadata, PipeTransform } from "@nestjs/common";
import { SubmitBatchDTO } from "../entities/dtos/submit-batch.dto";
import { BatchConfig } from "../entities/dtos/batch-config.dto";

export class FormTextPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        if(value && value.body) {
            return JSON.parse(value.body);12
        } else {
            return value;
        }
    }
}