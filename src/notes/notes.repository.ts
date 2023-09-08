import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { NotesDto } from '@/notes/dto/notes.dto';

@Injectable()
export class NotesRepository {
  constructor(private readonly prisma: PrismaService) {}

  createNotes(noteDTO: NotesDto, userId: number) {
    return this.prisma.note.create({ data: { ...noteDTO, userId } });
  }

  getNoteByTitleAndUserId(title: string, userId: number) {
    return this.prisma.note.findUnique({ where: { userId_title: { userId, title } } });
  }

  findAllNotes(userId: number) {
    return this.prisma.note.findMany({ where: { userId: userId } });
  }

  findNoteById(id: number) {
    return this.prisma.note.findUnique({ where: { id } });
  }

  deleteNote(id: number) {
    return this.prisma.note.delete({ where: { id } });
  }

  deleteAllNotes(userId: number) {
    return this.prisma.note.deleteMany({ where: { userId } }) }
}