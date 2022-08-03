import { Body, Controller, Get, Post } from "@nestjs/common";
import { PaginationDTO } from "../dtos/pagination.dto";
import { ScheduledDTO } from "../dtos/scheduled.dto";
import { SchedulingService } from "../services/scheduling.service";

@Controller('scheduling')
export class SchedulingController {
    constructor(private schedulingService: SchedulingService) {

    }

    @Get('list-all')
    async listAll() {
        return await this.schedulingService.listAll();
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