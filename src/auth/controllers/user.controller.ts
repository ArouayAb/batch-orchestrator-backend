import { Body, Controller, Get, Logger, Post, UseFilters } from "@nestjs/common";
import { UserCreationDTO } from "../entities/dtos/user-creation.dto";
import { UserService } from "../services/user.service";
import { IncoherentPasswordExceptionFilter } from "./filters/incoherent-password-exception.filter";
import { QueryFailedExceptionFilter } from "./filters/typeorm-exception.filter";

@Controller('user')
export class UserController {
    private readonly logger = new Logger(UserService.name);
    
    constructor(
        private userService: UserService,
    ) {}

    @Post('create')
    @UseFilters(QueryFailedExceptionFilter, IncoherentPasswordExceptionFilter)
    async create(@Body() userCreationDTO: UserCreationDTO) {
        return await this.userService.create(userCreationDTO);
    }
}