import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';

@Module({
    imports: [JwtModule.register({}), ConfigModule, UsersModule],
    providers: [AuthService, JwtService, UsersService, AuthGuard],
    controllers: [AuthController],
    exports: [JwtService, AuthService, AuthGuard]
})
export class AuthModule { }
