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
import { CredentialsService } from './credentials.service';
import { AuthGuard } from '@/guards/auth.guard';
import { CredentialDto } from './dto/credential.dto';
import { Users } from '@/decorators/user.decorator';
import { User } from '@prisma/client';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UpdateCredentialDto } from './dto/update-credential.dto';

@UseGuards(AuthGuard)
@ApiBearerAuth('Authorization')
@Controller('credentials')
export class CredentialsController {
  constructor(private readonly credentialsService: CredentialsService) {}

  @Post()
  @ApiBody({ type: CredentialDto })
  @ApiOperation({ summary: 'Create credential' })
  @ApiUnauthorizedResponse({ description: 'Token not sent or invalid' })
  @ApiConflictResponse({ description: 'Title already exist' })
  @ApiCreatedResponse({ description: 'Success', type: UpdateCredentialDto })
  async createCredential(
    @Body() credentialDTO: CredentialDto,
    @Users() user: User,
  ) {
    return await this.credentialsService.createCredential( user.id, credentialDTO );
  }

  @Get()
  @ApiOperation({ summary: 'Find all credentials' })
  @ApiUnauthorizedResponse({ description: 'Token not sent or invalid' })
  @ApiOkResponse({ description: 'Success', type: [UpdateCredentialDto] })
  async findAllCredentials(@Users() user: User) {
    return await this.credentialsService.findAllCredentialsByUserId(user.id);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Find credential by credentialId' })
  @ApiParam({ name: 'id', description: 'Credential id', example: 5 })
  @ApiUnauthorizedResponse({ description: 'Token not sent or invalid' })
  @ApiBadRequestResponse({ description: 'Id not valid' })
  @ApiNotFoundResponse({ description: 'There is no credential for the submitted id' })
  @ApiForbiddenResponse({ description: 'CredentialId belongs to another user' })
  @ApiOkResponse({ description: 'Success', type: UpdateCredentialDto })
  async findCredentialById(
    @Param('id', ParseIntPipe) id: number,
    @Users() user: User,
  ) {
    if (id <= 0) throw new BadRequestException('ID must be a positive integer');
    return await this.credentialsService.findCredentialById(id, user.id);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete credential by credentialId' })
  @ApiParam({ name: 'id', description: 'Credential id', example: 5 })
  @ApiBadRequestResponse({ description: 'Id not valid' })
  @ApiUnauthorizedResponse({ description: 'Token not sent or invalid' })
  @ApiForbiddenResponse({ description: 'CredentialId belongs to another user' })
  @ApiOkResponse({ description: 'Success' })
  async deleteCredential(
    @Param('id', ParseIntPipe) id: number,
    @Users() user: User,
  ) {
    if (id <= 0) throw new BadRequestException('ID must be a positive integer');
    return await this.credentialsService.deleteCredential(id, user.id);
  }
}
