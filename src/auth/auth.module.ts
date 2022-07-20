import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConstant } from './config/constants';
import { JwtStrategy } from './config/jwt.strategy';
import { LocalStrategy } from './config/local.strategy';
import { AuthController } from './controllers/auth.controller';
import { User } from './entities/users.entity';
import { AuthService } from './services/auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule, 
    JwtModule.register({
      secret: jwtConstant.secret,
      signOptions: { 
        expiresIn: '60s'
      }
    })
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [
    AuthController
  ]
})
export class AuthModule {}
