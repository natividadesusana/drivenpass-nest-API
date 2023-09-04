import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { NotesRepository } from './notes.repository';
import { NotesDTO } from './dto/notes.dto';

@Injectable()
export class NotesService {
  constructor(private readonly repository: NotesRepository) {}

  async createNote(noteDTO: NotesDTO, userId: number) {
    const note = await this.repository.getNoteByTitleAndUserId( noteDTO.title, userId );
    if (note) throw new ConflictException();
    return await this.repository.createNotes(noteDTO, userId);
  }

  async findAllNotes(userId: number) {
    return await this.repository.findAllNotes(userId);
  }

  async findNoteById(id: number, userId: number) {
    const note = await this.repository.findNoteById(id);
    if (!note) throw new NotFoundException();
    if (note.userId !== userId) throw new ForbiddenException();
    return [note];
  }

  async deleteNote(id: number, userId: number) {
    const note = await this.repository.findNoteById(id);
    if (!note) throw new NotFoundException();
    if (note.userId !== userId) throw new ForbiddenException();
    return await this.repository.deleteNote(id);
  }

  async deleteAllNotes(userId: number) {
    return await this.repository.deleteAllNotes(userId);
  }
}