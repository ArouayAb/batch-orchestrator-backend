import { Controller, Get } from "@nestjs/common";
import { SchedulingService } from "../services/scheduling.service";

@Controller('scheduling')
export class SchedulingController {
    constructor(private schedulingService: SchedulingService) {

    }

    @Get('list-all')
    async listAll() {
        return await this.schedulingService.listAll();
    }

}