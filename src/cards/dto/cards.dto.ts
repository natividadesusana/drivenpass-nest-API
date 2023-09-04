import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CardsDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'New Title',
    description: 'New Title Description',
  })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'New Card Number',
    description: 'New Card Number Description',
  })
  @Length(13, 19, {
    message: 'Card number must be between 13 and 19 digits',
  })
  @Matches(/^[0-9]*$/, {
    message: 'The card number must only contain numerical digits.',
  })
  number: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'New Name',
    description: 'New Name Description',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'New CVV',
    description: 'New CVV Description',
  })
  cvv: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'New Expiration Date',
    description: 'New Expiration Date Description',
  })
  exp: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'New Password',
    description: 'New Password Description',
  })
  password: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: false,
    description: 'Is not virtual card',
  })
  isVirtual: boolean;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: false,
    description: 'Is not a credit card',
  })
  isCredit: boolean;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: true,
    description: 'Is a debit card',
  })
  isDebit: boolean;
}
