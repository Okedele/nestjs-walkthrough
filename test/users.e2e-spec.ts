import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { UsersModule } from '../src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../src/database/entities/user.entity';
import { AuthModule } from '../src/auth/auth.module';

describe('Users', () => {
  let app: INestApplication;
  //   const catsService = { findAll: () => ['test'] };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        AuthModule,
        UsersModule,
        // Use the e2e_test database to run the tests
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: 'postgres',
          database: 'walthrough',
          entities: [User],
          synchronize: true,
          dropSchema: true,
        }),
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/POST auth/register`, async () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        firstName: 'Promise',
        lastName: 'Okedele',
        email: 'okedelep@gmail.com',
        phone: '07063394176',
        password: 'promise',
      })
      .expect(201);
  });

  it(`/POST auth/login`, async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'okedelep@gmail.com', password: 'promise' })
      .expect(201);
  });

  it(`/GET users`, async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'okedelep@gmail.com', password: 'promise' })
      .expect(201);
    // store the jwt token for the next request
    const {
      data: { jwt },
    } = loginResponse.body;
    return request(app.getHttpServer())
      .get('/users')
      .set('Authorization', 'Bearer ' + jwt)
      .expect(200);
  });

  it(`/GET users/id`, async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'okedelep@gmail.com', password: 'promise' })
      .expect(201);
    // store the jwt token for the next request
    const {
      data: { jwt },
    } = loginResponse.body;
    return request(app.getHttpServer())
      .get(`/users/${1}`)
      .set('Authorization', 'Bearer ' + jwt)
      .expect(200);
  });

  it(`/PATCH users/id`, async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'okedelep@gmail.com', password: 'promise' })
      .expect(201);
    // store the jwt token for the next request
    const {
      data: { jwt },
    } = loginResponse.body;
    return request(app.getHttpServer())
      .patch(`/users/${1}`)
      .send({ firstName: 'Promise_update' })
      .set('Authorization', 'Bearer ' + jwt)
      .expect(200);
  });

  it(`/DELETE users/id`, async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'okedelep@gmail.com', password: 'promise' })
      .expect(201);
    // store the jwt token for the next request
    const {
      data: { jwt },
    } = loginResponse.body;
    return request(app.getHttpServer())
      .delete(`/users/${1}`)
      .set('Authorization', 'Bearer ' + jwt)
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
