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
import { NotesDto } from './dto/notes.dto';
import { Users } from '@/decorators/user.decorator';
import { User } from '@prisma/client';
import { NoteResponse } from './dto/note-response.dto';
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
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Notes')
@UseGuards(AuthGuard)
@ApiBearerAuth('Authorization')
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @ApiBody({ type: NotesDto })
  @ApiOperation({ summary: 'Create note' })
  @ApiUnauthorizedResponse({ description: 'Token not sent or invalid' })
  @ApiConflictResponse({ description: 'Title already exist' })
  @ApiCreatedResponse({ description: 'Success', type: NoteResponse })
  async createNote(@Body() noteDTO: NotesDto, @Users() user: User) {
    return await this.notesService.createNote(noteDTO, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Find all notes' })
  @ApiUnauthorizedResponse({ description: 'Token not sent or invalid' })
  @ApiOkResponse({ description: 'Success - returns an array of objects', type: [NoteResponse] })
  async findAllNotes(@Users() user: User) {
    return await this.notesService.findAllNotes(user.id);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Find note by noteId' })
  @ApiParam({ name: 'id', description: 'Note id', example: 1 })
  @ApiUnauthorizedResponse({ description: 'Token not sent or invalid' })
  @ApiBadRequestResponse({ description: 'Id not valid' })
  @ApiNotFoundResponse({ description: 'There is no note for the submitted id' })
  @ApiForbiddenResponse({ description: 'NoteId belongs to another user' })
  @ApiOkResponse({ description: 'Success', type: NoteResponse })
  async findNoteById(
    @Param('id', ParseIntPipe) id: number,
    @Users() user: User,
  ) {
    if (id <= 0) throw new BadRequestException('ID must be a positive integer');
    return await this.notesService.findNoteById(id, user.id);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete note by noteId' })
  @ApiParam({ name: 'id', description: 'Note id', example: 1 })
  @ApiBadRequestResponse({ description: 'Id not valid' })
  @ApiUnauthorizedResponse({ description: 'Token not sent or invalid' })
  @ApiForbiddenResponse({ description: 'NoteId belongs to another user' })
  @ApiOkResponse({ description: 'Success' })
  async deleteNote(@Param('id', ParseIntPipe) id: number, @Users() user: User) {
    if (id <= 0) throw new BadRequestException('ID must be a positive integer');
    return await this.notesService.deleteNote(id, user.id);
  }
}