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
import { CardsService } from './cards.service';
import { AuthGuard } from '@/guards/auth.guard';
import { CardsDto } from './dto/cards.dto';
import { Users } from '@/decorators/user.decorator';
import { User } from '@prisma/client';
import { CardResponse } from './dto/card-response.dto';
import {
  ApiTags,
  ApiBody,
  ApiOperation,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiParam,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';

@ApiTags('Cards')
@UseGuards(AuthGuard)
@ApiBearerAuth('Authorization')
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  @ApiBody({ type: CardsDto })
  @ApiOperation({ summary: 'Create card' })
  @ApiUnauthorizedResponse({ description: 'Token not sent or invalid' })
  @ApiConflictResponse({ description: 'Title or card number already exist' })
  @ApiCreatedResponse({ description: 'Success', type: CardResponse })
  async createCredential(@Body() cardDTO: CardsDto, @Users() user: User) {
    return await this.cardsService.createCard(cardDTO, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Find all cards' })
  @ApiUnauthorizedResponse({ description: 'Token not sent or invalid' })
  @ApiOkResponse({ description: 'Success - returns an array of objects', type: [CardResponse] })
  async findAllCards(@Users() user: User) {
    return this.cardsService.findAllCards(user.id);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Find card by cardId' })
  @ApiParam({ name: 'id', description: 'Card id', example: 5 })
  @ApiUnauthorizedResponse({ description: 'Token not sent or invalid' })
  @ApiBadRequestResponse({ description: 'Id not valid' })
  @ApiNotFoundResponse({ description: 'There is no card for the submitted id' })
  @ApiForbiddenResponse({ description: 'CardId belongs to another user' })
  @ApiOkResponse({ description: 'Success', type: CardResponse })
  async findCredentialById(
    @Param('id', ParseIntPipe) id: number,
    @Users() user: User,
  ) {
    if (id <= 0) throw new BadRequestException('ID must be a positive integer');
    return await this.cardsService.findCardById(id, user.id);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete card by cardId' })
  @ApiParam({ name: 'id', description: 'Card id', example: 5 })
  @ApiBadRequestResponse({ description: 'Id not valid' })
  @ApiUnauthorizedResponse({ description: 'Token not sent or invalid' })
  @ApiForbiddenResponse({ description: 'CardId belongs to another user' })
  @ApiOkResponse({ description: 'Success' })
  async deleteCard(@Param('id', ParseIntPipe) id: number, @Users() user: User) {
    if (id <= 0) throw new BadRequestException('ID must be a positive integer');
    return await this.cardsService.deleteCard(id, user.id);
  }
}