import UserEntity from "../../users/entities/user.entity";
import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Index('idx_user_createdAt', (article: ArticleEntity) => [article.user, article.createdAt])
@Entity('articles')
export class ArticleEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @ManyToOne(() => UserEntity, (u) => u.id, {
        eager: true
    })
    user: UserEntity;

    @CreateDateColumn()
    createdAt: Date;
} 