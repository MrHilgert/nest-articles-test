import { ApiResponseProperty } from "@nestjs/swagger";

export class SignInResponseDTO {
    @ApiResponseProperty()
    token: string;

    constructor(token: string) {
        this.token = token;
    }
};