import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JWTPayloadDTO } from "../dto/jwt.payload.dto";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }

    async canActivate(ctx: ExecutionContext): Promise<boolean> {
        const request = ctx.switchToHttp().getRequest();

        const jwtToken = this.extractJWTFromheader(request);

        if (!jwtToken)
            throw new UnauthorizedException();

        try {
            const payload: JWTPayloadDTO = await this.jwtService.verifyAsync(jwtToken, {
                secret: this.configService.get<string>('JWT_SECRET')
            });

            request.user = payload;
        } catch (error) {
            throw new UnauthorizedException();
        }

        return true;
    }

    private extractJWTFromheader(request: Request): string | undefined {
        const [tokenType, tokenValue] = request.headers['authorization']?.split(' ') ?? [];
        return tokenType === 'Bearer' ? tokenValue : undefined;
    }

}