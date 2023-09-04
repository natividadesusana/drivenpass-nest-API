import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { SignInDTO } from '@/auth/dto/signIn.dto';

export async function signin(app: INestApplication, body: SignInDTO) {
  return request(app.getHttpServer()).post('/auth/signIn').send(body);
}