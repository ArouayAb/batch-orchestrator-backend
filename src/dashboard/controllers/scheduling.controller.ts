import { Body, Controller, Get, Param, Post, UseFilters } from "@nestjs/common";
import { QueryFailedExceptionFilter } from "src/auth/controllers/filters/typeorm-exception.filter";
import { Dependency } from "../entities/dependencies.entity";
import { JobDetailsDTO } from "../entities/dtos/job-details.dto";
import { PaginationDTO } from "../entities/dtos/pagination.dto";
import { ScheduledDTO } from "../entities/dtos/scheduled.dto";
import { SchedulingService } from "../services/scheduling.service";

@Controller('scheduling')
export class SchedulingController {
    constructor(private schedulingService: SchedulingService) {

    }

    @Get('list-all')
    @UseFilters(QueryFailedExceptionFilter)
    async listAll() {
        return await this.schedulingService.listAll();
    }

    @Get('list-languages')
    @UseFilters(QueryFailedExceptionFilter)
    async listLanguages() {
        return await this.schedulingService.listLanguages();
    }

    @Post('list-dependencies')
    @UseFilters(QueryFailedExceptionFilter)
    async listDependencies(@Body() paginationDTO: PaginationDTO) {
        return await this.schedulingService.listDependencies(paginationDTO);
    }

    @Get('list-all-dependencies')
    @UseFilters(QueryFailedExceptionFilter)
    async listAllDependencies() {
        return await this.schedulingService.listAllDependencies();
    }

    @Post('add-dependency')
    @UseFilters(QueryFailedExceptionFilter)
    async addDependency(@Body() dependency: Dependency) {
        return await this.schedulingService.addDependency(dependency);
    }

    @Post('list-scheduled/:id')
    @UseFilters(QueryFailedExceptionFilter)
    async listScheduled(@Param('id') batchId: number, @Body() paginationDTO: PaginationDTO): Promise<[number, ScheduledDTO[]]> {
        return await this.schedulingService.listScheduled(paginationDTO, batchId);
    }

    @Post('list-completed/:id')
    @UseFilters(QueryFailedExceptionFilter)
    async listCompleted(@Param('id') batchId: number, @Body() paginationDTO: PaginationDTO): Promise<[number, ScheduledDTO[]]> {
        return await this.schedulingService.listCompleted(paginationDTO, batchId);
    }

    @Post('list-idle')
    @UseFilters(QueryFailedExceptionFilter)
    async listIDLE(@Body() paginationDTO: PaginationDTO) {
        return await this.schedulingService.listIDLE(paginationDTO);
    }

    @Post('list-running')
    @UseFilters(QueryFailedExceptionFilter)
    async listRUNNING(@Body() paginationDTO: PaginationDTO) {
        return await this.schedulingService.listRUNNING(paginationDTO);
    }

    @Get('job-details/:id')
    @UseFilters(QueryFailedExceptionFilter)
    async getJobDetails(@Param('id') id): Promise<JobDetailsDTO> {
        let [lastStartExec, lastEndExec] = await this.schedulingService.findLastExecutions(id);
        return this.schedulingService.mapExecutionToJobDetails(lastStartExec, lastEndExec);
    }

}