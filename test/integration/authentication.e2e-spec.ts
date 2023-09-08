import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/prisma/prisma.service';
import { SignUpDto } from '@/auth/dto/signUp.dto';
import { SignUpFactory } from '../factories/signup.factory';
import { E2EUtils } from '../helpers';

describe('authController (e2e)', () => {
  let app: INestApplication;
  const prisma: PrismaService = new PrismaService();

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    await E2EUtils.cleanDb(prisma);
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  describe('/auth/signup (POST)', () => {
    it('should create a user', async () => {
      const signUpDto: SignUpDto = new SignUpDto({
        email: 'email@teste.com',
        password: '@StrongPassword1995',
      });
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(signUpDto)
        .expect(HttpStatus.CREATED);

      const users = await prisma.user.findMany();
      expect(users).toHaveLength(1);
      const user = users[0];
      expect(user).toEqual({
        id: expect.any(Number),
        email: signUpDto.email,
        password: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
    it('should return status 400 if no password is sent', async () => {
      const signUpDto: SignUpDto = new SignUpDto({
        email: 'email@teste.com',
      });
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(signUpDto)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return status 400 if no email is sent', async () => {
      const signUpDto: SignUpDto = new SignUpDto({
        password: '@StrongPassword1995',
      });
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(signUpDto)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return status 400 if a strong password is not sent', async () => {
      const signUpDto: SignUpDto = new SignUpDto({
        email: 'email@teste.com',
        password: 'password',
      });
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(signUpDto)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return status 409 if email is already in use', async () => {
      const signUpDto: SignUpDto = new SignUpDto({
        email: 'email@teste.com',
        password: '@StrongPassword1995',
      });
      await request(app.getHttpServer()).post('/auth/signup').send(signUpDto);

      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(signUpDto)
        .expect(HttpStatus.CONFLICT);
    });
  });

  describe('/auth/signin (POST)', () => {
    it('should return token if login is successful', async () => {
      const user = await new SignUpFactory(prisma)
        .withEmail('email@teste.com')
        .withPassword('@StrongPassword1995')
        .persist();

      const res = await request(app.getHttpServer())
        .post('/auth/signin')
        .send({ email: user.email, password: '@StrongPassword1995' })
        .expect(HttpStatus.OK);

      expect(res.body).toEqual({
        token: expect.any(String),
      });
    });

    it('should return status 400 if no password is sent', async () => {
      const user = await new SignUpFactory(prisma)
        .withEmail('email@teste.com')
        .withPassword('@StrongPassword1995')
        .persist();

      await request(app.getHttpServer())
        .post('/auth/signin')
        .send({ email: user.email })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return status 400 if no email is sent', async () => {
      await new SignUpFactory(prisma)
        .withEmail('email@teste.com')
        .withPassword('@StrongPassword1995')
        .persist();

      await request(app.getHttpServer())
        .post('/auth/signin')
        .send({ password: '@StrongPassword1995' })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return status 401 if email not valid', async () => {
      await new SignUpFactory(prisma)
        .withEmail('email@teste.com')
        .withPassword('@StrongPassword1995')
        .persist();

      await request(app.getHttpServer())
        .post('/auth/signin')
        .send({ email: 'other@email.com', password: '@StrongPassword1995' })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return status 401 if password not valid', async () => {
      const user = await new SignUpFactory(prisma)
        .withEmail('email@teste.com')
        .withPassword('@StrongPassword1995')
        .persist();

      await request(app.getHttpServer())
        .post('/auth/signin')
        .send({ email: user.email, password: '@InvalidPassword' })
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });
});
