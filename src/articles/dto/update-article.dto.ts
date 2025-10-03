import { PartialType } from '@nestjs/mapped-types';
import { CreateArticleDto } from './create-article.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateArticleDto extends PartialType(CreateArticleDto) {
    @ApiPropertyOptional()
    description?: string;
    
    @ApiPropertyOptional()
    name?: string;
}
