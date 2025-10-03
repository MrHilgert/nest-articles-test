import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JWTPayloadDTO } from 'src/auth/dto/jwt.payload.dto';
import { CacheService } from 'src/cache/cache.service';
import { Repository } from 'typeorm';
import { ArticleConstants } from './constants';
import { CreateArticleDto } from './dto/create-article.dto';
import { FilterArticlesDto } from './dto/filter-articles.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleEntity } from './entities/article.entity';

const CACHE_TTL_MS = 120 * 1000;

@Injectable()
export class ArticlesService {
    constructor(
        @InjectRepository(ArticleEntity)
        private readonly articlesRepository: Repository<ArticleEntity>,
        private readonly cacheService: CacheService,
    ) { }

    public async getMany(filters: FilterArticlesDto): Promise<ArticleEntity[]> {
        const query = this.articlesRepository
            .createQueryBuilder('article')
            .leftJoinAndSelect('article.user', 'user');

        if (filters.username) {
            query.andWhere('user.username = :username', { username: filters.username });
        }

        if (filters.createdAfter) {
            query.andWhere('article.createdAt >= :after', { after: filters.createdAfter });
        }

        if (filters.createdBefore) {
            query.andWhere('article.createdAt <= :before', { before: filters.createdBefore });
        }

        query.take(ArticleConstants.pageSize);
        query.skip(ArticleConstants.pageSize * ((filters.page ?? 1) - 1));

        return query.getMany();
    }

    public async getOne(id: number): Promise<ArticleEntity> {
        const articleCacheKey = this.getArticleCacheKey(id);
        const cachedArticle = await this.cacheService.get<ArticleEntity>(articleCacheKey);

        if (cachedArticle)
            return cachedArticle;

        const article = await this.articlesRepository.findOneBy({ id });

        if (!article)
            throw new NotFoundException(`Article #${id} not found`);

        await this.cacheService.set<ArticleEntity>(articleCacheKey, article, CACHE_TTL_MS);

        return article;
    }

    public async create(dto: CreateArticleDto, userPayload: JWTPayloadDTO): Promise<ArticleEntity> {
        const article = this.articlesRepository.create({
            ...dto,
            user: {
                id: userPayload.id
            }
        });

        return this.articlesRepository.save(article);
    }

    public async update(id: number, dto: UpdateArticleDto): Promise<ArticleEntity> {
        const article = await this.getOne(id);

        Object.assign(article, dto);

        await this.cacheService.delete(this.getArticleCacheKey(id));

        return this.articlesRepository.save(article);
    }

    public async delete(id: number): Promise<void> {
        const result = await this.articlesRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException(`Article #${id} not found`);
        }

        await this.cacheService.delete(this.getArticleCacheKey(id));
    }

    private getArticleCacheKey(id: number): string {
        return `article:${id}`;
    }
}
