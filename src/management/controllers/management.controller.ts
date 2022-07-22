import { Body, Controller, Get, Post, Req, UploadedFile, UseFilters, UseGuards, UseInterceptors, UsePipes } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request } from "express";
import { Multer } from "multer";
import { QueryFailedExceptionFilter } from "src/auth/controllers/filters/typeorm-exception.filter";
import { SubmitBatchDTO } from "../entities/dtos/submit-batch.dto";
import { FormTextPipe } from "../pipes/form-text.pipe";
import { BatchConfig } from "../entities/dtos/batch-config.dto";
import { ManagementService } from "../services/management.service";
import { FileExceptionFilter } from "./filters/file-exception.filter";


@Controller('management')
export class ManagementController {
    constructor(private managementService: ManagementService) {}

    @UseGuards(AuthGuard('jwt'))
    @Get()
    test() {
        return "hello world"
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('submitBatch')
    @UseInterceptors(FileInterceptor('file'))
    @UsePipes(FormTextPipe)
    @UseFilters(FileExceptionFilter, QueryFailedExceptionFilter)
    async submitBatch(
        @UploadedFile() file: Express.Multer.File, 
        @Body() submitBatchDTO: SubmitBatchDTO,
        @Req() request: Request
    ) {
        return await this.managementService.storeBatch(request.user, submitBatchDTO, file);
    }

}