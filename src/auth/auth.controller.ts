import { AuthService } from './auth.service';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SignUpDto } from './dto/signUp.dto';
import { SignInDTO } from './dto/signIn.dto';
import { ApiBadRequestResponse, ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('SignUp')
  @ApiBody({ type: SignUpDto })
  @ApiOperation({ summary: 'SignUp a user' })
  @ApiConflictResponse({ description: 'Email already in use' })
  @ApiBadRequestResponse({ description: 'Email or password not sent' })
  @ApiCreatedResponse({
    description: 'Success',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        email: { type: 'string', example: 'example@example.com' },
        password: { type: 'string', example: '@hashedPassword123' },
        createdAt: { type: 'string', example: '2023-09-03T10:00:00.000Z' },
        updatedAt: { type: 'string', example: '2023-09-03T10:00:00.000Z' },
      },
    },
  })
  @HttpCode(HttpStatus.CREATED)
  register(@Body() signUpDto: SignUpDto) {
    return this.authService.register(signUpDto);
  }

  @Post('SignIn')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: SignInDTO })
  @ApiOperation({ summary: 'Authenticate a user' })
  @ApiBadRequestResponse({ description: 'Email or password not sent' })
  @ApiUnauthorizedResponse({ description: 'Incorrect email or password' })
  @ApiOkResponse({
    description: 'Return a token for use',
    schema: { type: 'object', properties: { token: { type: 'string' } } },
  })
  login(@Body() signInDTO: SignInDTO) {
    return this.authService.login(signInDTO);
  }
}
