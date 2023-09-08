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
    example: 'Card Bank',
    description: 'Title for card',
  })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '1111222233334444',
    description: 'Card Number',
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
    example: 'Susana Natividade',
    description: 'Name on the card',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '123',
    description: 'Card CVV',
  })
  cvv: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '10/24',
    description: 'Card expiration date',
  })
  exp: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '1234',
    description: 'Card password',
  })
  password: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: true,
    description: 'Is virtual card',
  })
  isVirtual: boolean;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: true,
    description: 'Is a credit card',
  })
  isCredit: boolean;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: false,
    description: 'Is a debit card',
  })
  isDebit: boolean;
}
