import { BodyCredential } from './../factories/credentials.body';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/prisma/prisma.service';
import { SignUpFactory } from '../factories/signup.factory';
import { login } from '../factories/signin.factory';
import { BodySignIn } from '../factories/signin.body';
import { faker } from '@faker-js/faker';
import { CredentialsFactory } from '../factories/credentials.factory';
import { E2EUtils } from '../helpers';

describe('credentialsController (e2e)', () => {
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

  describe('/credentials (POST)', () => {
    it('should respond with status 401 if no token is given', async () => {
      const bodyCredential = new BodyCredential().generate();
      await request(app.getHttpServer())
        .post('/credentials')
        .send(bodyCredential)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
      const token = faker.lorem.word();
      const bodyCredential = new BodyCredential().generate();
      await request(app.getHttpServer())
        .post('/credentials')
        .send(bodyCredential)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should respond with status 409 when title already exist', async () => {
      const bodyLogin = new BodySignIn().generate();
      await new SignUpFactory(prisma)
        .withEmail(bodyLogin.email)
        .withPassword(bodyLogin.password)
        .persist();

      const { body } = await login(app, bodyLogin);

      const bodyCredential1 = new BodyCredential().generate();
      const bodyCredential2 = new BodyCredential().generate();
      await request(app.getHttpServer())
        .post('/credentials')
        .send(bodyCredential1)
        .set('Authorization', `Bearer ${body.token}`);

      return await request(app.getHttpServer())
        .post('/credentials')
        .send({ ...bodyCredential2, title: bodyCredential1.title })
        .set('Authorization', `Bearer ${body.token}`)
        .expect(HttpStatus.CONFLICT);
    });

    it('should create a credential', async () => {
      const bodyLogin = new BodySignIn().generate();
      await new SignUpFactory(prisma)
        .withEmail(bodyLogin.email)
        .withPassword(bodyLogin.password)
        .persist();

      const { body } = await login(app, bodyLogin);

      const bodyCredential = new BodyCredential().generate();
      await request(app.getHttpServer())
        .post('/credentials')
        .send(bodyCredential)
        .set('Authorization', `Bearer ${body.token}`)
        .expect(HttpStatus.CREATED);
    });
  });

  describe('/credentials (GET)', () => {
    it('should respond with status 401 if no token is given', async () => {
      await request(app.getHttpServer())
        .get('/credentials')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
      const token = faker.lorem.word();
      await request(app.getHttpServer())
        .get('/credentials')
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should respond with status 200 and with credentials data', async () => {
      const bodyLogin = new BodySignIn().generate();
      const user = await new SignUpFactory(prisma)
        .withEmail(bodyLogin.email)
        .withPassword(bodyLogin.password)
        .persist();

      const { body } = await login(app, bodyLogin);

      const credentialBody = new BodyCredential().generate();
      await new CredentialsFactory(prisma)
        .withBodyCredential(credentialBody)
        .withUserId(user.id)
        .persist();

      const response = await request(app.getHttpServer())
        .get('/credentials')
        .set('Authorization', `Bearer ${body.token}`)
        .expect(HttpStatus.OK);

      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            userId: user.id,
            title: credentialBody.title,
            username: credentialBody.username,
            url: credentialBody.url,
            password: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          }),
        ]),
      );
    });
  });

  describe('/credentials/:id (GET)', () => {
    it('should respond with status 401 if no token is given', async () => {
      await request(app.getHttpServer())
        .get('/credentials/1')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
      const token = faker.lorem.word();
      await request(app.getHttpServer())
        .get('/credentials/1')
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should respond with status 400 if :id not positive integer', async () => {
      const bodyLogin = new BodySignIn().generate();
      await new SignUpFactory(prisma)
        .withEmail(bodyLogin.email)
        .withPassword(bodyLogin.password)
        .persist();

      const { body } = await login(app, bodyLogin);

      await request(app.getHttpServer())
        .get('/credentials/a')
        .set('Authorization', `Bearer ${body.token}`)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should respond with status 400 if :id not positive integer', async () => {
      const bodyLogin = new BodySignIn().generate();
      await new SignUpFactory(prisma)
        .withEmail(bodyLogin.email)
        .withPassword(bodyLogin.password)
        .persist();

      const { body } = await login(app, bodyLogin);

      await request(app.getHttpServer())
        .get('/credentials/-1')
        .set('Authorization', `Bearer ${body.token}`)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should respond with status 404 if there is no credential for the submitted id', async () => {
      const bodyLogin = new BodySignIn().generate();
      await new SignUpFactory(prisma)
        .withEmail(bodyLogin.email)
        .withPassword(bodyLogin.password)
        .persist();

      const { body } = await login(app, bodyLogin);

      await request(app.getHttpServer())
        .get('/credentials/1')
        .set('Authorization', `Bearer ${body.token}`)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should respond with status 403 if credentials belongs to another user', async () => {
      const creatorBodySignIn = new BodySignIn().generate();
      const creatorUser = await new SignUpFactory(prisma)
        .withEmail(creatorBodySignIn.email)
        .withPassword(creatorBodySignIn.password)
        .persist();

      const credentialBody = new BodyCredential().generate();
      const credential = await new CredentialsFactory(prisma)
        .withBodyCredential(credentialBody)
        .withUserId(creatorUser.id)
        .persist();

      const bodyLogin = new BodySignIn().generate();
      await new SignUpFactory(prisma)
        .withEmail(bodyLogin.email)
        .withPassword(bodyLogin.password)
        .persist();

      const { body } = await login(app, bodyLogin);
      await request(app.getHttpServer())
        .get(`/credentials/${credential.id}`)
        .set('Authorization', `Bearer ${body.token}`)
        .expect(HttpStatus.FORBIDDEN);
    });

    it('should respond with status 200 and credential data', async () => {
      const bodyLogin = new BodySignIn().generate();
      const user = await new SignUpFactory(prisma)
        .withEmail(bodyLogin.email)
        .withPassword(bodyLogin.password)
        .persist();

      const credentialBody = new BodyCredential().generate();
      const credential = await new CredentialsFactory(prisma)
        .withBodyCredential(credentialBody)
        .withUserId(user.id)
        .persist();

      const { body } = await login(app, bodyLogin);

      const response = await request(app.getHttpServer())
        .get(`/credentials/${credential.id}`)
        .set('Authorization', `Bearer ${body.token}`)
        .expect(HttpStatus.OK);

      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            userId: user.id,
            title: credentialBody.title,
            username: credentialBody.username,
            url: credentialBody.url,
            password: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          }),
        ]),
      );
    });
  });

  describe('/credentials/:id (DELETE)', () => {
    it('should respond with status 401 if no token is given', async () => {
      await request(app.getHttpServer())
        .delete('/credentials/1')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
      const token = faker.lorem.word();
      await request(app.getHttpServer())
        .delete('/credentials/1')
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should respond with status 400 if :id not positive integer', async () => {
      const bodyLogin = new BodySignIn().generate();
      await new SignUpFactory(prisma)
        .withEmail(bodyLogin.email)
        .withPassword(bodyLogin.password)
        .persist();

      const { body } = await login(app, bodyLogin);

      await request(app.getHttpServer())
        .delete('/credentials/a')
        .set('Authorization', `Bearer ${body.token}`)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should respond with status 400 if :id not positive integer', async () => {
      const bodyLogin = new BodySignIn().generate();
      await new SignUpFactory(prisma)
        .withEmail(bodyLogin.email)
        .withPassword(bodyLogin.password)
        .persist();

      const { body } = await login(app, bodyLogin);

      await request(app.getHttpServer())
        .delete('/credentials/-1')
        .set('Authorization', `Bearer ${body.token}`)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should respond with status 404 if there is no credential for the submitted id', async () => {
      const bodyLogin = new BodySignIn().generate();
      await new SignUpFactory(prisma)
        .withEmail(bodyLogin.email)
        .withPassword(bodyLogin.password)
        .persist();

      const { body } = await login(app, bodyLogin);

      await request(app.getHttpServer())
        .delete('/credentials/1')
        .set('Authorization', `Bearer ${body.token}`)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should respond with status 403 if credential belongs to another user', async () => {
      const creatorBodySignIn = new BodySignIn().generate();
      const creatorUser = await new SignUpFactory(prisma)
        .withEmail(creatorBodySignIn.email)
        .withPassword(creatorBodySignIn.password)
        .persist();

      const credentialBody = new BodyCredential().generate();
      const credential = await new CredentialsFactory(prisma)
        .withBodyCredential(credentialBody)
        .withUserId(creatorUser.id)
        .persist();

      const bodyLogin = new BodySignIn().generate();
      await new SignUpFactory(prisma)
        .withEmail(bodyLogin.email)
        .withPassword(bodyLogin.password)
        .persist();

      const { body } = await login(app, bodyLogin);

      await request(app.getHttpServer())
        .delete(`/credentials/${credential.id}`)
        .set('Authorization', `Bearer ${body.token}`)
        .expect(HttpStatus.FORBIDDEN);
    });

    it('should respond with status 200 and delete credential data', async () => {
      const bodyLogin = new BodySignIn().generate();
      const user = await new SignUpFactory(prisma)
        .withEmail(bodyLogin.email)
        .withPassword(bodyLogin.password)
        .persist();

      const credentialBody = new BodyCredential().generate();
      const credential = await new CredentialsFactory(prisma)
        .withBodyCredential(credentialBody)
        .withUserId(user.id)
        .persist();

      const { body } = await login(app, bodyLogin);
      await request(app.getHttpServer())
        .delete(`/credentials/${credential.id}`)
        .set('Authorization', `Bearer ${body.token}`)
        .expect(HttpStatus.OK);

      await request(app.getHttpServer())
        .get(`/credentials/${credential.id}`)
        .set('Authorization', `Bearer ${body.token}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
