import { Controller, Post, UseGuards, Req, Get, UnauthorizedException, Body } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { User } from "../entities/users.entity";
import { AuthService } from "../services/auth.service";

@Controller('auth')
export class AuthController {
    
    constructor(private authService: AuthService) {}

    @UseGuards(AuthGuard('jwt'))
    @Post()
    test(@Body() user: User) {
        return user;
    }

    @Post('login')
    async login(@Req() req) {
        return this.authService.login(req.body);
    }
}