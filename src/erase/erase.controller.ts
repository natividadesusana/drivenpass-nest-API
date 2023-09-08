import { Body, Controller, Delete, UseGuards } from '@nestjs/common';
import { EraseService } from './erase.service';
import { Users } from '@/decorators/user.decorator';
import { User } from '@prisma/client';
import { EraseDto } from './dto/erase.dto';
import { AuthGuard } from '@/guards/auth.guard';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiTags('Erase')
@ApiBearerAuth('Authorization')
@UseGuards(AuthGuard)
@Controller('erase')
export class EraseController {
  constructor(private readonly eraseService: EraseService) {}

  @Delete()
  @ApiBody({ schema: { type: 'object', properties: { password: { type: 'string', example: '@Password123' } } } })
  @ApiOperation({ summary: 'Delete account' })
  @ApiUnauthorizedResponse({ description: 'Token not sent or invalid' })
  @ApiOkResponse({ description: 'Account deleted successfully' })
  async eraseAccount(@Body() body: EraseDto, @Users() user: User) {
    await this.eraseService.deleteAccount(user.email, body.password);
    return { message: 'Account successfully deleted' };
  }
}
