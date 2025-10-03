import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { SignInResponseDTO } from './dto/sign-in.response.dto';
import { SignInRequestDTO } from './dto/sign-in.request.dto';
import { AuthService } from './auth.service';
import { SignUpRequestDTO } from './dto/sign-up.request.dto';
import { SignUpResponseDTO } from './dto/sign-up.response.dto';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ) { }

    @ApiOkResponse({
        type: SignInResponseDTO
    })
    @Post('sign-in')
    public signIn(@Body() dto: SignInRequestDTO): Promise<SignInResponseDTO> {
        return this.authService.signIn(dto.username, dto.password);
    }

    @ApiOkResponse({
        type: SignUpResponseDTO
    })
    @Post('sign-up')
    public signUp(@Body() dto: SignUpRequestDTO): Promise<SignUpResponseDTO> {
        return this.authService.signUp(dto.username, dto.password);
    }

}
