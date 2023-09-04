import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CredentialDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Social midia name',
    description: 'Title for credential',
  })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'natividadesusana',
    description: 'Username for credential',
  })
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '@Password123',
    description: 'Password for credential',
  })
  password: string;

  @IsUrl()
  @IsNotEmpty()
  @ApiProperty({
    example: 'https://natividadesusana.com',
    description: 'Url for credential',
  })
  url: string;
}