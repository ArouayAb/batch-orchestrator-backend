import { Controller, Post, UseGuards, Req, Get } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "../services/auth.service";

@Controller('auth')
export class AuthController {
    
    constructor(private authService: AuthService) {}

    @Get()
    test() {
        return "test"
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('login')
    async login(@Req() req) {
        return this.authService.login(req.user);
    }
}