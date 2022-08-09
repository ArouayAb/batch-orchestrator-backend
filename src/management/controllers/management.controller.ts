import { Body, Controller, Get, HttpStatus, Post, Req, Res, StreamableFile, UploadedFile, UploadedFiles, UseFilters, UseGuards, UseInterceptors, UsePipes } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { Request, Response } from "express";
import { Multer } from "multer";
import { QueryFailedExceptionFilter } from "src/auth/controllers/filters/typeorm-exception.filter";
import { SubmitBatchDTO } from "../entities/dtos/submit-batch.dto";
import { FormTextPipe } from "../pipes/form-text.pipe";
import { BatchConfig } from "../entities/dtos/batch-config.dto";
import { ManagementService } from "../services/management.service";
import { FileExceptionFilter } from "./filters/file-exception.filter";
import { EventPattern } from "@nestjs/microservices";
import { Blob } from 'buffer';
import { createReadStream } from "fs";
import { join } from "path";


@Controller('management')
export class ManagementController {
    constructor(private managementService: ManagementService) {}

    @UseGuards(AuthGuard('jwt'))
    @Get()
    test() {
        return "hello world"
    }

    @EventPattern('test')
    kafkaTest(data: any) {
        console.log(data);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('submitBatch')
    @UseInterceptors(FilesInterceptor('files'))
    @UsePipes(FormTextPipe)
    @UseFilters(FileExceptionFilter, QueryFailedExceptionFilter)
    async submitBatch(
        @UploadedFiles() files: Express.Multer.File[], 
        @Body() submitBatchDTO: SubmitBatchDTO,
        @Req() request: Request,
        @Res() response: Response
    ) {
        // let batches = await this.managementService.storeBatch(request.user, submitBatchDTO, files);
        try{
            let scheduledDTO = await this.managementService.schedule(files, submitBatchDTO.configInfo.configs);
            response.status(HttpStatus.ACCEPTED).json(scheduledDTO);
        } catch(e) {
            response.status(HttpStatus.ACCEPTED).json(e);
        }
    }

    @Post("download-logs")
    downloadLogs(@Body() id: number, @Res({ passthrough: true }) res: Response): StreamableFile {
        res.set({
            'Content-Type': 'application/json',
            'Content-Disposition': 'attachment; filename="package.json"',
            'Access-Control-Expose-Headers': 'Content-Disposition'
          });
        const file = createReadStream(join(process.cwd(), 'package.json'));
        return new StreamableFile(file);
    }

}