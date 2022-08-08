import { Body, Controller, Get, Post } from "@nestjs/common";
import { Dependency } from "../entities/dependencies.entity";
import { PaginationDTO } from "../entities/dtos/pagination.dto";
import { ScheduledDTO } from "../entities/dtos/scheduled.dto";
import { SchedulingService } from "../services/scheduling.service";

@Controller('scheduling')
export class SchedulingController {
    constructor(private schedulingService: SchedulingService) {

    }

    @Get('list-all')
    async listAll() {
        return await this.schedulingService.listAll();
    }

    @Post('list-dependencies')
    async listDependencies(@Body() paginationDTO: PaginationDTO) {
        return await this.schedulingService.listDependencies(paginationDTO);
    }

    @Post('add-dependency')
    async addDependency(@Body() dependency: Dependency) {
        return await this.schedulingService.addDependency(dependency);
    }

    @Post('list-scheduled')
    async listScheduled(@Body() paginationDTO: PaginationDTO): Promise<[number, ScheduledDTO[]]> {
        return await this.schedulingService.listScheduled(paginationDTO);
    }

    @Post('list-completed')
    async listCompleted(@Body() paginationDTO: PaginationDTO): Promise<[number, ScheduledDTO[]]> {
        return await this.schedulingService.listCompleted(paginationDTO);
    }

}