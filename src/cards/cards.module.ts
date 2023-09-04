import { Module } from '@nestjs/common';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { UsersModule } from '@/users/users.module';
import { CardsRepository } from './cards.repository';

@Module({
  imports: [UsersModule],
  controllers: [CardsController],
  providers: [CardsService, CardsRepository],
  exports: [CardsService],
})
export class CardsModule {}
