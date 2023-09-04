import { IsNotEmpty, IsString } from 'class-validator';

export class EraseDTO {
  @IsString()
  @IsNotEmpty()
  password: string;
}
