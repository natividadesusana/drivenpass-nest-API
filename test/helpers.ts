import { PrismaService } from '@/prisma/prisma.service';

export class E2EUtils {
  static async cleanDb(prisma: PrismaService) {
    await prisma.user.deleteMany();
    await prisma.credential.deleteMany();
    await prisma.note.deleteMany();
    await prisma.card.deleteMany();
  }
}