import { ApiOkResponse, ApiResponse, ApiResponseProperty } from "@nestjs/swagger";

export class SignUpResponseDTO {
    @ApiResponseProperty()
    token: string;

    constructor(token: string) {
        this.token = token;
    }
};