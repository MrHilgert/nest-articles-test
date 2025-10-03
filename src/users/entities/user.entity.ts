import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export default class UserEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Index()
    username: string;

    @Column()
    passwordHash: string;

    @CreateDateColumn()
    createdAt: Date;

}