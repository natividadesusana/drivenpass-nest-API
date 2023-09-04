import { Injectable } from '@nestjs/common';
import { CredentialDto } from './dto/credential.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { Credential } from '@prisma/client';
import Cryptr from 'cryptr'; 

@Injectable()
export class CredentialsRepository {
  private code = process.env.SECRET_KEY_CRYPTR;
  private cryptr = new Cryptr(this.code);

  constructor(private readonly prisma: PrismaService) {}

  createCredential(userId: number, credentialsDTO: CredentialDto) {
    return this.prisma.credential.create({
      data: {
        ...credentialsDTO,
        password: this.cryptr.encrypt(credentialsDTO.password) as string,
        userId,
      },
    });
  }

  findCredentialByUserIdAndTitle(userId: number, title: string) {
    return this.prisma.credential.findUnique({
      where: {
        userId_title: {
          userId,
          title,
        },
      },
    });
  }

  async findAllCredentialsByUserId(userId: number) {
    const credentials = await this.prisma.credential.findMany({
      where: { userId },
    });

    return this.decryptCredentialsPassword(credentials);
  }

  async findCredentialById(id: number) {
    const credential = await this.prisma.credential.findFirst({
      where: { id },
    });
    return credential ? this.decryptCredentialsPassword([credential]) : [];
  }

  deleteCredential(id: number) {
    return this.prisma.credential.delete({
      where: { id },
    });
  }

  deleteAllCredentials(userId: number) {
    return this.prisma.credential.deleteMany({
      where: { userId },
    });
  }

  private decryptCredentialsPassword(credentials: Credential[]) {
    return credentials.map((credential) => {
      return {
        ...credential,
        password: this.cryptr.decrypt(credential.password) as string,
      };
    });
  }
}
