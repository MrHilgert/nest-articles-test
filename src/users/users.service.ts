import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import UserEntity from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDTO } from './dto/create-user.dto';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(UserEntity)
        private readonly usersRepository: Repository<UserEntity>
    ) { }

    public async findById(id: number): Promise<UserEntity> {
        return this.usersRepository.findOne({
            where: { id }
        });
    }

    public async findByUsername(username: string): Promise<UserEntity> { // TODO UserEntity returning
        return this.usersRepository.findOne({
            where: {
                username
            }
        });
    }

    public async createUser(dto: CreateUserDTO): Promise<UserEntity> {
        const userEntity = this.usersRepository.create(dto);

        return this.usersRepository.save(userEntity);
    }

}
