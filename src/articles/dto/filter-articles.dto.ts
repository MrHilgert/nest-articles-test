import { IsOptional, IsString, IsDateString, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional, ApiQuery } from '@nestjs/swagger';

export class FilterArticlesDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    username?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    createdAfter?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    createdBefore?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    page?: number = 1;
}
