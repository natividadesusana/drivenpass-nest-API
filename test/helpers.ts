import { PrismaService } from '@/prisma/prisma.service';

export class E2EUtils {
  static async cleanDb(prisma: PrismaService) {
    await prisma.wifi.deleteMany();
    await prisma.credentials.deleteMany();
    await prisma.notes.deleteMany();
    await prisma.cards.deleteMany();
    await prisma.users.deleteMany();
  }
}