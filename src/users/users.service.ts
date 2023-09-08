import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  async create(userDTO: UserDto) {
    const { email } = userDTO;
    const user = await this.repository.getUserByEmail(email);
    if (user) throw new ConflictException('Email already in use.');
    return await this.repository.create(userDTO);
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