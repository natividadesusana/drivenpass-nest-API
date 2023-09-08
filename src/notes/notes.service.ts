import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { NotesRepository } from './notes.repository';
import { NotesDto } from './dto/notes.dto';

@Injectable()
export class NotesService {
  constructor(private readonly repository: NotesRepository) {}

  async createNote(noteDTO: NotesDto, userId: number) {
    const note = await this.repository.getNoteByTitleAndUserId( noteDTO.title, userId,);
    if (note) throw new ConflictException('A title with that name already exists.');
    return await this.repository.createNotes(noteDTO, userId);
  }

  async findAllNotes(userId: number) {
    return await this.repository.findAllNotes(userId);
  }

  async findNoteById(id: number, userId: number) {
    const note = await this.repository.findNoteById(id);
    if (!note) throw new NotFoundException('There is no note for the submitted id');
    if (note.userId !== userId) throw new ForbiddenException('Note belongs to another user');
    return [note];
  }

  async deleteNote(id: number, userId: number) {
    const note = await this.repository.findNoteById(id);
    if (!note) throw new NotFoundException('There is no note for the submitted id');
    if (note.userId !== userId) throw new ForbiddenException('Note belongs to another user');
    return await this.repository.deleteNote(id);
  }

  async deleteAllNotes(userId: number) {
    return await this.repository.deleteAllNotes(userId);
  }
}