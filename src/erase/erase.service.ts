import { Injectable } from '@nestjs/common';
import { CreateEraseDto } from './dto/create-erase.dto';
import { UpdateEraseDto } from './dto/update-erase.dto';

@Injectable()
export class EraseService {
  create(createEraseDto: CreateEraseDto) {
    return 'This action adds a new erase';
  }

  findAll() {
    return `This action returns all erase`;
  }

  findOne(id: number) {
    return `This action returns a #${id} erase`;
  }

  update(id: number, updateEraseDto: UpdateEraseDto) {
    return `This action updates a #${id} erase`;
  }

  remove(id: number) {
    return `This action removes a #${id} erase`;
  }
}
