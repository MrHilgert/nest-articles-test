import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { CacheService } from 'src/cache/cache.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from './entities/article.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity]), AuthModule, ConfigModule],
  providers: [ArticlesService, {
    provide: CacheService,
    useFactory: () => new CacheService('articles')
  }],
  controllers: [ArticlesController]
})
export class ArticlesModule { }
