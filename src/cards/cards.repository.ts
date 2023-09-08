import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CardsDto } from './dto/cards.dto';
import { Card } from '@prisma/client';
const Cryptr = require('cryptr');

@Injectable()
export class CardsRepository {
  private code = process.env.SECRET_KEY_CRYPTR;
  private cryptr = new Cryptr(this.code);

  constructor(private readonly prisma: PrismaService) {}

  createCard(cardDTo: CardsDto, userId: number) {
    return this.prisma.card.create({
      data: {
        ...cardDTo,
        cvv: this.cryptr.encrypt(cardDTo.cvv) as string,
        password: this.cryptr.encrypt(cardDTo.password) as string,
        userId,
      },
    });
  }

  findCardByUserIdAndTitle(userId: number, title: string) {
    return this.prisma.card.findUnique({ where: { userId_title: { userId, title } } });
  }

  async findAllCards(userId: number) {
    const cards = await this.prisma.card.findMany({ where: { userId } });
    return this.decryptCardsData(cards);
  }

  findCardByNumber(cardNumber: string) {
    return this.prisma.card.findUnique({ where: { number: cardNumber } });
  }

  async findCardById(id: number) {
    const card = await this.prisma.card.findFirst({ where: { id } });
    return card ? this.decryptCardsData([card]) : [];
  }

  deleteCard(id: number) {
    return this.prisma.card.delete({ where: { id } });
  }

  deleteAllCards(userId: number) {
    return this.prisma.card.deleteMany({ where: { userId } });
  }

  private decryptCardsData(cards: Card[]) {
    return cards.map((card) => {
      return {
        ...card,
        cvv: this.cryptr.decrypt(card.cvv) as string,
        password: this.cryptr.decrypt(card.password) as string,
      };
    });
  }
}