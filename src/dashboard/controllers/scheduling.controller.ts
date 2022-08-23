import { Body, Controller, Get, Param, Post, UseFilters, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
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

    @UseGuards(AuthGuard('jwt'))
    @Get('list-all')
    @UseFilters(QueryFailedExceptionFilter)
    async listAll() {
        return await this.schedulingService.listAll();
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('list-languages')
    @UseFilters(QueryFailedExceptionFilter)
    async listLanguages() {
        return await this.schedulingService.listLanguages();
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('list-dependencies')
    @UseFilters(QueryFailedExceptionFilter)
    async listDependencies(@Body() paginationDTO: PaginationDTO) {
        return await this.schedulingService.listDependencies(paginationDTO);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('list-all-dependencies')
    @UseFilters(QueryFailedExceptionFilter)
    async listAllDependencies() {
        return await this.schedulingService.listAllDependencies();
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('add-dependency')
    @UseFilters(QueryFailedExceptionFilter)
    async addDependency(@Body() dependency: Dependency) {
        return await this.schedulingService.addDependency(dependency);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('list-scheduled/:id')
    @UseFilters(QueryFailedExceptionFilter)
    async listScheduled(@Param('id') batchId: number, @Body() paginationDTO: PaginationDTO): Promise<[number, ScheduledDTO[]]> {
        return await this.schedulingService.listScheduled(paginationDTO, batchId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('list-completed/:id')
    @UseFilters(QueryFailedExceptionFilter)
    async listCompleted(@Param('id') batchId: number, @Body() paginationDTO: PaginationDTO): Promise<[number, ScheduledDTO[]]> {
        return await this.schedulingService.listCompleted(paginationDTO, batchId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('list-idle')
    @UseFilters(QueryFailedExceptionFilter)
    async listIDLE(@Body() paginationDTO: PaginationDTO) {
        return await this.schedulingService.listIDLE(paginationDTO);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('list-running')
    @UseFilters(QueryFailedExceptionFilter)
    async listRUNNING(@Body() paginationDTO: PaginationDTO) {
        return await this.schedulingService.listRUNNING(paginationDTO);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('job-details/:id')
    @UseFilters(QueryFailedExceptionFilter)
    async getJobDetails(@Param('id') id): Promise<JobDetailsDTO> {
        let [lastStartExec, lastEndExec] = await this.schedulingService.findLastExecutions(id);
        return this.schedulingService.mapExecutionToJobDetails(lastStartExec, lastEndExec);
    }

}