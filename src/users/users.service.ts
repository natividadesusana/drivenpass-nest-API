import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    const user = await this.repository.getUserByEmail(email);
    if (user) throw new ConflictException('Email already exists.');
    return await this.repository.create(createUserDto);
  }

  async getUserByEmail(email: string) {
    return await this.repository.getUserByEmail(email);
  }

  async getUserById(id: number) {
    const user = await this.repository.getUserById(id);
    if (!user) throw new NotFoundException('User not found!');
    return user;
  }

  async deleteUser(id: number) {
    return this.repository.deleteUser(id);
  }
}
