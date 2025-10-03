import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
    Request,
    UseGuards,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { FilterArticlesDto } from './dto/filter-articles.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleEntity } from './entities/article.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ArticleDTO } from './dto/article.dto';
import { classToPlain, instanceToPlain, plainToInstance } from 'class-transformer';
import { ApiOkResponse, ApiQuery } from '@nestjs/swagger';

@Controller('articles')
export class ArticlesController {
    constructor(private readonly articlesService: ArticlesService) { }

    @ApiOkResponse({ type: [ArticleDTO] })
    @Get()
    public async getArticles(@Query() filters: FilterArticlesDto): Promise<ArticleDTO[]> {
        const articles = await this.articlesService.getMany(filters);

        return articles.map((article) => plainToInstance(ArticleDTO, article, {
            excludeExtraneousValues: true
        }));
    }

    @ApiOkResponse({ type: ArticleDTO })
    @Get(':id')
    public async getOne(@Param('id', ParseIntPipe) id: number): Promise<ArticleDTO> {
        const article = await this.articlesService.getOne(id);

        return plainToInstance(ArticleDTO, article, {
            excludeExtraneousValues: true
        });
    }

    @UseGuards(AuthGuard)
    @ApiOkResponse({ type: ArticleDTO })
    @Post()
    public async create(@Body() dto: CreateArticleDto, @Request() req): Promise<ArticleDTO> {
        const article = this.articlesService.create(dto, req.user);

        return plainToInstance(ArticleDTO, this.articlesService.create(dto, req.user), {
            excludeExtraneousValues: true
        });
    }

    @UseGuards(AuthGuard)
    @ApiOkResponse({ type: ArticleDTO })
    @Put(':id')
    public async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateArticleDto): Promise<ArticleDTO> {
        const article = await this.articlesService.update(id, dto);

        return plainToInstance(ArticleDTO, article, {
            excludeExtraneousValues: true
        });
    }

    @UseGuards(AuthGuard)
    @ApiOkResponse()
    @Delete(':id')
    public async delete(@Param('id', ParseIntPipe) id: number): Promise<any> {
        await this.articlesService.delete(id);

        return {
            success: true
        };
    }
}
