import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EraseService } from './erase.service';
import { CreateEraseDto } from './dto/create-erase.dto';
import { UpdateEraseDto } from './dto/update-erase.dto';

@Controller('erase')
export class EraseController {
  constructor(private readonly eraseService: EraseService) {}

  @Post()
  create(@Body() createEraseDto: CreateEraseDto) {
    return this.eraseService.create(createEraseDto);
  }

  @Get()
  findAll() {
    return this.eraseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eraseService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEraseDto: UpdateEraseDto) {
    return this.eraseService.update(+id, updateEraseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eraseService.remove(+id);
  }
}
