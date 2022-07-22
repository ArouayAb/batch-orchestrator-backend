import { Body, Controller, Get, Logger, Post, UseFilters } from "@nestjs/common";
import { UserCreationDTO } from "../entities/dtos/user-creation.dto";
import { UserService } from "../services/user.service";
import { QueryFailedExceptionFilter } from "./filters/typeorm-exception.filter";

@Controller('user')
export class UserController {
    private readonly logger = new Logger(UserService.name);
    
    constructor(
        private userService: UserService,
    ) {}

    @Post('create')
    @UseFilters(QueryFailedExceptionFilter)
    async create(@Body() userCreationDTO: UserCreationDTO) {
        return await this.userService.create(userCreationDTO);
    }
}