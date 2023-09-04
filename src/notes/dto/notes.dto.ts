import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class NotesDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Notes', description: 'Title for note' })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Text notes', description: 'Description for note' })
  anotation: string;
}