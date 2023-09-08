import { CardsDto } from "@/cards/dto/cards.dto";
import { PrismaService } from '@/prisma/prisma.service';
const Cryptr = require('cryptr');

export class CardsFactory {
  private bodyCard: CardsDto;
  private userId: number;
  private code = process.env.SECRET_KEY_CRYPTR;
  private cryptr = new Cryptr(this.code);

  constructor(private readonly prisma: PrismaService) {}

  withBodyCard(body: CardsDto) {
    this.bodyCard = body;
    return this;
  }

  withUserId(userId: number) {
    this.userId = userId;
    return this;
  }

  build() {
    return {
      ...this.bodyCard,
      cvv: this.cryptr.encrypt(this.bodyCard.cvv) as string,
      password: this.cryptr.encrypt(this.bodyCard.password) as string,
      userId: this.userId,
    };
  }

  async persist() {
    const card = this.build();
    return await this.prisma.card.create({
      data: card,
    });
  }
}
