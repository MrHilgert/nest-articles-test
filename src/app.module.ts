import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesModule } from './articles/articles.module';
import { AuthModule } from './auth/auth.module';
import { CacheService } from './cache/cache.service';
import { UsersModule } from './users/users.module';

import defaultDatasource from './default.datasource';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [TypeOrmModule.forRootAsync({
        name: 'default',
        useFactory: async () => {
            const dataSource = await defaultDatasource.initialize();

            return Object.assign(dataSource.options, {

            });
        }
    }), ConfigModule.forRoot(), AuthModule, UsersModule, ArticlesModule],
    controllers: [],
    providers: [],
})
export class AppModule { }
