import { AuthGuard } from '@/guards/auth.guard';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesDTO } from './dto/notes.dto';
import { Users } from '@/decorators/user.decorator';
import { User } from '@prisma/client';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UpdateNoteDto } from './dto/update-note.dto';

@UseGuards(AuthGuard)
@ApiBearerAuth('Authorization')
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @ApiBody({ type: NotesDTO })
  @ApiOperation({ summary: 'Create note' })
  @ApiUnauthorizedResponse({ description: 'Token not sent or invalid' })
  @ApiConflictResponse({ description: 'Title already exist' })
  @ApiCreatedResponse({ description: 'Success', type: UpdateNoteDto })
  async createNote(@Body() noteDTO: NotesDTO, @Users() user: User) {
    return await this.notesService.createNote(noteDTO, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Find all notes' })
  @ApiUnauthorizedResponse({ description: 'Token not sent or invalid' })
  @ApiOkResponse({
    description: 'Success - returns an array of objects',
    type: [UpdateNoteDto],
  })
  async findAllNotes(@Users() user: User) {
    return await this.notesService.findAllNotes(user.id);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Find note by noteId' })
  @ApiParam({ name: 'id', description: 'Note id', example: 5 })
  @ApiUnauthorizedResponse({ description: 'Token not sent or invalid' })
  @ApiBadRequestResponse({ description: 'Id not valid' })
  @ApiNotFoundResponse({ description: 'There is no note for the submitted id' })
  @ApiForbiddenResponse({ description: 'NoteId belongs to another user' })
  @ApiOkResponse({ description: 'Success', type: UpdateNoteDto })
  async findNoteById(
    @Param('id', ParseIntPipe) id: number,
    @Users() user: User,
  ) {
    if (id <= 0) throw new BadRequestException('ID must be a positive integer');
    return await this.notesService.findNoteById(id, user.id);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete note by noteId' })
  @ApiParam({ name: 'id', description: 'Note id', example: 5 })
  @ApiBadRequestResponse({ description: 'Id not valid' })
  @ApiUnauthorizedResponse({ description: 'Token not sent or invalid' })
  @ApiForbiddenResponse({ description: 'NoteId belongs to another user' })
  @ApiOkResponse({ description: 'Success' })
  async deleteNote(@Param('id', ParseIntPipe) id: number, @Users() user: User) {
    if (id <= 0) throw new BadRequestException('ID must be a positive integer');
    return await this.notesService.deleteNote(id, user.id);
  }
}