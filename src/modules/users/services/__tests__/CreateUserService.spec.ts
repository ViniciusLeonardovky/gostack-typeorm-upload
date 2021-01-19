import request from 'supertest';
import { Connection, getRepository, getConnection } from 'typeorm';
import createConnection from '@shared/infra/typeorm/index';

import { User } from '@modules/users/infra/typeorm/entities/User';

import { app } from '@shared/infra/http/app';

let connection: Connection;

describe('User', () => {
  beforeAll(async () => {
    connection = await createConnection('test-connection');

    await connection.query('DROP TABLE IF EXISTS transactions');
    await connection.query('DROP TABLE IF EXISTS categories');
    await connection.query('DROP TABLE IF EXISTS users');
    await connection.query('DROP TABLE IF EXISTS migrations');

    await connection.runMigrations();
  });

  beforeEach(async () => {
    await connection.query('DELETE FROM transactions');
    await connection.query('DELETE FROM categories');
    await connection.query('DELETE FROM users');
  });

  afterAll(async () => {
    const mainConnection = getConnection();

    await connection.close();
    await mainConnection.close();
  });

  it('should be able to create a new user', async () => {
    await request(app).post('/users').send({
      name: 'Nome maneiro',
      email: 'teste@teste.com',
      password: '123456',
    });

    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({
      where: { email: 'teste@teste.com' },
    });

    expect(user?.name).toBe('Nome maneiro');
    expect(user?.email).toBe('teste@teste.com');
  });

  it('should not be able to create a new user when e-mail already registered', async () => {
    await request(app).post('/users').send({
      name: 'Nome maneiro',
      email: 'teste@teste.com',
      password: '123456',
    });

    const response = await request(app).post('/users').send({
      name: 'Nome Legal',
      email: 'teste@teste.com',
      password: '123123',
    });

    const usersRepository = getRepository(User);

    const users = await usersRepository.find({
      where: { email: 'teste@teste.com' },
    });

    expect(response?.body.message).toBe('e-mail address already used');
    expect(users).toHaveLength(1);
  });
});
