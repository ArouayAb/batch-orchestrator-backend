import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from 'src/management/entities/profiles.entity';
import { jwtConstant } from './config/constants';
import { JwtStrategy } from './config/jwt.strategy';
import { LocalStrategy } from './config/local.strategy';
import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';
import { User } from './entities/users.entity';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile]),
    PassportModule, 
    JwtModule.register({
      secret: jwtConstant.secret,
      signOptions: { 
        expiresIn: '60s'
      }
    })
  ],
  providers: [
    AuthService, 
    LocalStrategy, 
    JwtStrategy,
    UserService,
  ],
  controllers: [
    AuthController,
    UserController
  ]
})
export class AuthModule {}
