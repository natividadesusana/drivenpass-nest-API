import { Module } from '@nestjs/common';
import { EraseService } from './erase.service';
import { EraseController } from './erase.controller';

@Module({
  controllers: [EraseController],
  providers: [EraseService],
})
export class EraseModule {}
