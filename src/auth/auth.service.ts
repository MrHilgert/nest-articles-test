import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import UserEntity from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthConstants } from './constants';
import { JWTPayloadDTO } from './dto/jwt.payload.dto';
import { SignInResponseDTO } from './dto/sign-in.response.dto';
import { SignUpResponseDTO } from './dto/sign-up.response.dto';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { CreateUserDTO } from '../users/dto/create-user.dto';
import { validate } from 'class-validator';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {

    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService,
        private readonly configService: ConfigService,

    ) { }

    async signIn(
        username: string,
        password: string
    ): Promise<SignInResponseDTO> {
        const user = await this.usersService.findByUsername(username);

        const passwordValid = await bcrypt.compare(password, user.passwordHash);

        if (!passwordValid)
            throw new UnauthorizedException();

        const jwtToken = await this.generateUserToken(user);

        return new SignInResponseDTO(jwtToken);
    }

    async signUp(
        username: string,
        password: string
    ): Promise<SignUpResponseDTO> {
        const existingUser = await this.usersService.findByUsername(username);

        if (existingUser)
            throw new BadRequestException('Username already used');

        const passwordHash = await bcrypt.hash(password, AuthConstants.bcryptRounds);

        const createUserDto = plainToInstance(CreateUserDTO, {
            username,
            passwordHash
        });

        await validate(createUserDto);

        const user = await this.usersService.createUser(createUserDto);

        const jwtToken = await this.generateUserToken(user);

        return new SignUpResponseDTO(jwtToken);
    }

    private async generateUserToken(user: UserEntity): Promise<string> {
        const userPayload = this.getUserPayload(user);
        
        return this.jwtService.signAsync(instanceToPlain(userPayload), { // @nestjs/jwt not pass secret and expiresIn into JwtService from module register (???)
            secret: this.configService.get<string>('JWT_SECRET'),
            expiresIn: this.configService.get<number>('JWT_EXPIRES_IN')
        });
    }

    private getUserPayload(user: UserEntity): JWTPayloadDTO {
        return new JWTPayloadDTO(user.id, user.username);
    }

}
