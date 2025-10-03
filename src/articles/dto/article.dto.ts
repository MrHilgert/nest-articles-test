import { ApiResponseProperty } from "@nestjs/swagger";
import { Expose, Transform } from "class-transformer";
import UserEntity from "src/users/entities/user.entity";

export class ArticleDTO {
    @ApiResponseProperty()
    @Expose()
    name: string;

    @ApiResponseProperty()
    @Expose()
    description: string;

    @ApiResponseProperty()
    @Expose()
    @Transform(({ obj }) => obj.user?.username)
    author: string;
    
    user: UserEntity;

    @ApiResponseProperty()
    @Expose()
    createdAt: Date;
}