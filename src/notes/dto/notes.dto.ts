import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class NotesDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Classes Notes', description: 'Title for note' })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Class scheduled for 10/01', description: 'Description for note' })
  anotation: string;
}