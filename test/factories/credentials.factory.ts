import { CredentialDto } from "@/credentials/dto/credential.dto";
import { PrismaService } from '@/prisma/prisma.service';
const Cryptr = require('cryptr');

export class CredentialsFactory {
  private bodyCredential: CredentialDto;
  private userId: number;
  private code = process.env.SECRET_KEY_CRYPTR;
  private cryptr = new Cryptr(this.code);

  constructor(private readonly prisma: PrismaService) {}

  withBodyCredential(body: CredentialDto) {
    this.bodyCredential = body;
    return this;
  }

  withUserId(userId: number) {
    this.userId = userId;
    return this;
  }

  build() {
    return {
      ...this.bodyCredential,
      password: this.cryptr.encrypt(this.bodyCredential.password) as string,
      userId: this.userId,
    };
  }

  async persist() {
    const credential = this.build();
    return await this.prisma.credential.create({
      data: credential,
    });
  }
}
