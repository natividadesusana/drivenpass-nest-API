import { NotesDto } from '@/notes/dto/notes.dto';
import { PrismaService } from '@/prisma/prisma.service';

export class NotesFactory {
  private bodyNote: NotesDto;
  private userId: number;

  constructor(private readonly prisma: PrismaService) {}

  withBodyNote(body: NotesDto) {
    this.bodyNote = body;
    return this;
  }

  withUserId(userId: number) {
    this.userId = userId;
    return this;
  }

  build() {
    return {
      ...this.bodyNote,
      userId: this.userId,
    };
  }

  async persist() {
    const notes = this.build();
    return await this.prisma.note.create({
      data: notes,
    });
  }
}
