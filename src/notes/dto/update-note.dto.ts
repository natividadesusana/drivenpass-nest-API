import { ApiProperty } from '@nestjs/swagger';
import { NotesDTO } from './notes.dto';

export class UpdateNoteDto extends (NotesDTO) {
    @ApiProperty({ type: 'number', example: 5 })
  id: number;

  @ApiProperty({ type: 'number', example: 1 })
  userId: number;

  @ApiProperty({ type: 'string', example: '2023-09-03T10:00:00.122Z' })
  createdAt: string;

  @ApiProperty({ type: 'string', example: '2023-09-03T10:00:00.122Z' })
  updatedAt: string;
}