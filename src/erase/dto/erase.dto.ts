import { IsNotEmpty, IsString } from 'class-validator';

export class EraseDto {
  @IsString()
  @IsNotEmpty()
  password: string;
}
