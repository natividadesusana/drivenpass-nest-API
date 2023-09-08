import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/prisma/prisma.service';
import { SignUpFactory } from '../factories/signup.factory';
import { login } from '../factories/signin.factory';
import { BodySignIn } from '../factories/signin.body';
import { faker } from '@faker-js/faker';
import { BodyNote } from '../factories/notes.body';
import { NotesFactory } from '../factories/notes.factory';
import { E2EUtils } from '../helpers';

describe('notesController (e2e)', () => {
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

  describe('/notes (POST)', () => {
    it('should respond with status 401 if no token is given', async () => {
      const bodyNote = new BodyNote().generate();
      await request(app.getHttpServer())
        .post('/notes')
        .send(bodyNote)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
      const token = faker.lorem.word();
      const bodyNote = new BodyNote().generate();
      await request(app.getHttpServer())
        .post('/notes')
        .send(bodyNote)
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

      const bodyNote1 = new BodyNote().generate();
      const bodyNote2 = new BodyNote().generate();
      await request(app.getHttpServer())
        .post('/notes')
        .send(bodyNote1)
        .set('Authorization', `Bearer ${body.token}`);

      return await request(app.getHttpServer())
        .post('/notes')
        .send({ ...bodyNote2, title: bodyNote1.title })
        .set('Authorization', `Bearer ${body.token}`)
        .expect(HttpStatus.CONFLICT);
    });

    it('should create a Note', async () => {
      const bodyLogin = new BodySignIn().generate();
      await new SignUpFactory(prisma)
        .withEmail(bodyLogin.email)
        .withPassword(bodyLogin.password)
        .persist();

      const { body } = await login(app, bodyLogin);

      const bodyNote = new BodyNote().generate();
      await request(app.getHttpServer())
        .post('/notes')
        .send(bodyNote)
        .set('Authorization', `Bearer ${body.token}`)
        .expect(HttpStatus.CREATED);
    });
  });

  describe('/notes (GET)', () => {
    it('should respond with status 401 if no token is given', async () => {
      await request(app.getHttpServer())
        .get('/notes')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
      const token = faker.lorem.word();
      await request(app.getHttpServer())
        .get('/notes')
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should respond with status 200 and with Notes data', async () => {
      const bodyLogin = new BodySignIn().generate();
      const user = await new SignUpFactory(prisma)
        .withEmail(bodyLogin.email)
        .withPassword(bodyLogin.password)
        .persist();

      const { body } = await login(app, bodyLogin);

      const noteBody = new BodyNote().generate();
      await new NotesFactory(prisma)
        .withBodyNote(noteBody)
        .withUserId(user.id)
        .persist();

      const response = await request(app.getHttpServer())
        .get('/notes')
        .set('Authorization', `Bearer ${body.token}`)
        .expect(HttpStatus.OK);

      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            userId: user.id,
            title: noteBody.title,
            anotation: noteBody.anotation,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          }),
        ]),
      );
    });
  });

  describe('/notes/:id (GET)', () => {
    it('should respond with status 401 if no token is given', async () => {
      await request(app.getHttpServer())
        .get('/notes/1')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
      const token = faker.lorem.word();
      await request(app.getHttpServer())
        .get('/notes/1')
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
        .get('/notes/a')
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
        .get('/notes/-1')
        .set('Authorization', `Bearer ${body.token}`)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should respond with status 404 if there is no Note for the submitted id', async () => {
      const bodyLogin = new BodySignIn().generate();
      await new SignUpFactory(prisma)
        .withEmail(bodyLogin.email)
        .withPassword(bodyLogin.password)
        .persist();

      const { body } = await login(app, bodyLogin);

      await request(app.getHttpServer())
        .get('/notes/1')
        .set('Authorization', `Bearer ${body.token}`)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should respond with status 403 if Notes belongs to another user', async () => {
      const creatorBodySignIn = new BodySignIn().generate();
      const creatorUser = await new SignUpFactory(prisma)
        .withEmail(creatorBodySignIn.email)
        .withPassword(creatorBodySignIn.password)
        .persist();

      const noteBody = new BodyNote().generate();
      const note = await new NotesFactory(prisma)
        .withBodyNote(noteBody)
        .withUserId(creatorUser.id)
        .persist();

      const bodyLogin = new BodySignIn().generate();
      await new SignUpFactory(prisma)
        .withEmail(bodyLogin.email)
        .withPassword(bodyLogin.password)
        .persist();

      const { body } = await login(app, bodyLogin);
      await request(app.getHttpServer())
        .get(`/notes/${note.id}`)
        .set('Authorization', `Bearer ${body.token}`)
        .expect(HttpStatus.FORBIDDEN);
    });

    it('should respond with status 200 and Note data', async () => {
      const bodyLogin = new BodySignIn().generate();
      const user = await new SignUpFactory(prisma)
        .withEmail(bodyLogin.email)
        .withPassword(bodyLogin.password)
        .persist();

      const noteBody = new BodyNote().generate();
      const note = await new NotesFactory(prisma)
        .withBodyNote(noteBody)
        .withUserId(user.id)
        .persist();

      const { body } = await login(app, bodyLogin);

      const response = await request(app.getHttpServer())
        .get(`/notes/${note.id}`)
        .set('Authorization', `Bearer ${body.token}`)
        .expect(HttpStatus.OK);

      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            userId: user.id,
            title: noteBody.title,
            anotation: noteBody.anotation,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          }),
        ]),
      );
    });
  });

  describe('/notes/:id (DELETE)', () => {
    it('should respond with status 401 if no token is given', async () => {
      await request(app.getHttpServer())
        .delete('/notes/1')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
      const token = faker.lorem.word();
      await request(app.getHttpServer())
        .delete('/notes/1')
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
        .delete('/notes/a')
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
        .delete('/notes/-1')
        .set('Authorization', `Bearer ${body.token}`)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should respond with status 404 if there is no Note for the submitted id', async () => {
      const bodyLogin = new BodySignIn().generate();
      await new SignUpFactory(prisma)
        .withEmail(bodyLogin.email)
        .withPassword(bodyLogin.password)
        .persist();

      const { body } = await login(app, bodyLogin);

      await request(app.getHttpServer())
        .delete('/notes/1')
        .set('Authorization', `Bearer ${body.token}`)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should respond with status 403 if Note belongs to another user', async () => {
      const creatorBodySignIn = new BodySignIn().generate();
      const creatorUser = await new SignUpFactory(prisma)
        .withEmail(creatorBodySignIn.email)
        .withPassword(creatorBodySignIn.password)
        .persist();

      const noteBody = new BodyNote().generate();
      const note = await new NotesFactory(prisma)
        .withBodyNote(noteBody)
        .withUserId(creatorUser.id)
        .persist();

      const bodyLogin = new BodySignIn().generate();
      await new SignUpFactory(prisma)
        .withEmail(bodyLogin.email)
        .withPassword(bodyLogin.password)
        .persist();

      const { body } = await login(app, bodyLogin);

      await request(app.getHttpServer())
        .delete(`/notes/${note.id}`)
        .set('Authorization', `Bearer ${body.token}`)
        .expect(HttpStatus.FORBIDDEN);
    });

    it('should respond with status 200 and delete note data', async () => {
      const bodyLogin = new BodySignIn().generate();
      const user = await new SignUpFactory(prisma)
        .withEmail(bodyLogin.email)
        .withPassword(bodyLogin.password)
        .persist();

      const noteBody = new BodyNote().generate();
      const note = await new NotesFactory(prisma)
        .withBodyNote(noteBody)
        .withUserId(user.id)
        .persist();

      const { body } = await login(app, bodyLogin);
      await request(app.getHttpServer())
        .delete(`/notes/${note.id}`)
        .set('Authorization', `Bearer ${body.token}`)
        .expect(HttpStatus.OK);

      await request(app.getHttpServer())
        .get(`/notes/${note.id}`)
        .set('Authorization', `Bearer ${body.token}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});