import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { BodySignIn } from '../factories/signin.body';
import { SignUpFactory } from '../factories/signup.factory';
import { login } from '../factories/signin.factory';
import { BodyCard } from '../factories/cards.body';
import { CardsFactory } from '../factories/cards.factory';
import { BodyCredential } from '../factories/credentials.body';
import { CredentialsFactory } from '../factories/credentials.factory';
import { BodyNote } from '../factories/notes.body';
import { NotesFactory } from '../factories/notes.factory';
import { E2EUtils } from '../helpers';

describe('eraseController (e2e)', () => {
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

  describe('/erase (DELETE)', () => {
    it('should respond with status 401 if no token is given', async () => {
      const body = { password: 'MyPassword' };
      await request(app.getHttpServer())
        .delete('/erase')
        .send(body)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
      const token = faker.lorem.word();
      const body = { password: 'MyPassword' };
      await request(app.getHttpServer())
        .delete('/erase')
        .send(body)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should respond with status 400 if password(body) not sent', async () => {
      const bodyLogin = new BodySignIn().generate();
      await new SignUpFactory(prisma)
        .withEmail(bodyLogin.email)
        .withPassword(bodyLogin.password)
        .persist();

      const { body } = await login(app, bodyLogin);

      await request(app.getHttpServer())
        .delete('/erase')
        .send({})
        .set('Authorization', `Bearer ${body.token}`)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should respond with status 403 if password is not correct', async () => {
      const bodyLogin = new BodySignIn().generate();
      await new SignUpFactory(prisma)
        .withEmail(bodyLogin.email)
        .withPassword(bodyLogin.password)
        .persist();

      const { body } = await login(app, bodyLogin);

      await request(app.getHttpServer())
        .delete('/erase')
        .send({ password: '@IncorrectPassword1970' })
        .set('Authorization', `Bearer ${body.token}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should delete the account correctly', async () => {
      const bodyLogin = new BodySignIn().generate();
      const user = await new SignUpFactory(prisma)
        .withEmail(bodyLogin.email)
        .withPassword(bodyLogin.password)
        .persist();

      const { body } = await login(app, bodyLogin);

      //Create card
      const cardBody = new BodyCard().generate();
      await new CardsFactory(prisma)
        .withBodyCard(cardBody)
        .withUserId(user.id)
        .persist();

      //Create credential
      const credentialBody = new BodyCredential().generate();
      await new CredentialsFactory(prisma)
        .withBodyCredential(credentialBody)
        .withUserId(user.id)
        .persist();

      //Create note
      const noteBody = new BodyNote().generate();
      await new NotesFactory(prisma)
        .withBodyNote(noteBody)
        .withUserId(user.id)
        .persist();
    });
  });
});
