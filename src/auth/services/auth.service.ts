import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../entities/users.entity";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepository : Repository<User>,
        private jwtService : JwtService
    ) {}

    async validateUser(username : string, password: string) : Promise<any> {
        const user = await this.userRepository.findOne({
            where: {
                email: username
            }
        });

        if(user && user.password === password) {
            const {password, ...result} = user;
            return result;
        } 

        return null;
    }

    async login(user: any) {
        const userFound = await this.validateUser(user.email, user.password);
        if (userFound === null) throw new UnauthorizedException();

        const payload = { username: userFound.email, sub: userFound.id };

        return {
          access_token: this.jwtService.sign(payload),
        };
      }

}