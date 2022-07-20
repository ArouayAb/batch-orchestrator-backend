import { Controller, Post, UseGuards, Req, Get, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "../services/auth.service";

@Controller('auth')
export class AuthController {
    
    constructor(private authService: AuthService) {}

    @UseGuards(AuthGuard('jwt'))
    @Get()
    test() {
        return "test"
    }

    @Post('login')
    async login(@Req() req) {
        return this.authService.login(req.body);
    }
}