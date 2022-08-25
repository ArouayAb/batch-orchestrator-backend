import { Body, Controller, Get, HttpStatus, Param, Post, Req, Res, StreamableFile, UploadedFile, UploadedFiles, UseFilters, UseGuards, UseInterceptors, UsePipes } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { FilesInterceptor } from "@nestjs/platform-express";
import { Request, Response } from "express";
import { QueryFailedExceptionFilter } from "src/auth/controllers/filters/typeorm-exception.filter";
import { SubmitBatchDTO } from "../entities/dtos/submit-batch.dto";
import { FormTextPipe } from "../pipes/form-text.pipe";
import { ManagementService } from "../services/management.service";
import { FileExceptionFilter } from "./filters/file-exception.filter";
import { EventPattern } from "@nestjs/microservices";
import { Readable } from "stream";
import { User } from "src/auth/entities/users.entity";


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
        @Req() request: any,
        @Res() response: Response
    ) {
        try{
            submitBatchDTO.configInfo.configs = submitBatchDTO.configInfo.configs.map(config => {
                return {
                    independant: config.independant,
                    prevBatchInput: config.prevBatchInput,
                    cron: config.cron,
                    script: config.script,
                    args: config.args,
                    jobName: config.fileInfo.name,
                    jobDesc: config.fileInfo.desc
                }
            });

            let result = await this.managementService.schedule(files, submitBatchDTO, request.user.userId);
            response.status(HttpStatus.ACCEPTED).send();
        } catch(e) {
            if (e.errno == -4078) response.status(HttpStatus.SERVICE_UNAVAILABLE).send();
            switch (e.status) {
                case HttpStatus.INTERNAL_SERVER_ERROR:
                    response.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
                default:
                    response.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
            }
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Post("download-logs")
    async downloadLogs(@Body() logInfo: any, @Res({ passthrough: true }) res: Response): Promise<StreamableFile> {
        let response = await this.managementService.fetchLogFile(logInfo.id);
        
        res.set({
            'Content-Type': 'application/json',
            'Content-Disposition': response.headers['content-disposition'],
            'Access-Control-Expose-Headers': 'Content-Disposition'
          });
        const file2 = Readable.from(response.data);
        return new StreamableFile(file2);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('submitAfterBatch/:id')
    @UseInterceptors(FilesInterceptor('files'))
    @UsePipes(FormTextPipe)
    @UseFilters(FileExceptionFilter, QueryFailedExceptionFilter)
    async submitAfterBatch(
        @Param('id') id, 
        @UploadedFiles() files: Express.Multer.File[], 
        @Body() submitBatchDTO: SubmitBatchDTO,
        @Req() request: any,
        @Res() response: Response
    ) {
        try{
            submitBatchDTO.configInfo.configs = submitBatchDTO.configInfo.configs.map(config => {
                return {
                    independant: config.independant,
                    prevBatchInput: config.prevBatchInput,
                    cron: config.cron,
                    script: config.script,
                    args: config.args,
                    jobName: config.fileInfo.name,
                    jobDesc: config.fileInfo.desc
                }
            });
            let result = await this.managementService.scheduleAfter(id, files, submitBatchDTO, request.user.userId);
            response.status(HttpStatus.ACCEPTED).send();
        } catch(e) {
            if (e.errno == -4078) response.status(HttpStatus.SERVICE_UNAVAILABLE).send();
            switch (e.status) {
                case HttpStatus.INTERNAL_SERVER_ERROR:
                    response.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
                default:
                    response.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
            }
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('run-now/:id')
    async runNow(@Param('id') id, @Res() response) {
        try{
            let result = await this.managementService.runBatchById(id);
            response.status(HttpStatus.ACCEPTED).send();
        } catch(e) {
            if (e.errno == -4078) response.status(HttpStatus.SERVICE_UNAVAILABLE).send();
            switch (e.status) {
                case HttpStatus.INTERNAL_SERVER_ERROR:
                    response.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
                default:
                    response.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
            }
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('disable-job/:id')
    async disableJob(@Param('id') id, @Res() response) {
        try {
            await this.managementService.disableJob(id);
            response.status(HttpStatus.ACCEPTED).send();
        } catch(e) {
            if (e.errno == -4078) response.status(HttpStatus.SERVICE_UNAVAILABLE).send();
            switch (e.status) {
                case HttpStatus.INTERNAL_SERVER_ERROR:
                    response.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
                default:
                    response.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
            }
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('enable-job/:id')
    async enableJob(@Param('id') id, @Res() response) {
        try {
            await this.managementService.enableJob(id);
            response.status(HttpStatus.ACCEPTED).send();
        } catch(e) {
            if (e.errno == -4078) response.status(HttpStatus.SERVICE_UNAVAILABLE).send();
            switch (e.status) {
                case HttpStatus.INTERNAL_SERVER_ERROR:
                    response.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
                default:
                    response.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
            }
        }
    }

}