import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CardsRepository } from './cards.repository';
import { CardsDto } from './dto/cards.dto';

@Injectable()
export class CardsService {
  constructor(private readonly repository: CardsRepository) {}

  async createCard(cardDTO: CardsDto, userId: number) {
    const card = await this.repository.findCardByUserIdAndTitle(userId, cardDTO.title );
    if (card) throw new ConflictException('A title with that name already exists.');
    const cardByNumber = await this.repository.findCardByNumber(cardDTO.number);
    if (cardByNumber) throw new ConflictException('A card with that number already exists.');
    return await this.repository.createCard(cardDTO, userId);
  }

  async findAllCards(userId: number) {
    return await this.repository.findAllCards(userId);
  }

  async findCardById(id: number, userId: number) {
    const card = await this.repository.findCardById(id);
    if (card.length === 0) throw new NotFoundException('There is no card for the submitted id');
    if (card[0].userId !== userId) throw new ForbiddenException('Card belongs to another user');
    return card;
  }

  async deleteCard(id: number, userId: number) {
    const card = await this.repository.findCardById(id);
    if (card.length === 0) throw new NotFoundException('There is no card for the submitted id');
    if (card[0].userId !== userId) throw new ForbiddenException('Card belongs to another user');
    return await this.repository.deleteCard(id);
  }

  async deleteAllCards(userId: number) {
    return await this.repository.deleteAllCards(userId);
  }
}