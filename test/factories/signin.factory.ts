import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { SignInDto } from '@/auth/dto/signIn.dto';

export async function login(app: INestApplication, signIn: SignInDto) {
  return request(app.getHttpServer()).post('/auth/signin').send(signIn);
}
