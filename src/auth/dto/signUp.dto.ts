import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'exemple@email.com', description: 'Email for user' })
  email: string;

  @IsString()
  @MinLength(10, { message: 'Password must be at least 10 characters long' })
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).*$/, {
    message:
      'Password must contain at least 1 number, 1 lowercase letter, 1 uppercase letter and 1 special character',
  })
  @ApiProperty({
    example: '@StrongPassword1995',
    description: 'Strong password for use',
  })
  password: string;

  constructor(params?: Partial<SignUpDto>) {
    if (params) Object.assign(this, params);
  }
}